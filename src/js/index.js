import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";


const simpleInstance = new SimpleLightbox(".gallery a")

const refs = {
    formElem: document.querySelector(".search-form"),
    loadMoreBtn: document.querySelector(".js-btn-loadmore"),
    galleryElem: document.querySelector(".gallery"),
};
let query;
let page;
const perPage = 40;

refs.formElem.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreClick);

async function onFormSubmit(e) {
    e.preventDefault();
    refs.loadMoreBtn.classList.add("is-hidden");
    query = e.target.elements.searchQuery.value;
    page = 1;
    refs.galleryElem.innerHTML = "";

    const data = await getImages();
    if (data.totalHits === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    renderImages(data.hits);
    refs.loadMoreBtn.classList.remove("is-hidden");

     if (page >= Math.ceil(data.totalHits / perPage)) {
        refs.loadMoreBtn.classList.add("is-hidden")
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

async function onLoadMoreClick(e) {
     page++;
    const data = await getImages();

    renderImages(data.hits);
    if (page >= Math.ceil(data.totalHits / perPage)) {
        refs.loadMoreBtn.classList.add("is-hidden")
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

async function getImages() {
    const params = new URLSearchParams({
        key: "38641862-6e3c32f7e92ada91c695f5ab6",
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: perPage,


    })
    const BASE_URL = "https://pixabay.com/api/?";
    const URL = BASE_URL + params;
   const res = await axios.get(URL)
        return res.data;
    
}

function renderImages(hits) {
    const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a href="${largeImageURL}" class="photo-card">
        <div class="img-box"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
  
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</a>`
    }).join("");
    refs.galleryElem.insertAdjacentHTML("beforeend", markup);
    simpleInstance.refresh();
}
