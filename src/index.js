import axios from 'axios';
// import API from './js/api-service';
import getRefs from './js/get-refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

let page = '1';
let query = '';
let per_page = 40;
let isFirstSearch = false;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32083326-5131f12fe438843c4a27c5327';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

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
  const response = await axios.get(`${BASE_URL}/?${params}`);
  console.log(response);
  if (response.status !== 200) {
    throw new Error(response.status);
  }
  return response.data;
}

async function getPictures(query, page) {
  await fetchPictures(query, page)
    .then(res => {
      const arrayLength = res.hits.length;

      if (arrayLength === 0 || res.total === 0) {
        // refs.loadMore.classList.add('is-hidden');
        throw new Error(response.status);
      }

      if (isFirstSearch) {
        Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
        isFirstSearch = false;
      }

      renderPictures(res.hits);

      const allPictures = (page - 1) * per_page + res.hits.length;
      const totalHits = res.totalHits;

      if (allPictures >= totalHits) {
        // refs.loadMore.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      // if (res.totalHits / per_page > 1) {
      //   refs.loadMore.classList.remove('is-hidden');
      // }

      lightbox.refresh();
    })
    .catch(error =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

function renderPictures(pictures) {
  const pictureElem = pictures
    .map(
      ({
        largeImageURL,
        previewURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}">
       <img class="gallery__image" src="${previewURL}" alt="${tags}" loading="lazy" />
      </a>
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
      }
    )
    .join('');
  // refs.gallery.insertAdjacentHTML = ('beforeend', pictureElem);
  refs.gallery.innerHTML += pictureElem;
}

refs.searchForm.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  page = 1;
  isFirstSearch = true;

  refs.gallery.innerHTML = '';

  query = event.target.elements.searchQuery.value.trim();
  if (query === '') {
    Notiflix.Notify.failure('Please enter your query.');
    return;
  }

  try {
    getPictures(query, page);
  } catch (error) {
    console.error(error);
  }
}

// refs.loadMore.addEventListener('click', onLoadMoreClick);

// function onLoadMoreClick() {
//   page += 1;
//   getPictures(query, page);
// }

window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  // console.log('bottom', documentRect.bottom);
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    page += 1;
    getPictures(query, page);
  }
});

arrowTop.onclick = function() {
  window.scrollTo(pageXOffset, 0);
};

window.addEventListener('scroll', function() {
  arrowTop.hidden = pageYOffset < document.documentElement.clientHeight;
});
