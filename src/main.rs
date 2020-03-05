extern crate reqwest;
extern crate scraper;

use scraper::{Html, Selector};

fn foo() -> Result<(), reqwest::Error> {
    let text = reqwest::blocking::get("https://sirikon.me")?.text()?;
    let document = Html::parse_document(&text);
    let selector = Selector::parse("title").unwrap();

    for element in document.select(&selector) {
        println!("{}", element.inner_html());
    }
    Ok(())
}

fn main() {
    foo().unwrap();
}
