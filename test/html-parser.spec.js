const assert = require('assert');
const { JSDOM } = require('jsdom');
const htmlParser = require('../src/menu/html-parser');

describe('HTML Parser', function() {
    it('should parse a single menu group', function() {
        const element = new JSDOM(`
        <dl class="grupo">
            <dd class="tit">CUBIERTO MENU 2.0 / 446 KCal</dd>
            <dd title="Brócoli salteado"><a href="#" id="47212076_0606" data-plato="0606" class="verimagen">Brócoli salteado</a>
            </dd>
            <dd title="Lomo de atún en salsa de tomate"><a href="#" id="47212070_0115" data-plato="0115" class="verimagen">
                Lomo de atún en salsa de tomate</a> </dd>
            <dd title="Naranja"><a href="#" id="47212075_0601" data-plato="0601" class="verimagen">Naranja</a> </dd>
        </dl>
        `).window.document;

        assert.deepEqual(htmlParser.parseMenuGroup(element), {
            dishes: [
                "Brócoli salteado",
                "Lomo de atún en salsa de tomate",
                "Naranja"
            ],
            kcal: 446
        });
    });

    it('should parse a menu with many groups', function() {
        const element = new JSDOM(`
        <td class="normal listadomenu">
            <dl class="grupo">
                <dd class="tit">PRIMER PLATO LAST MINUTE / 428 KCal</dd>
                <dd title="Macarrones con tomate y atún"><a href="#" id="47136185_0569" data-plato="0569"
                        class="verimagen">Macarrones con tomate y atún</a> (1)</dd>
            </dl>
            <dl class="grupo">
                <dd class="tit">SEGUNDO PLATO LAST MINUTE / 421 KCal</dd>
                <dd title="Pechugas de pollo Cordon Bleu con verduritas salteadas"><a href="#" id="47136160_01461"
                        data-plato="01461" class="verimagen">Pechugas de pollo Cordon Bleu con verduritas salteadas</a> (1)</dd>
            </dl>
        </td>
        `).window.document;

        assert.deepEqual(htmlParser.parseMenu(element), {
            dishes: [
                'Macarrones con tomate y atún (1)',
                'Pechugas de pollo Cordon Bleu con verduritas salteadas (1)'
            ],
            kcal: 849
        });
    })

});
