const MARVEL_API = 'https://gateway.marvel.com:443/v1/public/characters?apikey=b9387eb3d701ea1e371e1f554eb585c5';
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';
const MARVEL_COMICS_API = '';

function retrieveJSON(searchTerm, callback1, callback2) {
  const query1 = {
    name: searchTerm,
    ts: '1',
    hash: 'c516f34ed1b8c272e76721b1be1dfe71',
  };
  const query2 = {
    part: 'snippet',
    key: 'AIzaSyDW6ZU42JlJmV6NVAvR6jruTCKK39wP9ng',
    q: 'marvel ' + searchTerm
  };
  
  $.getJSON(MARVEL_API, query1, callback1);
  $.getJSON(YOUTUBE_API, query2, callback2);
}

function displayMarvelData(data) {
  console.log(data.data.results)
  if (data.data.results[0] === undefined) {
    $('.results-section').html(`
      <img src='https://vignette.wikia.nocookie.net/mafiagame/images/2/23/Unknown_Person.png/revision/latest/scale-to-width-down/464?cb=20151119092211'>
      <h4>No character found by that name.</h4>
    `)
    
    $('.videos-section').prop('hidden', true);
    $('.results').prop('hidden', false);
    return;
  }
  else {
    $('.results-section').html(`
      <img src='${data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension}'>
      <h4>${data.data.results[0].name}</h4>
      <p>${data.data.results[0].description}</p>
      <p>More Information: <a href='${data.data.results[0].urls[0].url}' target='_blank'>${data.data.results[0].name}</a>
    `)
    
    $('.results').prop('hidden', false);
    $('.videos-section').prop('hidden', false);
  }
}

function displayYouTubeData(data) {
  const results = data.items.map((item, index) => {
    return `
      <div class='result'>
        <h4 class='result-header'>${item.snippet.title}</h4>
        <p class='result-header'>Channel: 
          <a href='https://www.youtube.com/channel/${item.snippet.channelId}' target='_blank'>${item.snippet.channelTitle}</a>
        </p>
        <p>${item.snippet.description}</p><br>
        <a href='#' class='video' id='${item.id.videoId}'><img src='${item.snippet.thumbnails.medium.url}'></a>
        </div>
      </div><br>
    `
  })
  $('.videos-section').html(results)
}

function watchSubmit() {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.user-input');
    const queryTerm = (queryTarget.val());
    
    retrieveJSON(queryTerm, displayMarvelData, displayYouTubeData);

    queryTarget.val("");
  })
}

$(watchSubmit);