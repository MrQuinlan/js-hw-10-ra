import '../node_modules/slim-select/dist/slimselect.css';
import axios from 'axios';
import breedsTmpl from './templates/breeds-template.hbs';
import breedTmpl from './templates/breed-card.hbs';
import SlimSelect from 'slim-select';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common['x-api-key'] =
  'live_bMJwWsrAJeIf7SqWjqF4fbQgIfErzLZ9KZFaztOqVJO2hquzSuMOFtW18uuUKcYv';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';

const refs = {
  breedsListRef: document.querySelector('.breed-select'),
  breedCardRef: document.querySelector('.breed-card'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

const getList = function (breeds) {
  return axios.get(`${breeds}`).then(response => response.data);
};

const renderList = function (list) {
  refs.breedsListRef.insertAdjacentHTML('beforeend', breedsTmpl(list));
  new SlimSelect({
    select: '#single',
  });
};

getList('breeds/')
  .then(response => {
    refs.breedsListRef.classList.toggle('is-hidden');
    refs.loader.classList.toggle('is-hidden');

    renderList(response);

    refs.loader.classList.toggle('is-hidden');
  })
  .catch(error => {
    refs.error.classList.toggle('is-hidden');

    Notify.failure(`${error.message}`, {
      clickToClose: true,
      position: 'center-top',
      borderRadius: '15px',
      timeout: '5000',
    });
  });

const getCatById = id => {
  return axios
    .get(`images/search?breed_ids=${id}`)
    .then(response => response.data);
};

const renderBreed = function (breed) {
  refs.breedCardRef.innerHTML = breedTmpl(breed);
};

refs.breedsListRef.addEventListener('change', e => {
  refs.breedCardRef.innerHTML = '';

  refs.loader.classList.toggle('is-hidden');

  getCatById(e.currentTarget.value)
    .then(response => {
      refs.loader.classList.toggle('is-hidden');
      const breed = {
        url: response[0].url,
        name: response[0].breeds[0].name,
        description: response[0].breeds[0].description,
        temperament: response[0].breeds[0].temperament,
        wikiUrl: response[0].breeds[0].wikipedia_url,
      };
      refs.loader.classList.toggle('is-hidden');
      renderBreed(breed);
      refs.loader.classList.toggle('is-hidden');
    })
    .catch(error => {
      refs.error.classList.remove('is-hidden');
      Notify.failure(`${error.message}`, {
        clickToClose: true,
        position: 'center-top',
        borderRadius: '15px',
        timeout: '5000',
      });
    });
});
