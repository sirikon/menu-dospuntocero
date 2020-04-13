import httpClient
import htmlparser
import xmltree
import strutils
import uri
import sequtils

import ../domain/models

const BASE_URL = "https://micuenta.menudospuntocero.com/index.php"
const LOGIN_URL = BASE_URL & "?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=identificar"
const MENU_URL = BASE_URL & "?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=pedidos"
const BASE_HEADERS = {
  "Host": "micuenta.menudospuntocero.com",
  "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv69.0) Gecko/20100101 Firefox/69.0",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
  "DNT": "1",
  "DNT": "1",
  "Connection": "keep-alive",
  "Referer": "https://micuenta.menudospuntocero.com/index.php",
  "Upgrade-Insecure-Requests": "1",
  "Pragma": "no-cache",
  "Cache-Control": "no-cache",
}.toSeq

proc buildHeaders(headers: openArray[tuple[key: string, val: string]]): HttpHeaders =
  return newHttpHeaders(concat(BASE_HEADERS, headers.toSeq))

proc parseSetCookieHeader(h: string): string =
  let keyValueChunk = split(h, ";")[0]
  let keyValueParts = split(keyValueChunk, "=")
  if keyValueParts.len == 2:
    return keyValueParts[1]
  else:
    return ""

proc parseVerificationText(h: string): string =
  let firstLine = split(h, "\n")[0]
  return split(firstLine, ", ")[1]

proc verifyIsLoggedIn(html: string): (bool, string) =
  result = (false, "")
  let document = parseHtml(html)

  for divEl in document.findAll("div"):
    if divEl.attr("class") == "latiguilloSuperior":
      for divEl in divEl.findAll("div"):
        if divEl.attr("class") == "centrador":
          for i in 0..<divEl.len:
            let text = divEl[i].innerText
            if text.startsWith("Bienvenido"):
              result = (true, parseVerificationText(text))

proc login*(credentials: Credentials): string =
  let client = newHttpClient()
  let response = client.request(
    url = LOGIN_URL,
    httpMethod = "POST",
    body = {
      "usuario": credentials.username,
      "password": credentials.password,
      "Entrar": "Entrar »"
    }.encodeQuery(),
    headers = buildHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
    })
  )
  if not response.headers.hasKey("Set-Cookie"):
    return ""
  return parseSetCookieHeader(response.headers["Set-Cookie"])

proc verifyToken*(token: string): (bool, string) =
  let client = newHttpClient()
  let response = client.request(
    url = BASE_URL,
    httpMethod = "GET",
    headers = buildHeaders({
      "Cookie": "PHPSESSID=" & token,
    })
  )
  return verifyIsLoggedIn(response.body)

proc getMenu*(token: string, date: string): seq[string] =
  let client = newHttpClient()
  let response = client.request(
    url = MENU_URL,
    httpMethod = "POST",
    body = {
      "ssl": "1",
      "idioma": "",
      "seccion": "11",
      "ctipo": "15",
      "contenido": "0",
      "accion": "mnuuser",
      "opcion": "pedidos",
      "desde": date,
      "hasta": date,
      "botonListado": "Listado"
    }.encodeQuery(),
    headers = buildHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": "PHPSESSID=" & token,
    })
  )
  var plates = newSeq[string]()
  let document = parseHtml(response.body)
  for el in document.findAll("td"):
    if el.attr("class") == "normal listadomenu":
      for el in el.findAll("dd"):
        if el.attr("class") != "tit":
          plates.add(el.attr("title"))
  return plates
