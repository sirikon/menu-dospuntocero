import options

import ui/userInput
import api/menu20
import persistency/filesystem

var credentials = filesystem.getCredentials()
var credentialsJustIntroduced = false
if credentials.isNone:
  credentials = some(userInput.askForCredentials())
  credentialsJustIntroduced = true

let token = menu20.login(credentials.get())

let (successful, name) = menu20.verifyToken(token)

if successful:
  if credentialsJustIntroduced:
    echo "Login successful: ", name

  filesystem.setCredentials(credentials.get())

  let menu = menu20.getMenu(token, "03/09/2019")
  echo menu

else:
  echo "Login failed"
