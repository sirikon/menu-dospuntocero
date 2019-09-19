const printer = require('./printer');
const configReader = require('./config-reader');
const menuService = require('./menu/menu-service');

async function main() {
	try {
		await run();
	} catch (err) {
		printer.printError(err);
	}	
}

async function run() {
	const config = await configReader.read();
	
	const sessionId = await menuService.login(config.user, config.password);
	const menu = await menuService.getMenu(sessionId);

	printer.printMenu(menu);
}

main().then(() => {}, (err) => {
	console.log(err);
});
