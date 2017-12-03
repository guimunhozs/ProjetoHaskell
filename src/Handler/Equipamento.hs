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
    -- equipamentos <- (runDB $ selectList [] [])::Handler [Entity Equipamento]
    -- sendStatusJSON created201 $ object["equipamentos".= equipamentos]
    result <- runDB $ do
        equip <- selectList [] []
        cli <- mapM (get . equipamentoClienteId . entityVal) equip
        return . zip equip $ catMaybes cli
    sendStatusJSON ok200 $ object ["result" .= result]
    
getEquipamentoIdR :: EquipamentoId -> Handler TypedContent
getEquipamentoIdR equipamentoId = do
    -- equipamento <- runDB $ get404 equipamentoId
    -- sendStatusJSON created201 $ object["equipamento".= equipamento]
    runDB $ do
        equip <- get404 equipamentoId
        cliente <- get404 $ equipamentoClienteId equip
        sendStatusJSON ok200 $ object ["Equipamento" .= equip, "Cliente" .= cliente]

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
    
getEquipamentoClienteIdR :: ClienteId -> Handler TypedContent
getEquipamentoClienteIdR clienteId = do
    _ <- runDB $ get404 clienteId
    equipamentos <- (runDB $ selectList[EquipamentoClienteId ==. clienteId][Asc EquipamentoId]) :: Handler [Entity Equipamento]
    sendStatusJSON created201 $ object ["Equipamento" .= equipamentos]

-- falta um path em quantidade
