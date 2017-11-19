{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Conta where
    
import Import
import Network.HTTP.Types.Status
import Database.Persist.Postgresql

getContaR :: Handler TypedContent
getContaR = do
    contas <- (runDB $ selectList [][]) :: Handler [Entity Conta]
    sendStatusJSON created201 $ object["Conta" .= contas]


