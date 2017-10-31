{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Produto where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

postProdutoR :: Handler TypedContent
postProdutoR = do
    produto <- (requireJsonBody :: Handler Produto)
    produtoId <- runDB $ insert produto
    sendStatusJSON created201 $ object["produtoId".= produtoId]
    
getProdutoR :: Handler TypedContent
getProdutoR = do
    produtos <- (runDB $ selectList [] [])::Handler [Entity Produto]
    sendStatusJSON created201 $ object["produtos".= produtos]
    
getProdutoIdR :: ProdutoId -> Handler TypedContent
getProdutoIdR produtoId = do
    produto <- runDB $ get404 produtoId
    sendStatusJSON created201 $ object["produto".= produto]
