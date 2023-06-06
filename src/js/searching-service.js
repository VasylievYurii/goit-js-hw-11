import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '14851354-5f3abbeacded0434ca4aa137e',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: '40'
});

export default class SearchingApiServices {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPhotoCards() {
    const data = await axios({
      method: 'get',
      url: `${BASE_URL}?${searchParams}&q=${this.searchQuery}&page=${this.page}`});
      this.incrementPage();
    return data;
  }

  // async fetchPhotoCards() {
  //   return await fetch(
  //     `${BASE_URL}?${searchParams}&q=${this.searchQuery}&page=${this.page}`
  //   )
  //     .then(response => response.json())
  //     .then(({hits}) => {
  //       this.incrementPage();
  //       return hits;
  //     });
  // }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
