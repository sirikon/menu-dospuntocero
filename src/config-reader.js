const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_PATH = path.join(os.homedir(), '.menudospuntocero');

async function read() {
	if (!fs.existsSync(CONFIG_PATH)) {
		console.log('Configuración no encontrada.');
		console.log(`Crea el fichero "${CONFIG_PATH}" en tu carpeta personal con un contenido como este:`);
		console.log(JSON.stringify({
			user: 'xxx',
			password: 'xxx'
		}, null, 2));
		process.exit(1);
	}
	const data = fs.readFileSync(CONFIG_PATH, { encoding: 'utf8' });
	return JSON.parse(data);
}

module.exports = {
	read
};
