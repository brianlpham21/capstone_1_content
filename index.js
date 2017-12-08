const MARVEL_API = 'https://gateway.marvel.com:443/v1/public/characters?apikey=b9387eb3d701ea1e371e1f554eb585c5';
const MARVEL_COMICS_API = 'https://gateway.marvel.com:443/v1/public/characters/';
const MARVEL_EVENTS_API = 'https://gateway.marvel.com:443/v1/public/characters/';
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';

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
  if (data.data.results[0] === undefined) {
    $('.results-section').html(`
      <div class='unknown-section'>
        <img src='https://vignette.wikia.nocookie.net/mafiagame/images/2/23/Unknown_Person.png/revision/latest/scale-to-width-down/464?cb=20151119092211' class='character-photo' alt='unknown-photo'>
        <h4>No character found by that name.</h4>
      </div>
    `);

    $('.results-section').prop('hidden', false);
    $('.comics-section').prop('hidden', true);
    $('.events-section').prop('hidden', true);
    $('.videos-section').prop('hidden', true);
    return;
  }
  else {
    $('.results-section').html(`
      <img src='${data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension}' class='character-photo' alt='character-photo'>
      <div class='text'>
        <h4>${data.data.results[0].name}</h4>
        <p>${data.data.results[0].description}</p>
        <p>More Information: <a href='${data.data.results[0].urls[0].url}' target='_blank'>${data.data.results[0].name}</a>
      </div>
    `);

    $('.comics-section').prop('hidden', false);
    $('.events-section').prop('hidden', false);
    $('.videos-section').prop('hidden', false);
    $('.results-section').prop('hidden', false);

    const query_comics = {
      apikey: 'b9387eb3d701ea1e371e1f554eb585c5',
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      limit: 5
    };

    $.getJSON(MARVEL_COMICS_API + data.data.results[0].id + '/comics', query_comics, function(data) {
      const results = data.data.results.map((item, index) => {
        return `
          <div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <a href='${item.urls[0].url}' target='_blank'><img src='${item.thumbnail.path + '.' + item.thumbnail.extension}'></a>
          </div>
        `});
      $('.comics-section').html(results);
    });

    const query_events = {
      apikey: 'b9387eb3d701ea1e371e1f554eb585c5',
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      limit: 5
    };

    $.getJSON(MARVEL_EVENTS_API + data.data.results[0].id + '/events', query_events, function(data) {
      const results = data.data.results.map((item, index) => {
        return `
          <div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <a href='${item.urls[0].url}' target='_blank'><img src='${item.thumbnail.path + '.' + item.thumbnail.extension}'></a>
          </div>
        `});
      $('.events-section').html(results);
    });
  }
}

function displayYouTubeData(data) {
  const results = data.items.map((item, index) => {
    return `
      <div class='result'>
        <h4>${item.snippet.title}</h4>
        <p>Channel:
          <a href='https://www.youtube.com/channel/${item.snippet.channelId}' target='_blank'>${item.snippet.channelTitle}</a>
        </p>
        <p>${item.snippet.description}</p><br>
        <a href='#' class='video' id='${item.id.videoId}'><img src='${item.snippet.thumbnails.medium.url}'></a>
      </div><br>
    `;
  });

  $('.videos-section').html(results);
}

function watchSubmit() {
  $('form').on('submit', function(event) {
    event.preventDefault();

    const queryTarget = $(event.currentTarget).find('input');
    const queryTerm = (queryTarget.val());

    const elem = $('.search-bar');
    var pos = 350;
    var id = setInterval(frame, 4);
    function frame() {
        if (pos === 10) {
            clearInterval(id);
        } else {
            pos--;
            elem.css('top', pos + 'px');
        }
    }

    retrieveJSON(queryTerm, displayMarvelData, displayYouTubeData);

    queryTarget.val("");
  });
}

$(watchSubmit);

// LightBox Features

function watchImageClick() {
  $('.videos-section').on('click', '.video', function() {
    $('.light-box-area').prop('hidden', false);

    let number = $(this).attr('id');
    let link = 'https://www.youtube.com/embed/' + number;

    if ($('#light-box').length <= 0) {
      $('.light-box-area').append(`
        <div id='light-box'>
          <span class='close-button'>close</span>
          <iframe width="1425" height="641" src='' frameborder="0" gesture="media" allowfullscreen></iframe>
        </div>`);

      $('#light-box').show();
      $('#light-box iframe').attr('src', link);
    }
    else {
      $('#light-box').show();
      $('iframe').attr('src', link);
    }
  });
}

function watchCloseClick() {
  $('.light-box-area').on('click', '.close-button', function() {
    $('.light-box-area').prop('hidden', true);
    $('#light-box').hide();
    $('iframe').attr('src', '');
  });
}

function addLightBoxFeatures() {
  watchImageClick();
  watchCloseClick();
}

$(addLightBoxFeatures);
