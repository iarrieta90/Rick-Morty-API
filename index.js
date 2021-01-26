axios
  .all([
    // getCharacters(),
    // getLocations(),
    getEpisodes(),
  ])
  .then((response) => {
    printEpisodes(response[0].data.results);
    getEpisodesNext(response[0].data.info.next);
    // printEpisodeCharacters(response[0].data.results)
    getEpisodeCharacters(response[0].data.results)
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

function getEpisodesNext(next) {
  axios.get(next).then((response) => {
    $(".sidebar__next").on("click", function () {
      printEpisodes(response.data.results);
      if (response.data.info.next !== null) {
        // getEpisodesNext(response.data.info.next);
        axios.get(response.data.info.next).then((response) => {
          printEpisodes(response.data.results);
          $(".sidebar__next").off("click");
        });
      }

    });
  });
}

//Takes the result of all episodes data as parameter
function printEpisodes(episodes) {
  episodes.forEach((episode) => {
    $(".sidebar__list").append(`
        <li class="sidebar__list__item" data-episode-id="${episode.id}">
            <p class="list__item__title">${episode.name}</p>
            <div class="list__item__div">
                <p>${episode.air_date}</p>
                <p>${episode.episode}</p>
            </div>
        </li>`);
  });

}

//Takes the result of all episodes data as parameter
function getEpisodeCharacters(episodes) {
  //When clicking each list item, take its episode id, create a new '.container_main'
  //remove its content and append it to the 'main' section
  $('.sidebar__list__item').on('click', function(e){
    var episodeId = e.target.closest('li').dataset.episodeId;
    var containerMain = $(`<div class="container_main"></div>`);
    $('.container_main').remove();
    $('main').append(containerMain);

    //Iterate over the episodes array, and for each episode compare its id with the target id
    episodes.forEach((episode) => {
      if (episode.id == episodeId) {
        //If the ids match, iterate over that episode's characters array
        //and make an API call for each character
        episode.characters.forEach((character) => {
          axios.get(character).then((response) => {
            printEpisodeCharacters(response.data)
          })
        })
      }
    })
  })
}

//Take the data of each character's individual API call as parameter
function printEpisodeCharacters(character) {
  console.log(character.name)
  $('.container_main').append(`
  <p>${character.name}</p>`)
}