{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Conta where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

getContasPagarR :: Handler TypedContent
getContasPagarR = do
    contas <- (runDB $ selectList [ContaIcPagarReceber ==. True][Desc ContaDataVencimento]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]

getContasReceberR :: Handler TypedContent
getContasReceberR = do
    contas <- (runDB $ selectList [ContaIcPagarReceber ==. False][Desc ContaDataVencimento]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]

postContaR :: Handler TypedContent
postContaR = do
    conta <- requireJsonBody :: Handler Conta
    contaId <- runDB $ insert conta
    sendStatusJSON created201 $ object["contaId" .= contaId]

putContaIdR :: ContaId -> Handler Value
putContaIdR contaId = do
    _ <- runDB $ get404 contaId
    novaConta <- requireJsonBody :: Handler Conta
    runDB $ replace contaId novaConta
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey contaId))])

deleteContaIdR :: ContaId -> Handler Value
deleteContaIdR contaId = do
    _ <- runDB $ get404 contaId
    runDB $ delete contaId
    sendStatusJSON noContent204 (object ["resp" .= ("DELETED" ++ show (fromSqlKey contaId))])
    
getContasPagarIdR :: ContaId -> Handler TypedContent
getContasPagarIdR contaId = do
     conta <- runDB $ get404 contaId
     fornecedor <- runDB $  get404 $ removeMaybe $ contaFornecedorId $ conta
     sendStatusJSON ok200 $ object ["Conta" .= conta, "Fornecedor" .= fornecedor]
     
getContasReceberIdR :: ContaId -> Handler TypedContent
getContasReceberIdR contaId = do
     conta <- runDB $ get404 contaId
     cliente <- runDB $  get404 $ removeMaybe $ contaClienteId $ conta
     sendStatusJSON ok200 $ object ["Conta" .= conta, "Cliente" .= cliente]

getContasPagarPagasR :: Handler TypedContent
getContasPagarPagasR = do
    contas <- (runDB $ selectList [ContaIcPagarReceber ==. True, ContaIcPago ==. True][Desc ContaDataVencimento]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]

getContasReceberPagasR :: Handler TypedContent
getContasReceberPagasR = do
    contas <- (runDB $ selectList [ContaIcPagarReceber ==. False, ContaIcPago ==. True][Desc ContaDataVencimento]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]

getContasPagarNaoPagasR :: Handler TypedContent
getContasPagarNaoPagasR = do
    contas <- (runDB $ selectList [ContaIcPagarReceber ==. True, ContaIcPago ==. False][Desc ContaDataVencimento]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]

getContasReceberNaoPagasR :: Handler TypedContent
getContasReceberNaoPagasR = do
    contas <- (runDB $ selectList [ContaIcPagarReceber ==. False, ContaIcPago ==. False][Desc ContaDataVencimento]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]



removeMaybe :: Maybe a -> a
removeMaybe (Just x) = x 

{-
/contasPagar/#ContaId                        ContasPagarIdR             GET

{
    "codigo" : "123445",
    "dataEmissao" : "2017-08-01",
    "dataVencimento" : "2017-08-01",
    "valor" : 120.00,
    "icPagarReceber" : true,
    "icPago": false,
    "clienteId" : 0,
    "fornecedorId" : 1
}

-}
--faltava o historico
-- curl -X POST -v https://haskalpha-romefeller.c9users.io/conta -d '{"historico":"compra de tal produto","codigo":"123445","dataEmissao":"2017-08-01","dataVencimento":"2017-08-01","valor":120.00,"icPagarReceber":true,"icPago":false,"clienteId":null,"fornecedorId":1}'