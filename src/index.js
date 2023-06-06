import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCardTmp from './templates/photo-card.hbs';
import SearchingApiServices from './js/searching-service';
import Notiflix from 'notiflix';

const refs = {
  section: document.querySelector('.search-section'),
  input: document.querySelector('.search-form > input'),
  searchForm: document.querySelector('.search-form'),
  btnMore: document.querySelector('.more-btn'),
  gallery: document.querySelector('.gallery'),
  wrapper: document.querySelector('.wrapper'),
};

const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchingApiServices = new SearchingApiServices();

refs.searchForm.addEventListener('submit', onSearch);
refs.btnMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  showLoader();
  searchingApiServices.query = e.currentTarget.elements.searchQuery.value;
  searchingApiServices.resetPage();
  await searchingApiServices.fetchPhotoCards().then(({ data: { hits } }) => {
    if (hits.length === 0) {
      failNotiflix();
      return;
    }
    clearGallery();
    appendPhotoCardsMarkup(hits);
    refs.section.classList.add('to-top');
    refs.btnMore.classList.remove('hidden');
    refs.gallery.classList.remove('hidden');
  });
  hideLoader();
}

async function onLoadMore() {
  showLoader();
  await searchingApiServices
    .fetchPhotoCards()
    .then(({ data: { hits } }) => appendPhotoCardsMarkup(hits));
  hideLoader();
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

function showLoader() {
  refs.wrapper.classList.remove('hidden');
}

function hideLoader() {
  refs.wrapper.classList.add('hidden');
}

// function scroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();
//   console.log('cardHeight:', cardHeight);

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
