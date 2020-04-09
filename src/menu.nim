import ui/userInput
import api/menu20

let credentials = userInput.askForCredentials()
echo credentials

let token = menu20.login(credentials)
echo "Token: ", token
echo menu20.verifyToken(token)
