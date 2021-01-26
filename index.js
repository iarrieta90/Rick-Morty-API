axios
  .all([
    // getCharacters(),
    // getLocations(),
    getEpisodes(),
  ])
  .then((response) => {
    var episodesList = [];
    var nextPage = response[0].data.info.next;
    episodesList.push(response[0].data.results);
    // console.log(episodesList[0])

    getEpisodesNext(nextPage, episodesList);
    printEpisodesList(episodesList[0]);
    getEpisodeCharacters(episodesList[0]);
  });

// function getCharacters() {
//     return axios.get("https://rickandmortyapi.com/api/character");
// }

// function getLocations() {
//     return axios.get("https://rickandmortyapi.com/api/location");
// }

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
function getEpisodeCharacters(episodes) {
  //When clicking each list item, take its episode id, create a new '.container_cards'
  //remove its content and append it to the 'main' section
  $(".sidebar__list__item").on("click", function (e) {
    var episodeId = e.target.closest("li").dataset.episodeId;
    var containerCards = $(`<div class="container_cards"></div>`);

    $(".container_cards").remove();
    $(".container_main").append(containerCards);

    console.log(episodes);

    //Iterate over the episodes array, and for each episode compare its id with the target id
    episodes.forEach((episode) => {
      if (episode.id == episodeId) {
        printEpisodeInfo(episode);

        //If the ids match, iterate over that episode's characters array
        //and make an API call for each character
        episode.characters.forEach((character) => {
          axios.get(character).then((response) => {
            printEpisodeCharacters(response.data);
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
        <button data-location-url="${character.location.url}">Origin location</button>
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

$(document).ready(function () {
  const containerMain = $(`<div class="container_main"></div>`);
  const episodeInfo = $(`<div class="container_episode"></div>`);
  $("main").append(containerMain);
  $(containerMain).append(episodeInfo);
  $(episodeInfo).append(
    `<h1 class="episode_preview">Select an episode to show its characters</h1>`
  );
});
