{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Servico where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postServicoR :: Handler TypedContent
postServicoR = do
    servico <- (requireJsonBody :: Handler Servico)
    servicoId <- runDB $ insert servico
    sendStatusJSON created201 $ object["servicoId".= servicoId]
    
getServicoR :: Handler TypedContent
getServicoR = do
    servicos <- (runDB $ selectList [] [])::Handler [Entity Servico]
    sendStatusJSON created201 $ object["servicos".= servicos]
    
pathServicoIdQtR :: ServicoId -> Int -> Handler Value
pathServicoIdQtR sid status = do 
    _ <- runDB $ get404 sid
    runDB $ update sid [ServicoStatus =. status]
    sendStatusJSON noContent204 (object ["resp" .= (fromSqlKey sid)])
    
putServicoIdR :: ServicoId -> Handler Value
putServicoIdR ServicoId = do
    _ <- runDB $ get404 ServicoId
    novoServico <- requireJsonBody :: Handler Servico
    runDB $ replace ServicoId novoServico
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey ServicoId))])
    
getServicoIdR :: ServicoId -> Handler TypedContent
getServicoIdR ServicoId = do
    Servico <- runDB $ get404 ServicoId
    sendStatusJSON created201 $ object["Servico".= Servico]