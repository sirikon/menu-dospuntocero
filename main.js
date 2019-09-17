const fs = require('fs');
const os = require('os');
const path = require('path');
const MenuService = require('./src/menu-service');

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const CONFIG_PATH = path.join(os.homedir(), '.menudospuntocero');

async function main() {
    const ms = new MenuService();
    const sessionId = await ms.getSessionId();

    const config = await readConfig();

    await ms.login(sessionId, config.user, config.password);
    const menu = await ms.getMenu(sessionId);
    
    if (menu.empty) {
        console.log('No tienes nada para comer hoy :(');
        return;
    }

    printMenu(menu);
}

async function readConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        console.log('Configuración no encontrada.')
        console.log(`Crea el fichero "${CONFIG_PATH}" en tu carpeta personal con un contenido como este:`)
        console.log(JSON.stringify({
            user: 'xxx',
            password: 'xxx'
        }, null, 2))
        process.exit(1);
    }
    const data = fs.readFileSync(CONFIG_PATH, { encoding: 'utf8' });
    return JSON.parse(data)
}

function printMenu(menu) {
    const today = new Date();

    const headerText = `Menú para hoy, ${today.getDate()} de ${MONTHS[today.getMonth()]}:`;
    const footerText = `${menu.kcal} KCal`;
    
    const width = getWidth(menu.dishes.concat([headerText, footerText])) + 2;

    console.log(` ${pad(' ', width)} `);
    console.log(`  ${headerText}${pad(' ', width - headerText.length - 2)}  `)
    console.log(`┌${pad('─', width)}┐`);
    menu.dishes.forEach(dish => {
        console.log(`│ ${dish}${pad(' ', width - dish.length - 2)} │`)
    })
    console.log(`└${pad('─', width)}┘`);
    console.log(`  ${pad(' ', width - footerText.length - 2)}${footerText}  `)
    console.log(` ${pad(' ', width)} `);
}

function pad(pad, length) {
    const result = [];
    for(let i = 0; i < length; i++) {
        result.push(pad);
    }
    return result.join('');
}

function getWidth(paragraphs) {
    let max = 0;
    paragraphs.forEach(p => {
        if (p.length > max) {
            max = p.length;
        }
    })
    return max;
}

main().then(() => {}, (err) => {
    console.log(err);
});
