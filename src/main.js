const printer = require('./printer');
const configReader = require('./config-reader');
const menuService = require('./menu/menu-service');
const Sugar = require('sugar-date');

async function main() {
	try {
		await run();
	} catch (err) {
		printer.printError(err);
	}
}

async function run() {
	const config = await configReader.read();

	const when = process.argv.length > 2 ? process.argv.slice(2).join(' ') : 'today';
	const date = Sugar.Date.create(when);
	if (!isValidDate(date)) {
		console.log(`No he entendido la expresión de fecha '${when}'.`);
		console.log('Por ahora sólo entiendo expresiones en inglés. Tenlo en cuenta...');
		return;
	}

	const sessionId = await menuService.login(config.user, config.password);
	const menu = await menuService.getMenu(sessionId, date);

	printer.printMenu(menu);
}

function isValidDate(date) {
	return !isNaN(date.getTime());
}

main().then(() => {}, (err) => {
	console.log(err);
});
