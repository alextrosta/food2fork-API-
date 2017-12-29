/*
NOTE: You need to intall the npm modules by executing >npm install
before running this server

Simple express server re-serving data from food2fork API

*/
const express       = require('express') //express framework
const requestModule = require('request') //npm module for easy http requests
let   http          = require('http')
let   url           = require('url')
let   qstring       = require('querystring')
const PORT          = process.env.PORT || 3000

/*YOU NEED AN APP ID KEY TO RUN THIS CODE
GET ONE BY SIGNING UP AT food2fork
*/

const food2fork_API_KEY = 'c630c59692a73fac12d2a6c2cd9801ab' //PUT IN YOUR OWN KEY HERE

const app = express()

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes

//default localhost route
app.get('/', (request, response, next) => {
  if(request.query.ingredients)//if client enters ingredients
  {

    next();//go to next route
  } else {//otherwise, serve a blank HTML form
    response.sendFile(__dirname + '/views/index.html')
  }
})

//this route will be handled if client enters ?ingredients query
app.get('/', (request, response, next) => {
  let ingredients = request.query.ingredients;
  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredients}&key=${food2fork_API_KEY}`
  }

//request from food2fork
  http.request(options, function(apiResponse){
    //a different parse is needed, since an HTML doc will be sent
    parseDataFromURL(apiResponse, response)
  }).end();
})

//default route displaying recipes with top hits ingredients
app.get('/recipeAPI', (request, response) => {
  const options1 = {
    host: 'www.food2fork.com',
    path: `/api/search?&key=${food2fork_API_KEY}`
  }

  http.request(options1, function(apiResponse){

    parseDataFromURL(apiResponse, response)
  }).end();
})

//route for receiving a request from a button press/enter on the client side
app.get('/recipes', (request, response) => {
  let ingredients = request.query.ingredients;
  if(!ingredients) {
    return response.sendFile(__dirname + '/views/index.html')
  }

  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredients}&key=${food2fork_API_KEY}`
  }

  http.request(options, function(apiResponse){
    //this parse will handle sending JSON data to the client
    parseData(apiResponse, response)
  }).end();
})

/*
 sendResponse(ingData, res) will parse the ingredient data from the API to
 construct relevant arrays of data: sourceURLs, imageURLs, and titles of
 recipes.
*/

function sendResponse(ingData, res){

  let imageURLs = [];
  let titles = [];
  let sourceURLs = [];

  for(var i = 0; i < JSON.parse(ingData).recipes.length; i++)
  imageURLs.push(JSON.parse(ingData).recipes[i].image_url);

  for(var i = 0; i < JSON.parse(ingData).recipes.length; i++)
  titles.push(JSON.parse(ingData).recipes[i].title);

  for(var i = 0; i < JSON.parse(ingData).recipes.length; i++)
  sourceURLs.push(JSON.parse(ingData).recipes[i].source_url);

  let responseObj = {
    imageURLs, titles, sourceURLs
  }

  res.end(JSON.stringify(responseObj));

}

/*
 sendResponseFromURL(ingData, res) will parse the ingredient data from the API to
 construct relevant arrays of data: sourceURLs, imageURLs, and titles of
 recipes. An HTML page will be constructed with this data.
*/

function sendResponseFromURL(ingData, res){

  let imageURLs = [];
  let titles = [];
  let sourceURLs = [];

  for(var i = 0; i < JSON.parse(ingData).recipes.length; i++)
  imageURLs.push(JSON.parse(ingData).recipes[i].image_url);

  for(var i = 0; i < JSON.parse(ingData).recipes.length; i++)
  titles.push(JSON.parse(ingData).recipes[i].title);

  for(var i = 0; i < JSON.parse(ingData).recipes.length; i++)
  sourceURLs.push(JSON.parse(ingData).recipes[i].source_url);

  let responseObj = {
    imageURLs, titles, sourceURLs
  }

  let page = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
  <title></title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/recipes/styles/styles.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  </head>

  <body>
  <div>
  <b>WELCOME TO THE RECIPE API</b>
  </div>
  <div class="container">
        <div class="wrapper">
            Enter Ingredient(s) Name: <input type="text" name="ingredient" id="ingredient" />
            <button id="submit" onclick="getIngredients()" style="margin-bottom: 50px;">Submit</button>
        </div>
        <div id="ingredients"></div>
    </div>
  <div id = recipes>
  `

  for(var i = 0; i < titles.length; i++)
  {
    let imageURL = imageURLs[i];
    page +=`
    <div class='recipe'>
    <img src=${imageURL} height='275' width='275' />
    <p style = 'text-align:center'>
    <a href=${sourceURLs[i]} target=\_blank\> ${titles[i]}</a></p>
    </div>`
    ;
  }
  page += `
  </div>
  </div>

  <script src="js/script.js"></script>
  </body>

  </html>
  `
  res.end(page);

}

/*
parseData(recipeResponse, res) will receive recipe data from the API and parse
through it. Upon completion, the data (JSON) will be sent to the client.
*/

function parseData(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function (chunk) {
    recipeData += chunk
  })
  recipeResponse.on('end', function () {
    sendResponse(recipeData, res)
  })
}

/*
parseDataFromURL(recipeResponse, res) will receive recipe data from the API and parse
through it. Upon completion, the data (HTML) will be sent to the client.
*/

function parseDataFromURL(recipeResponse, res) {
  let recipeData = ''
  recipeResponse.on('data', function (chunk) {
    recipeData += chunk
  })
  recipeResponse.on('end', function () {
    sendResponseFromURL(recipeData, res)
  })
}

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
  }
})
