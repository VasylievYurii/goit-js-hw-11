import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import getPictures from './js/on-search';

const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = ;

const refs = {
  section: document.querySelector('.search-section'),
  input: document.querySelector('.search-form > input'),
  searchForm: document.querySelector('.search-form'),
  btnSearch: document.querySelector('.search-btn'),
  btnMore: document.querySelector('.more-btn'),
  gallery: document.querySelector('.gallery')
};

const searchParams = new URLSearchParams({
  key: '14851354-5f3abbeacded0434ca4aa137e',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});

refs.searchForm.addEventListener('submit', showResultInConsole);

async function getPictures(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.query.value;
  console.log("searchQuery:", searchQuery);
  const response = await fetch(
    `${BASE_URL}?${searchParams}&q=${searchQuery}`
  );
  const users = await response.json();
  if (!response) {
    throw new Error(response.statusText);
  }
  return users;
}


// async function getPictures() {
//   event.preventDefault();
//   const response = await fetch(
//     `${BASE_URL}?${searchParams}&q=${refs.input.value}`
//   );
//   const users = await response.json();
//   if (!response) {
//     throw new Error(response.statusText);
//   }
//   return users;
// }

function showResultInConsole() {
    refs.section.classList.add('to-top');
    if (refs.gallery.classList.contains('hidden')) {

        refs.gallery.classList.remove('hidden');
    }
    // refs.section.insertAdjacentHTML('beforeend', markupGallery( ));
  getPictures()
    .then(({ hits }) => {
      hits.forEach(data => {
        refs.gallery.insertAdjacentHTML('beforeend', markupSearching(data));
        
        });
        new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
          });

          if (refs.btnMore.classList.contains('hidden')) {

            refs.btnMore.classList.remove('hidden');
        }
    })
    .catch();

    
}

function markupSearching(data) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = data;
  return `
  
  <li class="gallery__item">
  <a class="gallery__link" href="${largeImageURL}">
  <img
      class="gallery__image"
      src="${webformatURL}"
      alt="${tags}"
      loading="lazy"
  />
  </a>
  <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
  </li>`;
   
}

// function markupGallery(){
//     return`
//     <ul class="gallery"> </ul>`
// }

// function markupBtnMore(){
//     return`
//     `
// }