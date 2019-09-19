function parseMenu(menu, _result) {
	const result = _result || {
		kcal: 0,
		empty: false,
		dishes: []
	};

	if (!menu) {
		result.empty = true;
		return result;
	}

	result.kcal = readKCalFromMenu(menu);
    
	const dishes = menu.querySelectorAll('dd:not(.tit)');
	for(let x = 0; x < dishes.length; x++) {
		result.dishes.push(dishes[x].textContent.trim());
	}

	return result;
}

function verifyIdentificationElementExists(document) {
	const identificationElement = document.querySelector('.latiguilloSuperior .centrador img');
	if (identificationElement === null) {
		throw new Error('Login failed. Identification element not found.');
	}

	const text = identificationElement.nextSibling.textContent.trim();
	if (text === '') {
		throw new Error('Login failed. Identification text not found.');
	}
}

function readKCalFromMenu(menu) {
	const titleElement = menu.querySelector('dd.tit');
	if (!titleElement) return null;
	return parseInt(titleElement.textContent.split('/')[1].replace('KCal', '').trim());
}


const htmlParser = {
	parseMenu,
	verifyIdentificationElementExists
};

module.exports = htmlParser;
