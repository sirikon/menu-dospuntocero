# Menu Dospuntocero CLI

Prints today's menu.

## Installation

```bash
git clone https://github.com/sirikon/menu-dospuntocero.git
cd menu-dospuntocero
npm i --production
npm link
```

## Configuration

Create the file `~/.menudospuntocero` with a structure like this:

```json
{
    "user": "xxx",
    "password": "xxx"
}
```

## Usage

Just run:

```bash
menu
menu tomorrow
menu monday
menu next monday
# etc
```
