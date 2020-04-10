include ../src/api/menu20

import unittest

suite "Menu 2.0 API - Login HTML parsing":

    test "should return false with empty body":
        check verifyIsLoggedIn("") == (false, "")

    test "should return false with body missing welcoming message":
        let html = """
            <div class="latiguilloSuperior">
                <div class="centrador">
                    Lorem ipsum
                    <img src="" />
                    Dolor sit
                </div>
            </div>
        """
        check verifyIsLoggedIn(html) == (false, "")

    test "should return true with correct, expected body":
        let html = """
            <div class="latiguilloSuperior">
                <div class="centrador">
                    <img src="" />
                    Bienvenido/a, John Doe
                </div>
            </div>
        """
        check verifyIsLoggedIn(html) == (true, "John Doe")
