const puppeter = require('puppeteer');

const BASE_URL = 'https://instagram.com/';
const INSTA = (nome) => `https://instagram.com/explore/tags/${nome}`;

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeter.launch({
      headless: false
    });
    instagram.page = await instagram.browser.newPage();
    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  },

  login: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    let loginButton = await instagram.page.$x('//a[contains(text(), "Log in")]');
    await loginButton[0].click();
    await instagram.page.waitFor(1000);
    await instagram.page.type('input[name=username]', username, { delay: 50 });
    await instagram.page.type('input[name=password]', password, { delay: 50 });
    loginButton = await instagram.page.$x('//div[contains(text(), "Log In")]');
    await loginButton[0].click();
    await instagram.page.waitFor(3000);
    await instagram.page.waitFor('a > svg[aria-label="Profile"]');
  },

  like: async (nomes = []) => {
    for (let nome of nomes) {
      await instagram.page.goto(INSTA(nome), { waitUntil: 'networkidle2' });
      let fotos = await instagram.page.$$('article > div img[decoding="auto"]');
      await instagram.page.waitFor(2000);

      for (let i = 0; i < fotos.length; i++) {
        let foto = fotos[i];
        await foto.click();
        await instagram.page.waitFor(1000);
        const buttons = await instagram.page.$$('button.wpO6b');
        const len = (await instagram.page.$$('button[class^="wpO6b"]')).length;
        let curtir = await instagram.page.$('button[class^="wpO6b"] svg[aria-label="Like"]');

        if (curtir) {
          await buttons[0].click();
        }

        await instagram.page.waitFor(2000);
        await buttons[len -1].click();
      }
    }
  }
}

module.exports = instagram;
