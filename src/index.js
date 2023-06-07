import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCardTmp from './templates/photo-card.hbs';
import SearchingApiServices from './js/searching-service';
import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';

const refs = {
  section: document.querySelector('.search-section'),
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  wrapper: document.querySelector('.wrapper'),
  loader: document.querySelector('.loader'),
  loaderMore: document.querySelector('.loader-more'),
};

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchingApiServices = new SearchingApiServices();

let scrollHandler = throttledFn();

function throttledFn() {
  return throttle(loadMoreByScroll, 500);
}

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  showLoader();
  searchingApiServices.query = e.currentTarget.elements.searchQuery.value;
  searchingApiServices.resetPage();
  await searchingApiServices
    .fetchPhotoCards()
    .then(({ data: { hits } }) => {
      if (hits.length === 0) {
        failNotiflix();
        window.removeEventListener('scroll', scrollHandler);
        return;
      }
      clearGallery();
      appendPhotoCardsMarkup(hits);
      refs.section.classList.add('to-top');
      refs.gallery.classList.remove('hidden');
      window.addEventListener('scroll', scrollHandler);
    })
    .catch(error => console.error(error));
  hideLoader();
}

async function onLoadMore() {
  showLoaderMore();
  await searchingApiServices
    .fetchPhotoCards()
    .then(({ data: { totalHits, hits } }) => {
      appendPhotoCardsMarkup(hits);
      if (hits.length === 0) {
        window.removeEventListener('scroll', scrollHandler);
        hideLoaderMore();
        totalNotiflix(totalHits);
        return;
      }
      hideLoaderMore();
    })
    .catch(error => console.error(error));

  lightBox.refresh();
}

function appendPhotoCardsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTmp(hits));
  lightBox.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function failNotiflix() {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your search query. Please try again.`,
    {
      clickToClose: true,
      timeout: 4000,
    }
  );
}

function totalNotiflix(totalHits) {
  Notiflix.Notify.success(`We're sorry, but you've reached the end of search results. The total pictures ${totalHits}`, {
    clickToClose: true,
    timeout: 4000,
  });
}

function showLoader() {
  refs.wrapper.classList.remove('hidden');
  refs.loader.classList.remove('hidden');
}

function hideLoader() {
  refs.wrapper.classList.add('hidden');
  refs.loader.classList.add('hidden');
}

function showLoaderMore() {
  refs.loaderMore.classList.remove('hidden');
}

function hideLoaderMore() {
  refs.loaderMore.classList.add('hidden');
}

function loadMoreByScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 400) {
    onLoadMore();
  }
}

