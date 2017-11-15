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
getClienteR :: Handler TypedContent
getClienteR = do
    cliente <- (runDB $ selectList [] [])::Handler [Entity Cliente]
    sendStatusJSON created201 $ object["cliente".= cliente]

--curl -X POST -v https://haskalpha-romefeller.c9users.io/cliente -d '{"nome" : "carrara" , "rg" :  "45454545" , "cpf" : "12345678910" , "logradouro" :"Rua do tcc pronto 10" , "bairro": "Entrega" , "cep" : "11123456" , "telefone" :"13999999999" , "email" : "agustinho@carrara.com.br" , "excluido" : false, "cidadeId" :1, "estadoId" : 1 }'postClienteR :: Handler TypedContent
postClienteR = do
    cliente <- (requireJsonBody :: Handler Cliente)
    clienteId <- runDB $ insert cliente
    sendStatusJSON created201 $ object["clienteId" .= clienteId]