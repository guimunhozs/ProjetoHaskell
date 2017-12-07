{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}


--curl -X POST -v https://haskalpha-romefeller.c9users.io/estado -d '{"nome":"São Paulo", "sigla": "SP"}'
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
    estados <- (runDB $ selectList [] [Asc EstadoNome])::Handler [Entity Estado]
    sendStatusJSON created201 $ object["estados".= estados]
    
getEstadoIdR :: EstadoId -> Handler TypedContent
getEstadoIdR estadoId = do
    estado <- runDB $ get404 estadoId
    sendStatusJSON created201 $ object["estado".= estado]

-- verificar -------------------------------------------------------------------
deleteEstadoIdR :: EstadoId -> Handler Value
deleteEstadoIdR estadoId = do
    _ <- runDB $ get404 estadoId
    runDB $ delete estadoId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey estadoId))])
    
putEstadoIdR :: EstadoId -> Handler Value
putEstadoIdR estadoId = do
    _ <- runDB $ get404 estadoId
    novoEstado <- requireJsonBody :: Handler Estado
    runDB $ replace estadoId novoEstado
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey estadoId))])
