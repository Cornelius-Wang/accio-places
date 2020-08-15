const mashvisorKey = "6875b662-8801-4be1-a329-391e54c2c507";
const mashvisorUrl = "https://api.mashvisor.com/v1.1/client/city/properties/";
const mapboxKey = "pk.eyJ1IjoiY29yeXdhbmcxMSIsImEiOiJja2RydmlhMWkwZnJxMndudXBsdGd2aDhtIn0.zlOoazi-NxpUgUbqoN_EZQ";
const mapboxUrl = "";

function formatQueryParams(params) {
    
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');

}

function getPlaces(stateCode, city) {
    const formCity = encodeURIComponent(city);
    const url = mashvisorUrl + stateCode + '/' + formCity;
  
    console.log(url);
  
    fetch(url, {
      headers: {"x-api-key": mashvisorKey}
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

  // function getMap(x, y) {
  //   const params = {
  //     api_key: apiKey,
  //     stateCode: x,
  //     limit: y,
  //   };
  //   const queryString = formatQueryParams(params)
  //   const url = getUrl + '?' + queryString;
  
  //   console.log(url);
  
  //   fetch(url)
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       throw new Error(response.statusText);
  //     })
  //     .then(responseJson => displayPlaces(responseJson))
  //     .catch(error => {
  //       $('.result-title').removeClass('hidden');
  //       $('.result-title').text(`Something went wrong: ${error.message}`);
  //     });
  // }

function templatePlaceHtml(neighborhood, placeAddress, listPrice, size, baths, beds, lastSaleDate, lastSalePrice, capRate, placeImage){

    return `<li class="place">
    <img href="${placeImage} class="place-photo">
    <h3 class="place-title">${neighborhood}</h3>
    <p class="place-detail">${placeAddress} | ${listPrice}</p>
    <p class="place-detail">${baths} | ${beds} | ${size} | ${capRate}</p>
    <p class="place-detail">${lastSaleDate} | ${lastSalePrice}</p>
    </li>
    
    <br>`

}

function loopPark(placeObject) {

    $('#result-list').empty();
    console.log(placeObject)

    for (let i = 0; i < placeObject.content.properties.length; i++) {

      const currentPlace = placeObject.content.properties[i];

      const html = templatePlaceHtml(
        currentPlace.neighborhood,
        currentPlace.address, 
        currentPlace.list_price_formatted, 
        currentPlace.sqft, 
        currentPlace.baths, 
        currentPlace.beds, 
        currentPlace.last_sale_date, 
        currentPlace.last_sale_price,
        currentPlace.traditional_cap,
        currentPlace.image);

        $('#result-list').append(html);

    };
    $('.results').removeClass('hidden');

}


function displayPlaces(responseJson) {
    /* Set array as local variable */
    const placeObject = responseJson;
    console.log(placeObject);
    loopPlace(placeObject);
}

function formEvent() {

    $('form').on('submit', function(event){
        event.preventDefault();
        const city = $('#city-search').val();
        const stateCode = $('#state-search').val();
        console.log(stateCode, city);
        getPlaces(stateCode, city);
    });

}


$(function start() {
    console.log('Done');
    formEvent();
})
