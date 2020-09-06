const mashvisorKey = "6875b662-8801-4be1-a329-391e54c2c507";
const mashvisorUrlPlaces = "https://api.mashvisor.com/v1.1/client/city/properties/";
const mashvisorUrlStats = "https://api.mashvisor.com/v1.1/client/city/investment/";
const mapboxKey = "pk.eyJ1IjoiY29yeXdhbmcxMSIsImEiOiJja2RydmlhMWkwZnJxMndudXBsdGd2aDhtIn0.zlOoazi-NxpUgUbqoN_EZQ";
const mapboxUrl = "";
const proxyUrl = "https://ancient-inlet-96238.herokuapp.com/";

function formatQueryParams(params) {
    
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');

}

function getPlaces(stateCode, city, numResults) {

    const formCity = encodeURIComponent(city);
    const url = mashvisorUrlPlaces + stateCode + '/' + formCity;
  
    console.log(url);
    fetch(proxyUrl + url, {
      headers: {
        "x-api-key": mashvisorKey,
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayPlaces(responseJson))
      .catch(error => {
        $('.result-title').removeClass('hidden');
        $('.result-title').text(`Something went wrong: ${error.message}`);
      });
}

function templatePlaceHtml(neighborhood, placeAddress, listPrice, size, baths, beds, capRate, placeImage, mapNumber){

    return `<div class="place-tile">
    <div class="place-image"><img src="${placeImage}" class="place-photo"></div>
    <div class="place-text"><h3 class="place-title">${neighborhood}</h3>
    <p class="place-detail">${placeAddress} | ${listPrice}</p>
    <p class="place-detail"> BR ${beds} | BA ${baths}</p>
    <p class="place-detail">${size} ft<sup>2</sup> | Cap Rate ${capRate}</p></div>
    <div id="map-${mapNumber}"></div>
    </div>

    <br>`

}

// function drawPlaceMap(latitude, longitude, number){

//   let travereString = 'map-' + number.toString(); 
//   console.log(latitude,longitude,travereString);

//   L.map(travereString, {
//     center: [latitude, longitude],
//     zoom: 13
//   })
//   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: mapboxKey
//   }).addTo(travereString);

// }

function loopPlace(placeObject) {

    $('#result-list').empty();
    console.log("Properties Object", placeObject)

    for (let i = 0; i < placeObject.content.properties.length; i++) {

      const currentPlace = placeObject.content.properties[i];
      const imgUrl = currentPlace.image

      console.log("Image ULR, Cap Rate", currentPlace.image, currentPlace.traditional_cap);

        const placeHtml = templatePlaceHtml(
        currentPlace.neighborhood,
        currentPlace.address, 
        currentPlace.list_price_formatted, 
        currentPlace.sqft, 
        currentPlace.baths, 
        currentPlace.beds,
        currentPlace.traditional_cap,
        imgUrl,
        i);
        $('#result-list').append(placeHtml);
      // drawPlaceMap(currentPlace.latitude, currentPlace.longitude, i);

    };
    $('.results').removeClass('hidden');

}




function displayPlaces(responseJson) {
    /* Set array as local variable */
    const placeObject = responseJson;
    loopPlace(placeObject);
    
}

function getStats(stateCode, city) {

  const formCity = encodeURIComponent(city);

  const url = mashvisorUrlStats + stateCode + '/' + formCity;

  fetch(proxyUrl + url, {
    headers: {
      "x-api-key": mashvisorKey,
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayStats(responseJson, city))
    .catch(error => {
      $('.result-title').removeClass('hidden');
      $('.result-title').text(`Something went wrong: ${error.message}`);
    });
}

// "city" parameter in template Stats HTML left purposefully unused for future addition and styling

function templateStatsHtml(avgPrice, sqft, totalProperties, occupancy, coc, rent, city) {

  return `
  <div class="stats-text">
  <p class="stats-detail">Average Listing Price $${avgPrice}</p>
  <p class="stats-detail">Average Square Footage ${sqft}</p>
  <p class="stats-detail">Total properties: ${totalProperties}</p>
  <p class="stats-detail">Occupancy Rate ${occupancy} </p>
  <p class="stats-detail">Cash on Cash: ${coc}</p>
  <p class="stats-detail">Ave Rent Price: ${rent} </p>
  </div>
  
  <br>`

}

function formatNumber(number) {

  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");

}

function renderStats(statsObject, city) {

  $('#stats-list').empty();
    
    const currentStats = statsObject.content;
    const totalProperties = currentStats.investment_properties + currentStats.airbnb_properties + currentStats.traditional_properties;
    console.log("Number of Properties", totalProperties);
    const formPrice = formatNumber(currentStats.median_price);

    const statsHtml = templateStatsHtml(
      formPrice,
      currentStats.sqft,
      totalProperties,
      currentStats.occupancy,
      currentStats.traditional_coc,
      currentStats.traditional_rental,
      city
    );

    $('#stats-list').append(statsHtml);

  $('.stats').removeClass('hidden');

}

function displayStats(responseJson) {

  const statsObject = responseJson;
  console.log(statsObject);
  renderStats(statsObject);

}

function formEvent() {

    $('form').on('submit', function(event){
        event.preventDefault();
        const city = $('#city-search').val();
        const stateCode = $('#state-search').val();
        // const numResults = $('#js-num-results').val();
        console.log(stateCode, city);
        getPlaces(stateCode, city);
        getStats(stateCode, city);
    });

}


$(function start() {
    console.log('Done');
    formEvent();
})
