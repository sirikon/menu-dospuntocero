function parseMenu(menu) {
	const result =  {
		kcal: 0,
		dishes: []
	};

	const groups = menu.querySelectorAll('.grupo');
	for(let i = 0; i < groups.length; i++) {
		const groupResult = parseMenuGroup(groups[i]);
		result.kcal += groupResult.kcal;
		result.dishes = result.dishes.concat(groupResult.dishes);
	}

	return result;
}

function parseMenuGroup(menuGroup) {
	const result =  {
		kcal: 0,
		dishes: []
	};

	result.kcal = readKCalFromMenu(menuGroup);
    
	const dishes = menuGroup.querySelectorAll('dd:not(.tit)');
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
	parseMenuGroup,
	verifyIdentificationElementExists
};

module.exports = htmlParser;
