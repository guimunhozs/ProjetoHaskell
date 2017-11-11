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
    
pathServicoIdStatusR :: ServicoId -> Int -> Handler Value
pathServicoIdStatusR sid status = do 
    _ <- runDB $ get404 sid
    runDB $ update sid [ServicoStatus =. status]
    sendStatusJSON noContent204 (object ["resp" .= (fromSqlKey sid)])
    
putServicoIdR :: ServicoId -> Handler Value
putServicoIdR servicoId = do
    _ <- runDB $ get404 servicoId
    novoServico <- requireJsonBody :: Handler Servico
    runDB $ replace servicoId novoServico
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey servicoId))])
    
getServicoIdR :: ServicoId -> Handler TypedContent
getServicoIdR servicoId = do
    servico <- runDB $ get404 servicoId
    sendStatusJSON created201 $ object["servico".= servico]
    
    
--https://www.stackage.org/haddock/lts-9.12/yesod-core-1.4.37/Yesod-Core-Handler.html#v:lookupSession