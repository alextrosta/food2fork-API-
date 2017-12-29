/*

getIngredients() will read the text inputted from the user in the textbox,
and send the 'ingredients' strings to the food2fork API. The data received
(a respone of all recipes which contain the ingredients
==> an array of the URLs of the images of the recipes
==> an array of the URLs of the recipe's pages
==> an array of the names of the titles)

*/

function getIngredients() {

  //retrieve the string which represents the ingredient(s)
  let ingredientName = document.getElementById('ingredient').value
  //if no ingredient entered, prompt the user
  if(ingredientName === '') {
    return alert('Please enter an ingredient')
  }


  if(ingredientName.includes(" "))
  {
    ingredientName =  ingredientName.replace(/[^A-Z0-9]+/ig, ",");
  }

  //retrieve the <div> in which all recipe data (above) is going to be entered

  let ingDiv = document.getElementById('ingredients')
  ingDiv.innerHTML = ''

  let xhr = new XMLHttpRequest()

  //when a message is received
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

      let response = JSON.parse(xhr.responseText)
      let imageURLs = response.imageURLs;
      let sourceURLs = response.sourceURLs;
      let titles = response.titles;

      ingDiv.innerHTML += '<div id = recipes>'

      //iterate through the response (titles, imageURLs, sourceURLs) and embed
      //them within the HTML

      for(var i = 0; i < titles.length; i++)
      {
        let imageURL = imageURLs[i];
        ingDiv.innerHTML +=`
          <div class='recipe'>
            <img src=${imageURL} height='275' width='275' />
            <p style = 'text-align:center'>
            <a href=${sourceURLs[i]} target=\_blank\> ${titles[i]}</a></p>
          </div>`
        ;
      ingDiv.innerHTML += '</div>';
      }
    }
  }
  //send the request to an appropriate route in the server
  xhr.open('GET', `/recipes?ingredients=${ingredientName}`, true)
  xhr.send()
}

//Attach Enter-key Handler to the text box
const ENTER=13
document.getElementById("ingredient")
.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === ENTER) {
    document.getElementById("submit").click();
  }
});
