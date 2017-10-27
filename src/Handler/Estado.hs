{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Estado where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postEstadoR :: Handler TypedContent
postEstadoR = do
    estado <- (requireJsonBody :: Handler Estado)
    estadoId <- runDB $ insert estado
    sendStatusJSON created201 $ object["estadoId".= estadoId]
    
getEstadoR :: Handler TypedContent
getEstadoR = do
    estados <- (runDB $ selectList [] [])::Handler [Entity Estado]
    sendStatusJSON created201 $ object["estados".= estados]
    
getEstadoIdR :: EstadoId -> Handler TypedContent
getEstadoIdR estadoId = do
    estado <- runDB $ get404 estadoId
    sendStatusJSON created201 $ object["estado".= estado]
