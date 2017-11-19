{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Funcionario where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

--curl -v -X Get https://haskalpha-romefeller.c9users.io/funcionario
getFuncionarioR :: Handler TypedContent
getFuncionarioR = do
    funcionario <- (runDB $ selectList [FuncionarioExcluido ==. False][Asc FuncionarioNome]) :: Handler [Entity Funcionario]
    sendStatusJSON created201 $ object["Funcionario" .= funcionario]

-- curl -v -X POST https://haskalpha-romefeller.c9users.io/funcionario -d '{"nome" : "Funcionario Exemplar","cpf" : "12345678910","rg" : "123456789","dataNascimento" : "01/05/2017",	"email" : "funcionario@emprego.com.br","telefone" : "13999999999","logradouro" : "rua do funcionario 123",	"bairro" : "Empregados",	"cep" : "11222222",	"senha" : "123",	"nivel" : 0,"excluido" : false}'
postFuncionarioR :: Handler Value
postFuncionarioR = do
    funcionario <- (requireJsonBody :: Handler Funcionario)
    funcionarioId <- runDB $ insert funcionario
    sendStatusJSON created201 $ object["funcionarioId" .= funcionarioId] 
    
getFuncionarioIdR :: FuncionarioId -> Handler TypedContent
getFuncionarioIdR funcionarioId = do
    funcionario <- runDB $ get404 funcionarioId
    cidade <- runDB $ get404 $ funcionarioCidadeId funcionario
    estado <- runDB $ get404 $ funcionarioEstadoId $  funcionario
    sendStatusJSON ok200 $ object ["Funcionario" .= funcionario, "Cidade" .= cidade, "Estado" .= estado]
        
putFuncionarioIdR :: FuncionarioId -> Handler Value
putFuncionarioIdR funcionarioId = do
    _ <- runDB $ get404 funcionarioId
    novoFuncionario <- requireJsonBody :: Handler Funcionario
    runDB $ replace funcionarioId novoFuncionario
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey funcionarioId))])
    
deleteFuncionarioIdR :: FuncionarioId -> Handler Value
deleteFuncionarioIdR funcionarioId = do
    _ <- runDB $ get404 funcionarioId
    runDB $ delete funcionarioId
    sendStatusJSON noContent204 (object ["resp" .= ("DELETED" ++ show (fromSqlKey funcionarioId))])