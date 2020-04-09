import httpClient
import htmlparser
import xmltree
import strutils
import uri

const BASE_URL = "https://micuenta.menudospuntocero.com/index.php"
const LOGIN_URL = BASE_URL & "?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=identificar"

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

proc login*(username: string, password: string): string =
    let client = newHttpClient()
    let response = client.request(
        url=LOGIN_URL,
        httpMethod="POST",
        body="usuario=" & encodeUrl(username) & "&password=" & encodeUrl(password) & "&Entrar=Entrar%C2%A0%C2%BB",
        headers=newHttpHeaders({
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "micuenta.menudospuntocero.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv69.0) Gecko/20100101 Firefox/69.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
            "DNT": "1",
            "Connection": "keep-alive",
            "Referer": "https://micuenta.menudospuntocero.com/index.php",
            "Upgrade-Insecure-Requests": "1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
        }))
    if not response.headers.hasKey("Set-Cookie"):
        return ""
    return parseSetCookieHeader(response.headers["Set-Cookie"])

proc verifyToken*(token: string): (bool, string) =
    let client = newHttpClient()
    let response = client.request(
        url=BASE_URL,
        httpMethod="GET",
        headers=newHttpHeaders({
            "Cookie": "PHPSESSID=" & token,
            "Host": "micuenta.menudospuntocero.com",
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv69.0) Gecko/20100101 Firefox/69.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
            "DNT": "1",
            "Connection": "keep-alive",
            "Referer": "https://micuenta.menudospuntocero.com/index.php",
            "Upgrade-Insecure-Requests": "1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
        })
    )

    var verificationResult = (false, "")
    let document = parseHtml(response.body)

    for divEl in document.findAll("div"):
        if divEl.attr("class") == "latiguilloSuperior":
            for divEl in divEl.findAll("div"):
                if divEl.attr("class") == "centrador":
                    for i in 0..<divEl.len:
                        let text = divEl[i].innerText
                        if text.startsWith("Bienvenido"):
                            verificationResult = (true, parseVerificationText(text))

    return verificationResult
