/* eslint-disable no-undef */
import 'babel-polyfill';

const puppeteer = require('puppeteer');

const SERVER = require('../Backend/server');

const APP = 'http://localhost:3000';
const TYPESCRIPT = 'http://localhost:3000/typescript.html';

let browser;
let page;

describe('Sandbox Tests', () => {
  beforeAll(async () => {
    await SERVER;

    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // headless: false
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await SERVER.close();

    await browser.close();
  });

  describe('Non-Typescript Tests', () => {
    describe('Sandbox Launch', () => {
      it('Sandboxes Load Successfully', async () => {
        await page.goto(APP);
        const title = await page.$eval('title', el => el.innerHTML);
        expect(title).toBe('Reactime Sandboxes');

        // await page.screenshot({ path: 'example.png' }); // Add a screenshot
      });
    });

    describe('Hook Tests', () => {
      it('The parent count should be 1 after the button is clicked 2 times', async () => {
        await page.$eval('#increaseButton', el => el.click());
        await page.$eval('#increaseButton', el => el.click());

        const lastSnapshotJSON = await page.$eval(
          '#lastSnapshot',
          el => el.innerHTML
        );

        const lastSnapshot = await JSON.parse(lastSnapshotJSON);

        // The snapshot is 1 event behind currently; if this is changed then the expected value would be 2
        // console.log(JSON.parse(document.querySelector('#lastSnapshot').innerHTML).children[0].children[1].state.count)
        expect(lastSnapshot.children[0].children[1].state.count).toBe(1);
      });

      it('After the both button is clicked 2 times, the first child count should be 1 and the second child count should be 999', async () => {
        await page.$eval('#childBothButton', el => el.click());
        await page.$eval('#childBothButton', el => el.click());

        const lastSnapshotJSON = await page.$eval(
          '#lastSnapshot',
          el => el.innerHTML
        );

        const lastSnapshot = await JSON.parse(lastSnapshotJSON);

        // console.log(JSON.parse(document.querySelector('#lastSnapshot').innerHTML).children[0].children[1].children[0].state.count2)
        expect(
          lastSnapshot.children[0].children[1].children[0].state.count2
        ).toBe(1);

        expect(
          lastSnapshot.children[0].children[1].children[0].state.count3
        ).toBe(999);
      });
    });

    describe('UseEffect Tests', () => {
      it('Should navigate to the useEffect Tests', async () => {
        await page.$eval('#UseEffect', el => el.click());
      });
    });

    describe('UseContext Tests', () => {
      it('Should navigate to the UseContext Tests', async () => {
        await page.$eval('#UseContext', el => el.click());
      });
    });

    describe('UseMemo Tests', () => {
      it('Should navigate to the UseMemo Tests', async () => {
        await page.$eval('#UseMemo', el => el.click());
      });
    });

    describe('Redux Tests', () => {
      it('Should navigate to the Redux Tests', async () => {
        await page.$eval('#Redux', el => el.click());
      });
    });

    describe('Router Tests', () => {
      it('Should navigate to the Router Tests', async () => {
        await page.$eval('#Router', el => el.click());
      });
    });

    describe('SetState Tests', () => {
      it('Should navigate to the SetState Tests', async () => {
        await page.$eval('#SetState', el => el.click());
      });
    });

    describe('SetStateConditional Tests', () => {
      it('Should navigate to the SetStateConditional Tests', async () => {
        await page.$eval('#SetStateConditional', el => el.click());
      });
    });

    describe('ComponentDidMount Tests', () => {
      it('Should navigate to the ComponentDidMount Tests', async () => {
        await page.$eval('#ComponentDidMount', el => el.click());
      });
    });
  });

  describe('Typescript Tests', () => {
    describe('Typescript Sandbox Launch', () => {
      it('Typescript Sandboxes Load Successfully', async () => {
        await page.goto(TYPESCRIPT);
        const title = await page.$eval('title', el => el.innerHTML);
        expect(title).toBe('Typescript Reactime Sandboxes');

        // await page.screenshot({ path: 'example.png' }); // Add a screenshot
      });
    });

    describe('Typescript Hook Tests', () => {
      describe('UseEffect Tests', () => {
        it('Should navigate to the useEffect Tests', async () => {
          await page.$eval('#UseEffect', el => el.click());
        });
      });

      describe('UseContext Tests', () => {
        it('Should navigate to the UseContext Tests', async () => {
          await page.$eval('#UseContext', el => el.click());
        });
      });

      describe('UseMemo Tests', () => {
        it('Should navigate to the UseMemo Tests', async () => {
          await page.$eval('#UseMemo', el => el.click());
        });
      });

      describe('Redux Tests', () => {
        it('Should navigate to the Redux Tests', async () => {
          await page.$eval('#Redux', el => el.click());
        });
      });

      describe('Router Tests', () => {
        it('Should navigate to the Router Tests', async () => {
          await page.$eval('#Router', el => el.click());
        });
      });

      describe('SetState Tests', () => {
        it('Should navigate to the SetState Tests', async () => {
          await page.$eval('#SetState', el => el.click());
        });
      });

      describe('ComponentDidMount Tests', () => {
        it('Should navigate to the ComponentDidMount Tests', async () => {
          await page.$eval('#ComponentDidMount', el => el.click());
        });
      });
    });
  });
});
