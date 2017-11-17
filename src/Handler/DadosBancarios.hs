{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.DadosBancarios where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

getDadosBancariosR :: Handler TypedContent
getDadosBancariosR = do
    dadosbancarios <- (runDB $ selectList [] [Asc DadosBancariosNome]) :: Handler [Entity DadosBancarios]
    sendStatusJSON created201 $ object["DadosBancarios" .= dadosbancarios]
