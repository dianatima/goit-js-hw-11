import axios from 'axios';
// import API from './js/api-service';
import getRefs from './js/get-refs';
import Notiflix from 'notiflix';

const refs = getRefs();

let page = '1';
let query = '';
let per_page = 40;
let isFirstSearch = false;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32083326-5131f12fe438843c4a27c5327';

async function fetchPictures(query, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: per_page,
  });
  try {
    const response = await axios.get(`${BASE_URL}/?${params}`);
    const arrayLength = response.data.hits.length;
    if (arrayLength === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    console.log('length:', arrayLength);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

function getPictures(query, page) {
  fetchPictures(query, page).then(res => {
    if (isFirstSearch) {
      Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
      isFirstSearch = false;
    }
    if (res.data.total === 0 || query === '') {
      refs.loadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderPictures(res.data.hits);

    const allPictures = (page - 1) * per_page + res.data.hits.length;
    const totalHits = res.data.totalHits;

    if (allPictures >= totalHits) {
      refs.loadMore.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }

    if (res.data.totalHits / per_page > 1) {
      refs.loadMore.classList.remove('is-hidden');
    }
  });
}

refs.searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  page = 1;
  isFirstSearch = true;

  refs.gallery.innerHTML = '';

  query = event.target.elements.searchQuery.value.trim();
  console.log('query:', query);
  getPictures(query, page);
}

// fetchPictures().then(res => renderPictures(res.data.hits));

// then(response => console.log(response.data.hits));

function renderPictures(pictures) {
  const pictureElem = pictures
    .map(({ previewURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
      <img src="${previewURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>
`;
    })
    .join('');
  // refs.gallery.insertAdjacentHTML = ('beforeend', pictureElem);
  refs.gallery.innerHTML += pictureElem;
}

refs.loadMore.addEventListener('click', onLoadMoreClick);

function onLoadMoreClick(event) {
  page += 1;
  getPictures(query, page);
}
