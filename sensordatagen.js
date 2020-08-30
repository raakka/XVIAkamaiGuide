//Written by @XVI Raakka
//Sayaka AIO

//const request = require('request')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const ghostCursor = require('ghost-cursor')
//const fetch = require("node-fetch")

////////////////////////////////////////////////////////////////////////////////
//Functions

//Things we can pass in here
//Window X, Window Y, Number of Sensor Datas, Akamai Wall Number
function makeGen(x, y, n, indx){
  puppeteer.launch({ headless: true, devtools: false, args: ['--start-maximized']}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: x, height: y });
    await page.goto(`file://${__dirname}/sensorgen.html`, { waitUntil: 'networkidle2' });
    const cursor = await ghostCursor.createCursor(page);
    for (var i = 0; i < x; i++) {
      await makeData(page, cursor, indx);
      await page.reload({ waitUntil: 'networkidle2' });
    }
    await browser.close();
  });
}

//clicks around every 500ms
//this is out fake cursor movement
async function makeData(page, cursor, indx){
  setInterval(async function(){
    try{
      try{
        await cursor.move('html');
        }catch(e){};
      if(Math.random()>.9){
        await cursor.move('html')
      }
      if(Math.random() > 0.80){
        await cursor.click();
      }
    }catch(e){};
  }, 500);
  await getSensor(page, indx);
}

async function getSensor(page, indx){
  //we send bmak comands to the console
  const sensor_data = await page.evaluate(() => {
    //sends motion events to bmak
    bmak.cma(MouseEvent, 1);
    bmak.cdma(DeviceMotionEvent);
    bmak.aj_type = 1;
    //sets the "wall number"
    bmak.aj_index = indx;
    //gpu, I couldn't be bothered to make this dynamic so you do it lol
    bmak.wr = "ANGLE (NVIDIA GeForce GTX 1080 Ti Direct3D11 vs_5_0 ps_5_0)";
    bmak.wv = "Google Inc.";
    //finalize data
    bmak.bpd();
    return bmak.sensor_data;
  });
  console.log(sensor_data);
}

//here we ask for 3 bmak.sensor_data values @1920x1080
makeGen(1920,1080,3);
