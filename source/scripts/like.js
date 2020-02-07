const puppeter = require('puppeteer');

const BASE_URL = 'https://instagram.com/';
const URL = (name, type) => type === 'profile' ? `https://instagram.com/${name}` : `https://instagram.com/explore/tags/${name}`;

const ig = {
  browser: null,
  page: null,

  initialize: async () => {
    ig.browser = await puppeter.launch({
      headless: false
    });
    ig.page = await ig.browser.newPage();
    await ig.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  },

  login: async (username, password) => {
    await ig.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    let loginButton = await ig.page.$x('//a[contains(text(), "Log in")]');
    await loginButton[0].click();
    await ig.page.waitFor(1000);
    await ig.page.type('input[name=username]', username, { delay: 50 });
    await ig.page.type('input[name=password]', password, { delay: 50 });
    loginButton = await ig.page.$x('//div[contains(text(), "Log In")]');

    await ig.page.evaluate(() => {
      for(let num = 0, len = 10; num < len; num++) {
        window.scrollBy(0, document.body.scrollHeight);
      }
    });

    await loginButton[0].click();
    await ig.page.waitFor(3000);
    await ig.page.waitFor('a > svg[aria-label="Profile"]');
  },

  like: async (names = []) => {
    for (let name of names) {
      await ig.page.goto(URL(name, process.env.IG_TYPE), { waitUntil: 'networkidle2' });
      let photos = await ig.page.$$('article > div img[decoding="auto"]');
      await ig.page.waitFor(2000);

      for (let i = 0; i < photos.length; i++) {
        let photo = photos[i];
        await photo.click();
        await ig.page.waitFor(1000);
        const buttons = await ig.page.$$('button.wpO6b');
        const len = (await ig.page.$$('button[class^="wpO6b"]')).length;
        let curtir = await ig.page.$('button[class^="wpO6b"] svg[aria-label="Like"]');

        if (curtir) {
          await buttons[0].click();
        }

        await ig.page.waitFor(2000);
        await buttons[len -1].click();
      }
    }
  }
}

module.exports = ig;
