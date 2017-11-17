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