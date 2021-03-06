{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Empresa where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

--curl -v -X Get https://haskalpha-romefeller.c9users.io/empresa
getEmpresaR :: Handler TypedContent
getEmpresaR = do
    empresa <- (runDB $ selectList [] [])::Handler [Entity Empresa]
    sendStatusJSON created201 $ object["empresa".= empresa]

putEmpresaIdR :: EmpresaId -> Handler Value
putEmpresaIdR empresaId = do
    _ <- runDB $ get404 empresaId
    novaEmpresa <- requireJsonBody :: Handler Empresa
    runDB $ replace empresaId novaEmpresa
    sendStatusJSON noContent204 (object ["resp" .= ("UPDATED " ++ show (fromSqlKey empresaId))])

--insert into empresa values (1,'Almsaed Estudio LTDA.', 'AdminLTE', '12345678910111','Rua das Empresas num 57', 'Alphaville', '11222333','013991223344','adminlte@almsaed.com',1,26);