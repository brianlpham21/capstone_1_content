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
    q: 'marvel ' + searchTerm,
    maxResults: 4
  };

  $.getJSON(MARVEL_API, query1, callback1);
  $.getJSON(YOUTUBE_API, query2, callback2);
}

function displayMarvelData(data) {
  if (data.data.results[0] === undefined) {
    $('.unknown-section').html(`
      <div class='unknown'>
        <h2>No character found by that name.</h2>
      </div>
    `);

    $('.main-unknown-section').prop('hidden', false);
    $('.main-results-section').prop('hidden', true);
    $('.main-events-section').prop('hidden', true);
    $('.main-comics-section').prop('hidden', true);
    $('.main-videos-section').prop('hidden', true);
    $('.main-share-section').prop('hidden', true);
    return;
  }
  else {
    if (data.data.results[0].description === '') {
      $('.results-section').html(`
        <img src='${data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension}' class='character-photo' alt='character-photo'>
        <div class='results-text'>
          <h2 class='character-name'>${data.data.results[0].name}</h2>
          <hr>
          <p class='character-description'>No Description Available.</p>
          <p><strong>For Information</strong> <a href='${data.data.results[0].urls[0].url}' target='_blank'><img src='https://image.flaticon.com/icons/png/128/108/108528.png' class='more-icon' alt='click-more-icon'></a></p>
        </div>
      `);

      $('.main-unknown-section').prop('hidden', true);
      $('.main-comics-section').prop('hidden', false);
      $('.main-events-section').prop('hidden', false);
      $('.main-videos-section').prop('hidden', false);
      $('.main-results-section').prop('hidden', false);
      $('.main-share-section').prop('hidden', false);
    }
    else {
      $('.results-section').html(`
        <img src='${data.data.results[0].thumbnail.path + '.' + data.data.results[0].thumbnail.extension}' class='character-photo' alt='character-photo'>
        <div class='results-text'>
          <h2 class='character-name'>${data.data.results[0].name}</h2>
          <hr>
          <p class='character-description'>${data.data.results[0].description}</p>
          <p><strong>Read More</strong> <a href='${data.data.results[0].urls[0].url}' target='_blank'><img src='https://image.flaticon.com/icons/png/128/108/108528.png' class='more-icon' alt='click-more-icon'></a></p>
        </div>
      `);

      $('.main-unknown-section').prop('hidden', true);
      $('.main-comics-section').prop('hidden', false);
      $('.main-events-section').prop('hidden', false);
      $('.main-videos-section').prop('hidden', false);
      $('.main-results-section').prop('hidden', false);
      $('.main-share-section').prop('hidden', false);
    }

    const query_events = {
      apikey: 'b9387eb3d701ea1e371e1f554eb585c5',
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      limit: 3
    };

    $.getJSON(MARVEL_EVENTS_API + data.data.results[0].id + '/events', query_events, function(data) {
      const results = data.data.results.map((item, index) => {
        return `
          <div class='event-result'>
            <a href='${item.urls[0].url}' target='_blank'><img src='${item.thumbnail.path + '.' + item.thumbnail.extension}' class='image' alt='event-photo'></a>
            <h4 class='item-title'>${item.title}</h4>
            <p class='description'>${item.description}</p>
          </div>
        `});

      $('.events-section').html(results);
    });


    const query_comics = {
      apikey: 'b9387eb3d701ea1e371e1f554eb585c5',
      ts: '1',
      hash: 'c516f34ed1b8c272e76721b1be1dfe71',
      limit: 3
    };

    $.getJSON(MARVEL_COMICS_API + data.data.results[0].id + '/comics', query_comics, function(data) {
      const results = data.data.results.map((item, index) => {
        console.log(item.description);
        if (item.description === null) {
          return `
            <div class='comic-result'>
              <a href='${item.urls[0].url}' target='_blank'><img src='${item.thumbnail.path + '.' + item.thumbnail.extension}' class='image' alt='comic-photo'></a>
              <h4 class='item-title'>${item.title}</h4>
              <p class='no-description'>No description available.</p>
            </div>
          `
        }
        else {
          return `
            <div class='comic-result'>
              <a href='${item.urls[0].url}' target='_blank'><img src='${item.thumbnail.path + '.' + item.thumbnail.extension}' class='image' alt='comic-photo'></a>
              <h4 class='item-title'>${item.title}</h4>
              <p class='description'>${item.description}</p>
            </div>
          `;
        }
      });

      $('.comics-section').html(results);
    });
  }
}

function displayYouTubeData(data) {
  const results = data.items.map((item, index) => {
    return `
      <div class='video-result'>
        <a href='#' class='video-box' id='${item.id.videoId}'><img src='${item.snippet.thumbnails.medium.url}' class='video' alt='video-image'></a>
        <h4 class='video-title'>${item.snippet.title}</h4>
        <p class='video-channel'>Channel:
          <a href='https://www.youtube.com/channel/${item.snippet.channelId}' target='_blank'>${item.snippet.channelTitle}</a>
        </p>
        <p class='video-description'>${item.snippet.description}</p>
      </div>
    `;
  });

  $('.videos-section').html(results);
}

function watchSubmit() {
  $('form').on('submit', function(event) {
    event.preventDefault();

    const queryTarget = $(event.currentTarget).find('input');
    const queryTerm = (queryTarget.val());

    retrieveJSON(queryTerm, displayMarvelData, displayYouTubeData);

    queryTarget.val("");
  });
}

function watchLogo() {
  $('.logo').on('click', function() {
    location.reload();
  });
}

$(watchSubmit);
$(watchLogo);

// LightBox Features

function watchImageClick() {
  $('.videos-section').on('click', '.video-box', function() {
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
      $('iframe').attr('src', link);
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
