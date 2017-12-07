{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Produto where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql
-- curl -X POST -v https://haskalpha-romefeller.c9users.io/produto -d '{"nome":"Fonte de Desktop","quantidade":5, "quantidadeMin":1, "valorCusto": 10.50, "valorVenda":22.50,"marca": "Corser","excluido":false, "fornecedorId": 2}'
postProdutoR :: Handler TypedContent
postProdutoR = do
    produto <- (requireJsonBody :: Handler Produto)
    produtoId <- runDB $ insert produto
    sendStatusJSON created201 $ object["produtoId".= produtoId]
    
getProdutoR :: Handler TypedContent
getProdutoR = do 
    result <- runDB $ do
        prods <- selectList [] []
        forns <- mapM (get . produtoFornecedorId . entityVal) prods
        return . zip prods $ catMaybes forns
    sendStatusJSON ok200 $ object ["result" .= result]
    
getProdutoIdR :: ProdutoId -> Handler TypedContent
getProdutoIdR produtoId = do
    runDB $ do
        prod <- get404 produtoId
        forn <- get404 $ produtoFornecedorId prod
        sendStatusJSON ok200 $ object ["produto" .= prod, "fornecedor" .= forn]


-- verificar
deleteProdutoIdR :: ProdutoId -> Handler Value
deleteProdutoIdR produtoId = do
    _ <- runDB $ get404 produtoId
    runDB $ delete produtoId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey produtoId))])
    
putProdutoIdR :: ProdutoId -> Handler Value
putProdutoIdR produtoId = do
    _ <- runDB $ get404 produtoId
    novoProduto <- requireJsonBody :: Handler Produto
    runDB $ replace produtoId novoProduto
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey produtoId))])


patchProdutoIdQtR :: ProdutoId -> Int -> Handler Value
patchProdutoIdQtR pid qt = do 
    _ <- runDB $ get404 pid
    runDB $ update pid [ProdutoQuantidade =. qt]
    sendStatusJSON noContent204 (object ["resp" .= (fromSqlKey pid)])
    
    -- oq estão fazendo?
    
-- getProdutoMinR :: Handler Value
-- getProdutoMinR = do
--     produto <- (runDB $ selectList [ProdutoQuantidade <. ( removeMonada ProdutoQuantidadeMin)][Asc ProdutoQuantidade]) :: Handler [Entity Produto]
--     sendStatusJSON created201 $ object ["Produtos" .= produto]

-- removeMaybe :: Maybe a -> a
-- removeMaybe (Just x) = x

-- removeMonada :: EntityField Produto (Maybe Int) -> Int
-- removeMonada  (Just x) = x
-- -- nao acha melhor fazer logo em js???? é apenas um foreach ou um filter