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
    result <- runDB $ do
        servico <- selectList [] []
        equip   <- mapM (get . servicoEquipamentoId . entityVal) servico
        cliente <- mapM (get . equipamentoClienteId) (catMaybes equip)
        return $ zip3 servico (catMaybes equip)  (catMaybes cliente) 
    sendStatusJSON ok200 $ object ["result" .= result]
    --testar
    
patchServicoIdStatusR :: ServicoId -> Int -> Handler Value
patchServicoIdStatusR sid status = do 
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
    (serv, equip, cli, andaF) <- runDB $ do
        serv  <- get404 servicoId
        equip <- get404 $ servicoEquipamentoId serv
        cli   <- get404 $ equipamentoClienteId equip
        anda  <- selectList [AndamentoServicoId ==. servicoId] []
        func  <- mapM (get404 . andamentoFuncionarioId . entityVal) anda
        return (serv, equip, cli, zip anda func)
    sendStatusJSON ok200 $ object ["Servico" .= serv, "Equipamento" .= equip, "Cliente" .= cli, "Andamento" .= andaF]
    
    
--https://www.stackage.org/haddock/lts-9.12/yesod-core-1.4.37/Yesod-Core-Handler.html#v:lookupSession