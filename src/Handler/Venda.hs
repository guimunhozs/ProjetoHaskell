{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Venda where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postVendaR :: Handler TypedContent
postVendaR = do
    venda <- (requireJsonBody :: Handler Venda)
    vendaId <- runDB $ insert venda
    sendStatusJSON created201 $ object["vendaId".= vendaId]
    
getVendaR :: Handler TypedContent
getVendaR = do 
    result <- runDB $ do
        venda <- selectList [VendaConcluida ==. True] []
        cli <- mapM (get . vendaClienteId . entityVal) venda
        func <- mapM (get . vendaFuncionarioId. entityVal) venda
        return $ zip3 venda (catMaybes func) (catMaybes cli)
    sendStatusJSON ok200 $ object ["result" .= result]
    
getVendaIdR :: VendaId -> Handler TypedContent
getVendaIdR vendaId = do
    (venda, func, cli, itens)<- runDB $ do
        venda <- get404 vendaId
        func <- get404 $ vendaFuncionarioId venda
        cli <- get404 $ vendaClienteId venda
        item <- selectList [ItemVendaVendaId ==. vendaId] []
        prod <- mapM (get. itemVendaProdutoId . entityVal) item
        return (venda, func, cli, zip item prod)
    sendStatusJSON ok200 $ object ["venda" .= venda, "funcionario" .= func, "cliente" .= cli, "itemVenda" .= itens]

deleteVendaIdR :: VendaId -> Handler Value
deleteVendaIdR vendaId = do
    _ <- runDB $ get404 vendaId
    runDB $ delete vendaId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey vendaId))])
    
putVendaIdR :: VendaId -> Handler Value
putVendaIdR vendaId = do
    _ <- runDB $ get404 vendaId
    novoVenda <- requireJsonBody :: Handler Venda
    runDB $ replace vendaId novoVenda
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey vendaId))])
    
patchVendaIdR :: VendaId -> Handler Value
patchVendaIdR vid = do 
    _ <- runDB $ get404 vid
    runDB $ update vid [VendaConcluida =. False]
    sendStatusJSON noContent204 (object ["resp" .= (fromSqlKey vid)])
    

    