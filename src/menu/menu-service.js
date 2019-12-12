const qs = require('qs');
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const htmlParser = require('./html-parser');

const BASE_URL = 'https://micuenta.menudospuntocero.com/index.php';

async function login(user, password) {
	const sessionId = await getSessionId();

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
		url: getLoginUrl()
	};

	const response = await axios(request);
	const dom = new JSDOM(response.data);
	htmlParser.verifyIdentificationElementExists(dom.window.document);	
	return sessionId;
}

async function getMenu(sessionId, date) {
	const url = getMenuUrl();

	const dateFormatted = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

	const data = {
		desde: dateFormatted,
		hasta: dateFormatted
	};

	const request = {
		method: 'POST',
		headers: buildHeaders(sessionId),
		data: qs.stringify(data),
		url,
	};

	const response = await axios(request);
	const dom = new JSDOM(response.data);
	htmlParser.verifyIdentificationElementExists(dom.window.document);

	const anyGroup = dom.window.document.querySelector('#tablaPedidos .listadomenu .grupo');
	if (!anyGroup) { return { dishes: [] }; }

	const ordersTable = dom.window.document.querySelector('#tablaPedidos .listadomenu .grupo').parentElement;

	const menu = htmlParser.parseMenu(ordersTable);
	menu.date = date;

	return menu;
}

async function getSessionId() {
	const request = {
		method: 'GET',
		headers: buildHeaders(),
		url: BASE_URL
	};
	const response = await axios(request);
	const sessionId = getSessionIdFromResponse(response);
	return sessionId;
}

function getLoginUrl() {
	return `${BASE_URL}?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=identificar`;
}

function getMenuUrl() {
	return `${BASE_URL}?idioma=es&seccion=11&ctipo=15&contenido=0&accion=mnuuser&opcion=pedidos`;
}

function getSessionIdFromResponse(response) {
	return response.headers['set-cookie'][0]
		.split(';')[0].replace('PHPSESSID=', 0).trim();
}

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
	};
	if (cookie) {
		result['Cookie'] = `PHPSESSID=${cookie}`;
	}
	return result;
}

module.exports = {
	getSessionId,
	login,
	getMenu
};
