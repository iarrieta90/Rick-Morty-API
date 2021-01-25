axios
  .all([
    // getCharacters(),
    // getLocations(),
    getEpisodes(),
  ])
  .then((response) => {
    printEpisodes(response[0].data.results);
    getEpisodesNext(response[0].data.info.next);

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
    $(".sidebar__next").on("click", function () {
      axios.get(next).then((response) => {
        printEpisodes(response.data.results);
        getEpisodesNext(response.data.info.next);
        console.log(next)

        axios.get(response.data.info.next).then((response) => {
            printEpisodes(response.data.results);
            console.log(response.data.info.next)
    
          });

      });
    });

}

function printEpisodes(episodes) {
  episodes.forEach((episode) => {
    $(".sidebar__list").append(`
        <li class="sidebar__list__item">
            <p class="list__item__title">${episode.name}</p>
            <div class="list__item__div">
                <p>${episode.air_date}</p>
                <p>${episode.episode}</p>
            </div>
        </li>`);
  });
}

