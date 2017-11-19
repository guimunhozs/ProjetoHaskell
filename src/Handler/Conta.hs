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