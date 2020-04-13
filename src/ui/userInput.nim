import terminal

import ../domain/models

proc askForCredentials*(): Credentials =
  write(stdout, "Username: ")
  let username = readLine(stdin)
  let password = readPasswordFromStdin("Password: ")
  return Credentials(
      username: username,
      password: password)
