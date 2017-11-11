{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Equipamento where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postEquipamentoR :: Handler TypedContent
postEquipamentoR = do
    equipamento <- (requireJsonBody :: Handler Equipamento)
    equipamentoId <- runDB $ insert equipamento
    sendStatusJSON created201 $ object["equipamento".= equipamentoId]
    
getEquipamentoR :: Handler TypedContent
getEquipamentoR = do
    equipamentos <- (runDB $ selectList [] [])::Handler [Entity Equipamento]
    sendStatusJSON created201 $ object["equipamentos".= equipamentos]
    
getEquipamentoIdR :: EquipamentoId -> Handler TypedContent
getEquipamentoIdR equipamentoId = do
    equipamento <- runDB $ get404 equipamentoId
    sendStatusJSON created201 $ object["equipamento".= equipamento]

-- verificar
deleteEquipamentoIdR :: EquipamentoId -> Handler Value
deleteEquipamentoIdR equipamentoId = do
    _ <- runDB $ get404 equipamentoId
    runDB $ delete equipamentoId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey equipamentoId))])
    
putEquipamentoIdR :: EquipamentoId -> Handler Value
putEquipamentoIdR equipamentoId = do
    _ <- runDB $ get404 equipamentoId
    novoEquipamento <- requireJsonBody :: Handler Equipamento
    runDB $ replace equipamentoId novoEquipamento
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey equipamentoId))])

-- falta um path em quantidade
