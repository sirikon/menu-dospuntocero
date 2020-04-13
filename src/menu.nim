import options

import ui/userInput
import api/menu20
import persistency/filesystem

var credentials = filesystem.getCredentials()
if credentials.isNone:
  credentials = some(userInput.askForCredentials())

let token = menu20.login(credentials.get())

let (successful, name) = menu20.verifyToken(token)

if successful:
  echo "Login successful: ", name
  filesystem.setCredentials(credentials.get())
else:
  echo "Login failed"
