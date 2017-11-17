{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Cliente where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

--curl -v -X Get https://haskalpha-romefeller.c9users.io/cliente
{-
getClienteR :: Handler TypedContent
getClienteR = do
    cliente <- (runDB $ selectList [] [])::Handler [Entity Cliente]
    sendStatusJSON created201 $ object["cliente".= cliente] 
-}

getClienteR :: Handler TypedContent
getClienteR = do
    cliente <- (runDB $ selectList [ClienteExcluido ==. False][Asc ClienteNome]) :: Handler [Entity Cliente]
    sendStatusJSON created201 $ object["Cliente" .= cliente]

--curl -X POST -v https://haskalpha-romefeller.c9users.io/cliente -d '{"nome" : "carrara" , "rg" :  "45454545" , "cpf" : "12345678910" , "logradouro" :"Rua do tcc pronto 10" , "bairro": "Entrega" , "cep" : "11123456" , "telefone" :"13999999999" , "email" : "agustinho@carrara.com.br" , "excluido" : false, "cidadeId" :1, "estadoId" : 1 }'postClienteR :: Handler TypedContent
postClienteR :: Handler TypedContent
postClienteR = do
    cliente <- (requireJsonBody :: Handler Cliente)
    clienteId <- runDB $ insert cliente
    sendStatusJSON created201 $ object["clienteId" .= clienteId]

--curl -X DELETE -v https://haskalpha-romefeller.c9users.io/cliente/3
deleteClienteIdR :: ClienteId -> Handler Value
deleteClienteIdR clienteId = do
    _ <- runDB $ get404 clienteId
    runDB $ delete clienteId
    sendStatusJSON noContent204 (object["resp" .= ("Deleted" ++ show (fromSqlKey clienteId))])

putClienteIdR :: ClienteId -> Handler Value
putClienteIdR clienteId = do 
    _ <- runDB $ get404 clienteId
    novoCliente <- requireJsonBody :: Handler Cliente
    runDB $ replace clienteId novoCliente
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey clienteId))])
    
patchClienteIdR :: ClienteId -> Handler Value
patchClienteIdR clienteId = do 
    _ <- runDB $ get404 clienteId
    runDB $ update clienteId [ClienteExcluido =. True]
    sendStatusJSON noContent204 (object ["resp" .= (fromSqlKey clienteId)])
    
getClienteIdR :: ClienteId -> Handler TypedContent
getClienteIdR clienteId = do
    runDB $ do 
        cliente <- get404 clienteId
        cidade <- get404 $ clienteCidadeId $  cliente
        estado <- get404 $ clienteEstadoId $  cliente
        sendStatusJSON ok200 $ object ["Cliente" .= cliente, "Cidade" .= cidade, "Estado" .= estado]