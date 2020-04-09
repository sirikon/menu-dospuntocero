# Package

version       = "0.1.0"
author        = "Carlos Fdez. Llamas"
description   = "Menu 2.0 CLI"
license       = "GPL-2.0"
srcDir        = "src"
bin           = @["menu"]
binDir        = "out"



# Dependencies

requires "nim >= 1.2.0"

task release, "generate binary for distribution":
    exec "nimble build -d:release --opt:size && strip -s ./out/*"
