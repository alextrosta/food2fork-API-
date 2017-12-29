document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM FULLY LOADED")
  console.log(window.location.href)
});

function getWeather() {

  let cityName = document.getElementById('city').value
  if(cityName === '') {
    return alert('Please enter a city')
  }

  let cityDiv = document.getElementById('cityweather')
  cityDiv.innerHTML = ''

  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText)
      //console.log(response);
      let imageURLs = response.imageURLs;
      let sourceURLs = response.sourceURLs;
      let titles = response.titles;

      cityDiv.innerHTML += `<div id = 'recipes>'`

      for(var i = 0; i < response.titles.length; i++)
      {
        let imageURL = imageURLs[i];
        cityDiv.innerHTML += `
          <div class='recipe'>
            <img src=${imageURL} height='275' width='275' />
            <p style = 'text-align:center'><a href =${sourceURLs[i]}\
            target=\_blank\> ${titles[i]} </a></p>
          </div>
        `;
      cityDiv.innerHTML += `</div></body></html>`;
      /*  cityDiv.innerHTML += '<div class = "imgContainer">';
        cityDiv.innerHTML += '<img src =' + '"' + imageURL + '"' + "height=\"275\" width=\"275\"";
        cityDiv.innerHTML += "border = 2>";
        cityDiv.innerHTML += "<p style = \"text-align:center\"><a href="+sourceURLs[i]+ "\" target=\"_blank\">" +titles[i]+"</a></p>";
        //page += "<p>" + i + "</p>"
        cityDiv.innerHTML += "</div>";
        cityDiv.innerHTML += "</div>";
        cityDiv.innerHTML += '</body>'
        cityDiv.innerHTML += '</html>' */

      }
      /*
      cityDiv.innerHTML = cityDiv.innerHTML + `
      <h1>Weather for ${response.name} </h1>
      <ul>
      <li>Location: LON:${response.coord.lon}, LAT:${response.coord.lat}</li>
      <li>Main: ${response.weather[0].main}</li>
      <li>Desc: ${response.weather[0].description}</li>
      </ul>
      `*/

    }
  }
  xhr.open('GET', `/recipes?ingredients=${cityName}`, true)
  xhr.send()
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("city")
.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === ENTER) {
    document.getElementById("submit").click();
  }
});
