import terminal

import ./api

write(stdout, "Username: ")
var username = readLine(stdin)
var password = readPasswordFromStdin("Password: ")

let token = api.login(username, password)
echo "Token: ", token
echo api.verifyToken(token)
