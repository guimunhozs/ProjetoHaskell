{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Andamento where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postAndamentoR :: Handler TypedContent
postAndamentoR = do
    andamento <- (requireJsonBody :: Handler Andamento)
    andamentoId <- runDB $ insert andamento
    sendStatusJSON created201 $ object["andamentoId".= andamentoId]
    
getAndamentoR :: Handler TypedContent
getAndamentoR = do 
    result <- runDB $ do
        andamento <- selectList [] []
        func <- mapM (get . andamentoFuncionarioId . entityVal) andamento
        return . zip andamento $ catMaybes func
    sendStatusJSON ok200 $ object ["result" .= result]
    
getAndamentoIdR :: AndamentoId -> Handler TypedContent
getAndamentoIdR andamentoId = do
    runDB $ do
        andamento <- get404 andamentoId
        func <- get404 $ andamentoFuncionarioId andamento
        sendStatusJSON ok200 $ object ["andamento" .= andamento, "funcionario" .= func]

deleteAndamentoIdR :: AndamentoId -> Handler Value
deleteAndamentoIdR andamentoId = do
    _ <- runDB $ get404 andamentoId
    runDB $ delete andamentoId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey andamentoId))])
    
putAndamentoIdR :: AndamentoId -> Handler Value
putAndamentoIdR andamentoId = do
    _ <- runDB $ get404 andamentoId
    novoAndamento <- requireJsonBody :: Handler Andamento
    runDB $ replace andamentoId novoAndamento
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey andamentoId))])
    
getAndamentoServR :: ServicoId -> Handler Value
getAndamentoServR sid = do
    result <- runDB $ do
        andamento <- selectList [AndamentoServicoId ==. sid] []
        func <- mapM (get . andamentoFuncionarioId . entityVal) andamento
        return . zip andamento $ catMaybes func
    sendStatusJSON ok200 $ object ["result" .= result]

patchAndamentoIdStatusR :: AndamentoId -> Handler Value
patchAndamentoIdStatusR aid = do
    _ <- runDB $ get404 aid
    runDB $ update aid [AndamentoStatus =. (pack "Finalizado")]
    sendStatusJSON noContent204 (object ["resp" .= (fromSqlKey aid)])

    