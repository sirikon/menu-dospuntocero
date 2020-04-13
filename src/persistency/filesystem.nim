import os
import options
import json

import ../domain/models

type Config = object
  credentials: Option[Credentials]

proc getConfigFolderPath(): string =
  joinPath(getConfigDir(), "menu-dospuntocero")

proc getConfigFilePath(): string =
  joinPath(getConfigFolderPath(), "config.json")

proc ensureConfigFolder() =
  createDir(getConfigFolderPath())

proc saveConfig(config: Config) =
  writeFile(getConfigFilePath(), $(%*config))

proc getConfig(): Config =
  ensureConfigFolder()
  let configFilePath = getConfigFilePath()
  if fileExists(configFilePath):
    return to(parseFile(configFilePath), Config)
  else:
    let config = Config(
        credentials: none(Credentials))
    saveConfig(config)
    return config

proc getCredentials*(): Option[Credentials] =
  return getConfig().credentials

proc setCredentials*(credentials: Credentials) =
  var config = getConfig()
  config.credentials = some(credentials)
  saveConfig(config)
