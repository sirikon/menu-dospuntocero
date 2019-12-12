const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const AppError = require('./app-error');

function printMenu(menu) {
	if (!menu.dishes.length) {
		console.log('No tienes nada para comer hoy :(');
		return;
	}
	const headerText = `Menú para el ${menu.date.getDate()} de ${MONTHS[menu.date.getMonth()]}:`;
	const footerText = `${menu.kcal} KCal`;
	printBox(headerText, menu.dishes, footerText);
}

function printError(err) {
	if (err instanceof AppError) {
		console.log(err.message);
		return;
	}
	console.log(err);
}

function printBox(header, lines, footer) {
	const width = getWidth(lines.concat([header, footer])) + 2;
	console.log();
	console.log(`  ${header}${pad(' ', width - header.length - 2)}  `);
	console.log(`┌${pad('─', width)}┐`);
	lines.forEach(line => {
		console.log(`│ ${line}${pad(' ', width - line.length - 2)} │`);
	});
	console.log(`└${pad('─', width)}┘`);
	console.log(`  ${pad(' ', width - footer.length - 2)}${footer}  `);
	console.log();
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
	});
	return max;
}

module.exports = {
	printMenu,
	printError
};
