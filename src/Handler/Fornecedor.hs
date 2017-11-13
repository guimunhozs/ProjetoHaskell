{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Fornecedor where
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql


--curl -X POST -v https://haskalpha-romefeller.c9users.io/fornecedor -d '{"nome":"Dell", "logradouro":"rua teste", "cep":"11040080", "cnpj":"25558605000123", "contato":"João","telefone":"13 33133131", "email":"contato@dell.com.br", "bairro":"teste", "excluido":false, "complemento":"3, apto 114", "cidadeId": 1, "estadoId":1}'        

postFornecedorR :: Handler TypedContent
postFornecedorR = do
    fornecedor <- (requireJsonBody :: Handler Fornecedor)
    fornecedorId <- runDB $ insert fornecedor
    sendStatusJSON created201 $ object["fornecedorId".= fornecedorId]

getFornecedorR :: Handler TypedContent
getFornecedorR = do
    fornecedores <- (runDB $ selectList [] [])::Handler [Entity Fornecedor]
    sendStatusJSON created201 $ object["fornecedores".= fornecedores]
    
getFornecedorIdR :: FornecedorId -> Handler TypedContent
getFornecedorIdR fornecedorId = do
    -- fornecedor <- runDB $ get404 fornecedorId
    -- sendStatusJSON created201 $ object["fornecedor".= fornecedor]
    runDB $ do
        forn <- get404 fornecedorId
        cidade <- get404 $ fornecedorCidadeId forn
        estado <- get404 $ fornecedorEstadoId forn
        sendStatusJSON ok200 $ object ["Fornecedor" .= forn, "Cidade" .= cidade, "Estado" .= estado]

-- verificar lsof -i:8080
deleteFornecedorIdR :: FornecedorId -> Handler Value
deleteFornecedorIdR fornecedorId = do
    _ <- runDB $ get404 fornecedorId
    runDB $ delete fornecedorId
    sendStatusJSON noContent204 (object["resp".=("Deleted" ++ show (fromSqlKey fornecedorId))])
    
putFornecedorIdR :: FornecedorId -> Handler Value
putFornecedorIdR fornecedorId = do
    _ <- runDB $ get404 fornecedorId
    novoFornecedor <- requireJsonBody :: Handler Fornecedor
    runDB $ replace fornecedorId novoFornecedor
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey fornecedorId))])
