//Written by @XVI Raakka & @Musicbot
//Sayaka AIO

//puppeteer requires
const request = require('request')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
//API 4 webhooks
const fetch = require('node-fetch')
//Akamai stuff (i <3 u musicbot) :p
const ghostCursor = require('ghost-cursor')

////////////////////////////////////////////////////////////////////////////////
//vars

//this first one is the webhook storage
var jsonWebhooks = require('./jsonData/webhooks.json')
//cookie jar :p
var jsonCookieJar = require('./jsonData/theCookieJar.json')

//dont jam up memory damnit
var targeturl = 'https://footlocker.com/'
var cookies = ''
var sensorData = ''

//fix this later in the search bar
//var fakegmaillist = []
var fakelastnames = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"]

////////////////////////////////////////////////////////////////////////////////
//Webhook Messages

//discord webhook link handling
var whurls = []
for (var i = 0, len = jsonWebhooks.length; i < len; ++i) {
   whurls.push(jsonWebhooks[i].url)
 }

//message to push to webhook
 const msg = {
   "embeds": [
     {
       "title": ":man_cook: Baking Cookies!",
       "color": 10177024,
       "footer": {
         "text": "☆ Sayaka AIO ☆",
         "icon_url": "https://i.imgur.com/icG7msB.png"
       }
     }
   ]
 }


////////////////////////////////////////////////////////////////////////////////
//Functions

//posts a json obj (jsonmsg) to whurl
function post2webhook(jsonmsg) {
  whurls.forEach((whurl, i) => {
    fetch(whurl + "?wait=true",
    {"method":"POST",
    "headers": {"content-type": "application/json"},
    "body": JSON.stringify(jsonmsg)})
    .then(a=>a.json()).then(console.log)
  });
}

//thank u musicbot!!! :p
async function akamaisensor(link, page){
  console.log('Faking Out Akamai...');
  //make sure to update cookie value with "await page.setCookie()"
  const sensor_data = await page.evaluate((link) => {
        history.pushState({}, null, link);
        //updates mouse clicks/pos
        bmak.cma(MouseEvent, 1);
        bmak.cdma(DeviceMotionEvent);
        bmak.aj_type = 1;
        bmak.aj_index = 2;
        //updates bmak.sensor_data
        bmak.bpd();
        return bmak.sensor_data;
      }, link)
  }

async function saveCookie(cookieobj, thecookieyouwanttosave){
  cookieobj.push(thecookieyouwanttosave)
}

////////////////////////////////////////////////////////////////////////////////
//Runners
async function bake(notifications){
  if (notifications){
    post2webhook(msg)
  }
  puppeteer.launch({ headless: true, devtools: false }).then(async browser => {
    console.log('Baking Cookies!')

    const page = await browser.newPage()
    await page.goto(targeturl, {waitUntil: 'networkidle2'})
    console.log('On Site...')

    const cursor = ghostCursor.createCursor(page)

    setInterval(async function(){
      try{
          try{
            await cursor.move('/html/body')
          }catch(e){};
          if(Math.random()>.9){
            await cursor.move('/html/body')
            await new Promise(r => setTimeout(r, 1500));
          }
          if(Math.random() > 0.85){
            await cursor.click();
          }
      }catch(e){};
    }, 500)

    //thank u musicbot :)
    cookies = await page.cookies()
    await page.waitFor(5000)
    sensorData = await akamaisensor(targeturl, page)

    //await page.evaluate(bmak.bpd())
    //const sensorData = await page.evaluate(bmak.sensorData)
    cookies = await page.cookies()
    console.log('Cookies:')
    console.log(cookies)

    //yessir we cookin
    return cookies
    page.close()
    browser.close()
  })
}
