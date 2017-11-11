{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Empresa where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

--curl -v -X Get https://haskalpha-romefeller.c9users.io/empresa
getEmpresaR :: Handler TypedContent
getEmpresaR = do
    empresa <- (runDB $ selectList [] [])::Handler [Entity Empresa]
    sendStatusJSON created201 $ object["empresa".= empresa]