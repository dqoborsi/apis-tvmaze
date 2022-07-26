"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const placeholderImg = 'https://tinyurl.com/tv-missing';


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShows(term) {
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
  console.log('got:', response);
  let resultArr = [];
  for (let entry of response.data) {
    let { id, name, summary, image } = entry.show;
    let showObj = {id, name, summary, image: image.original};
    resultArr.push(showObj);
  }
  console.log('resultArr:', resultArr);
  return resultArr;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image || placeholderImg}
              alt=${show.name}
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="episodes-btn" class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
             <script>
              $("[data-show-id='${show.id}'] #episodes-btn").on('click', async function(e){
                e.preventDefault();
                console.log('clicked!');
                let episodesInfo = await getEpisodesOfShow(${show.id});
                populateEpisodes(episodesInfo);
              })
             </script>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await searchShows(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/search/shows/${id}/episodes`);
  console.log('got:', response);
  for (let entry of response.data) {
    let { id, name, season, number } = entry;
    let episodesInfo = {id, name, season, number};
    resultArr.push(episodesInfo);
  }
  console.log('resultArr:', resultArr);
  return resultArr;
}

/** Write a clear docstring for this function... */

function populateEpisodes(arrayOfEpisodesInfo) {
  $('#episodes-list').append(`<li>${arrayOfEpisodesInfo[1]} (season ${arrayOfEpisodesInfo[2]}, number ${arrayOfEpisodesInfo[3]})</li>`)
}

