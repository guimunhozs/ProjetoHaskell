{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.ItemVenda where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postItemVendaR :: Handler TypedContent
postItemVendaR = do
    itemVenda <- (requireJsonBody :: Handler ItemVenda)
    itemVendaId <- runDB $ insert itemVenda
    sendStatusJSON created201 $ object["itemVendaId".= itemVendaId]
    
getItemVendaVendaR :: VendaId -> Handler TypedContent
getItemVendaVendaR vendaId = do
    result <- runDB $ do
        itens <- selectList [ItemVendaVendaId ==. vendaId] []
        prod  <- mapM (get . itemVendaProdutoId . entityVal) itens
        return $ zip itens (catMaybes prod)
    sendStatusJSON ok200 $ object ["result" .= result]

deleteItemVendaIdR :: ItemVendaId -> Handler Value
deleteItemVendaIdR itemVendaId = do
    _ <- runDB $ get404 itemVendaId
    runDB $ delete itemVendaId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey itemVendaId))])
    
putItemVendaIdR :: ItemVendaId -> Handler Value
putItemVendaIdR itemVendaId = do
    _ <- runDB $ get404 itemVendaId
    novoItemVenda <- requireJsonBody :: Handler ItemVenda
    runDB $ replace itemVendaId novoItemVenda
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey itemVendaId))])
    