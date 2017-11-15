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


