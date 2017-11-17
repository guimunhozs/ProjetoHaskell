{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.DadosBancarios where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

--curl -v -X Get https://haskalpha-romefeller.c9users.io/dadosbancarios
getDadosBancariosR :: Handler TypedContent
getDadosBancariosR = do
    dadosbancarios <- (runDB $ selectList [] [Asc DadosBancariosNome]) :: Handler [Entity DadosBancarios]
    sendStatusJSON created201 $ object["DadosBancarios" .= dadosbancarios]

postDadosBancariosR :: Handler Value
postDadosBancariosR = do
    dadosbancarios <- (requireJsonBody :: Handler DadosBancarios)
    dadosbancariosId <- runDB $ insert dadosbancarios
    sendStatusJSON created201 $ object["DadosBancariosId" .= dadosbancariosId]