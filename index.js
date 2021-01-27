axios
  .all([
    // getCharacters(),
    getEpisodes(),
    getLocations(),
  ])
  .then((response) => {
    var episodesList = [];
    var nextPage = response[0].data.info.next;
    episodesList.push(response[0].data.results);

    var originLocation = response[1].data.results;
    console.log(originLocation);

    getEpisodesNext(nextPage, episodesList);
    printEpisodesList(episodesList[0]);
    getEpisodeCharacters(episodesList[0], originLocation);
    // getOriginLocation(originLocation)
  });

// function getCharacters() {
//     return axios.get("https://rickandmortyapi.com/api/character");
// }

function getLocations() {
  return axios.get("https://rickandmortyapi.com/api/location");
}

function getEpisodes() {
  return axios.get(`https://rickandmortyapi.com/api/episode`);
}

function getEpisodesNext(nextPage, episodesList) {
  $(".sidebar__next").on("click", function () {
    axios
      .get(nextPage)
      .then((response) => {
        nextPage = response.data.info.next;
        // console.log(nextPage);
        episodesList.push(response.data.results);
        const episodesFlat = episodesList.flat();
        printEpisodesList(episodesFlat);
        getEpisodeCharacters(episodesFlat);
      })
      .catch((err) => {
        console.log("no more episodes");
      });
  });
}

//Takes the result of all episodes data as parameter
function printEpisodesList(episodes) {
  $(".sidebar__list__item").remove();
  episodes.forEach((episode) => {
    $(".sidebar__list").append(`
        <li class="sidebar__list__item" data-episode-id="${episode.id}">
            <p class="list__item__title">${episode.name}</p>
            <p>${episode.episode}</p>
        </li>`);
  });
}

//Takes the result of all episodes data as parameter
function getEpisodeCharacters(episodes, locations) {
  //When clicking each list item, take its episode id, create a new '.container_cards'
  //remove its content and append it to the 'main' section
  $(".sidebar__list__item").on("click", function (e) {
    var episodeId = e.target.closest("li").dataset.episodeId;
    var containerCards = $(`<div class="container_cards"></div>`);

    $(".container_cards").remove();
    $(".container_main").append(containerCards);

    // console.log(episodes);

    //Iterate over the episodes array, and for each episode compare its id with the target id
    episodes.forEach((episode) => {
      if (episode.id == episodeId) {
        printEpisodeInfo(episode);

        //If the ids match, iterate over that episode's characters array
        //and make an API call for each character
        episode.characters.forEach((character) => {
          axios.get(character).then((response) => {
            printEpisodeCharacters(response.data, locations);
            getOriginLocation(locations);
          });
        });
      }
    });
  });
}

//Take the data of each character's individual API call as parameter
function printEpisodeCharacters(character) {
  $(".container_cards").append(`
  <div class="character_card__container">
    <div class="character_card">
      <div class="character_card__front">
        <img src="${character.image}" alt="${character.name}" />
      </div>
      <div class="character_card__back">
        <p class="character_name">${character.name}</p>
        <div>
          <p>Status: ${character.status}</p>
          <p>Gender: ${character.gender}</p>
          <p>Origin: ${character.origin.name}</p>
        </div>
        <button class="origin_location_btn" data-location-url="${character.origin.url}">Origin location</button>
      </div>
    </div>
  </div>
  `);
}

function printEpisodeInfo(episode) {
  $(".episode_preview").remove();
  $(".container_episode").append(`
    <div class="episode_preview">
      <h1>${episode.name}</h1>
      <div>
        <p>${episode.air_date}</p>
        <p>${episode.episode}</p>
      </div> 
    </div>
  `);
}

function printOriginLocation(location) {

  $(".episode_preview").remove();
  $(".container_episode").append(`
    <div class="episode_preview">
      <h1>${location.name}</h1>
      <div>
        <p>${location.type}</p>
        <p>${location.dimension}</p>
      </div> 
    </div>
  `);

  var containerCards = $(`<div class="container_cards"></div>`);
  $(".container_cards").remove();
  $(".container_main").append(containerCards);

  location.residents.forEach((resident) => {
    axios.get(resident).then((response) => {
      if(resident == response.data.url){

        $('.container_cards').append(`
        <div class="character_card__container">
          <div class="character_card">
            <div class="character_card__front">
              <img src="${response.data.image}" alt="${response.data.name}" />
            </div>
            <div class="character_card__back">
            <p class="character_name">${response.data.name}</p>
            <div>
              <p>Status: ${response.data.status}</p>
              <p>Gender: ${response.data.gender}</p>
              <p>Origin: ${response.data.origin.name}</p>
            </div>
            <button class="origin_location_btn" data-location-url="">Origin location</button>
          </div>
        </div>
      </div>
    `)
      }
    })

    

  })


}

function getOriginLocation(locations) {
  $(".origin_location_btn").on("click", function (e) {
    var originLocation = e.target.dataset.locationUrl;
    locations.forEach((location) => {
      if (originLocation == location.url) {
        // console.log(location.url);
        axios
          .get(location.url)
          .then((response) => {
            // console.log(response.data);
            printOriginLocation(response.data)

          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
}

$(document).ready(function () {
  const containerMain = $(`<div class="container_main"></div>`);
  const episodeInfo = $(`<div class="container_episode"></div>`);
  $("main").append(containerMain);
  $(containerMain).append(episodeInfo);
  $(episodeInfo).append(
    `<h1 class="episode_preview"></br>Select an episode </br>to show its </br>characters</h1>`
  );
});
