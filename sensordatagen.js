//Written by @XVI
//XVIsolutions Akamai API

const express = require('express')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const ghostCursor = require('ghost-cursor')

////////////////////////////////////////////////////////////////////////////////
//variables
var gpu, rand;
var gpus = ["ANGLE (NVIDIA GeForce GTX 1080 Ti Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce GTX 1080 Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce GTX 1070 Ti Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce GTX 1070 Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce GTX 1060 6GB Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce GTX 1060 3GB Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce RTX 2080 Direct3D11 vs_5_0 ps_5_0)",
            "ANGLE (NVIDIA GeForce RTX 2070 Direct3D11 vs_5_0 ps_5_0)"];

////////////////////////////////////////////////////////////////////////////////
//Functions

//Things we can pass in here
//Window X, Window Y, Number of Sensor Datas, Akamai Wall Number
function makeSensor(site, x, y, n, indx){
  puppeteer.launch({ headless: false, devtools: false, args: ['--start-maximized']}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: x, height: y });
    await page.goto(site, { waitUntil: 'networkidle2' });
    const cursor = await ghostCursor.createCursor(page);
    for (var i = 0; i < n; i++) {
      await makeData(page, cursor, indx);
      await page.reload({ waitUntil: 'networkidle2' });
    }
  });
}

//clicks around every 100ms
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
  }, 100);
  await getSensor(page, indx);
}

async function getSensor(page, indx){
  //we send bmak comands to the console
  rand = Math.round(Math.random() * gpus.length);
  gpu = gpus[rand];
  const sensor_data = await page.evaluate((indx, gpu) => {
    bmak.bpd();
    //sends motion events to bmak
    bmak.cma(MouseEvent, 1);
    bmak.cdma(DeviceMotionEvent);
    bmak.aj_type = 1;
    //sets the "wall number"
    bmak.aj_index = indx;
    //gpu, I couldn't be bothered to make this dynamic so you do it lol
    bmak.wr = gpu;
    bmak.wv = "Google Inc.";
    //finalize data
    bmak.bpd();
    return bmak.sensor_data;
  }, indx, gpu);
  console.log(sensor_data);
  //cool now we have sensor data
}

//here we ask for 1 bmak.sensor_data with index 1 and window size @1920x1080 @footlocker
makeSensor("https://footlocker.com", 1920, 1080, 1, 1);
