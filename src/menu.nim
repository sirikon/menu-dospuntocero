import httpClient
import strutils
# import marshal

proc parseSetCookieHeader(h: string): string =
    let keyValueChunk = split(h, ";")[0]
    let keyValueParts = split(keyValueChunk, "=")
    if keyValueParts.len == 2:
        return keyValueParts[1]
    else:
        return ""

let client = newHttpClient()
let response = client.get("https://micuenta.menudospuntocero.com/index.php?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=identificar")

if not response.headers.hasKey("Set-Cookie"):
    echo "No cookie found :("
    quit 0

let cookie = parseSetCookieHeader(response.headers["Set-Cookie"])
echo "Cookie: [", cookie, "]"
