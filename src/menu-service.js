const qs = require('qs');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function buildHeaders(cookie) {
    const result = {
        'Host': 'micuenta.menudospuntocero.com',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv69.0) Gecko/20100101 Firefox/69.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://micuenta.menudospuntocero.com/index.php',
        'Upgrade-Insecure-Requests': '1',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
    }
    if (cookie) {
        result['Cookie'] = `PHPSESSID=${cookie}`
    }
    return result;
}

function parseOrders(table) {
    const headers = table.querySelectorAll('tbody > tr:not(.datosMenu)');
    const weeks = [];

    for(let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const dayHeaders = header.querySelectorAll('.fechaMenu')
        const week = [];

        for(let y = 0; y < dayHeaders.length; y++) {
            const dayHeader = dayHeaders[y];
            week.push({day: dayHeader.textContent})
        }

        const menus = header.nextSibling.querySelectorAll('.listadomenu')

        for(let y = 0; y < menus.length; y++) {
            const day = week[y];
            const menu = menus[y].querySelector('.grupo');
            day.dishes = [];
            day.empty = false;
            parseMenu(menu, day);
        }

        weeks.push(week);
    }
    
    return weeks;
}

function parseMenu(menu, _result) {
    const result = _result || {
        kcal: 0,
        empty: false,
        dishes: []
    }

    if (!menu) {
        result.empty = true;
        return;
    }

    result.kcal = parseInt(menu.querySelector('dd.tit').textContent.split('/')[1].replace('KCal', '').trim())
    const dishes = menu.querySelectorAll('dd:not(.tit)');
    for(let x = 0; x < dishes.length; x++) {
        result.dishes.push(dishes[x].textContent.trim());
    }

    return result;
}

class MenuService {
    constructor() {
        this.baseUrl = 'https://micuenta.menudospuntocero.com/index.php'
    }

    getLoginUrl() {
        return `${this.baseUrl}?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=identificar`
    }

    getMenuUrl() {
        return `${this.baseUrl}?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=pedidos`
    }

    async getSessionId() {
        const url = this.baseUrl;

        const request = {
            method: 'GET',
            headers: buildHeaders(),
            url,
        };

        const response = await axios(request);

        const sessionId = response.headers['set-cookie'][0]
            .split(';')[0].replace('PHPSESSID=', 0).trim();

        return sessionId;
    }

    async login(sessionId, user, password) {
        const url = this.getLoginUrl();

        const data = {
            usuario: user,
            password: password,
            Entrar: 'Entrar »'
        };

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...buildHeaders(sessionId)
            },
            data: qs.stringify(data),
            url,
        };

        const response = await axios(request);

        const dom = new JSDOM(response.data);

        const identificationElement = dom.window.document.querySelector('.latiguilloSuperior .centrador img');
        if (identificationElement === null) {
            throw new Error("Login failed. Identification element not found.")
        }
        const text = identificationElement.nextSibling.textContent.trim();
        if (text === "") {
            throw new Error("Login failed. Identification text not found.")
        }

        return sessionId;
    }

    async getMenu(sessionId) {
        const url = this.getMenuUrl();

        const today = new Date();
        const todayFormatted = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;

        const data = {
            desde: todayFormatted,
            hasta: todayFormatted
        };

        const request = {
            method: 'POST',
            headers: buildHeaders(sessionId),
            data: qs.stringify(data),
            url,
        };

        const response = await axios(request);
        const dom = new JSDOM(response.data);

        const ordersTable = dom.window.document.querySelector('#tablaPedidos .listadomenu .grupo');

        return parseMenu(ordersTable);
    }
}

module.exports = MenuService;
