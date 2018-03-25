import isURL from 'validator/lib/isURL';
import axios from 'axios';
import renderLists from './renderer';
import state from './state';

const validateInput = () => {
  const urlEl = document.getElementById('url');
  const url = urlEl.value;
  state.isValidURL = isURL(url);
  if (!state.isValidURL) {
    urlEl.classList.add('is-invalid');
    urlEl.classList.remove('is-valid');
  } else {
    //  urlEl.setCustomValidity('');
    urlEl.classList.add('is-valid');
    urlEl.classList.remove('is-invalid');
  }
  return state.isValidURL;
};

const parseError = (str) => {
  console.log('Не удаётся обработать RSS-поток');
  //  document.getElementById('modalWindow').modal('show');
  return new Error(str);
};

const getError = (str) => {
  console.log('Ошибка скачивания потока');
  alert('Не удаётся скачать RSS-поток. Попробуйте позже.');
  return new Error(str);
};

const rssError = () => {
  console.log('Поток не является RSS');
  alert('Поток не распознан как RSS');
  return new Error();
};

const parseRSS = (str) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(str.data, 'application/xml');
  return parsed;
};

const hasItem = (title, list) => list.reduce((acc, el) => {
  if (el.title === title) {
    return true;
  }
  return acc;
}, false);

const addItemToList = (newItem) => {
  const itemTitle = newItem.querySelector('title').firstChild.data;
  const findDesc = newItem.querySelector('description');
  const itemDesc = findDesc ? findDesc.firstChild.wholeText : '';
  const itemLink = newItem.querySelector('link').firstChild.data;
  state.listOfArticleTitles.push(itemTitle);
  if (!hasItem(itemTitle, state.listOfArticles)) {
    state.listOfArticles.push({ title: itemTitle, description: itemDesc, link: itemLink });
  }
  return state;
};

const addRssToLists = (dom) => {
  const hasTagChannel = dom.querySelector('channel');
  if (!hasTagChannel) {
    rssError();
    return;
  }
  const findTitle = dom.querySelector('title');
  const findDesc = dom.querySelector('description');
  const findLink = dom.querySelector('link');
  const title = findTitle.firstChild.data;
  const desc = findDesc.firstChild.data;
  const lnk = findLink.firstChild.data;
  if (!hasItem(title, state.listOfRss)) {
    state.listOfRss.push({ title, description: desc, link: lnk });
    document.getElementById('url').value = '';
  } else {
    // document.getElementById('modalWindow').modal();
    alert('Такой поток уже добавлен');
    return;
  }
  const [...findItem] = dom.getElementsByTagName('item');
  const quantityOfArticles = findItem.length < 20 ? findItem.length : 20;
  const lastIndex = quantityOfArticles - 1;
  const addItem = (arr, i) => {
    if (i < 0) {
      return;
    }
    addItemToList(arr[i]);
    addItem(arr, i - 1);
  };
  addItem(findItem, lastIndex);
};

const addNewItems = (dom) => {
  let hasNewItems = false;
  const [...findItems] = dom.getElementsByTagName('item');
  const findNewItems = (arr, i) => {
    if (i < 0) {
      return;
    }
    const title = arr[i].querySelector('title').textContent;
    if (!state.listOfArticleTitles.includes(title)) {
      hasNewItems = true;
      addItemToList(arr[i]);
    }
    findNewItems(arr, i - 1);
  };
  findNewItems(findItems, 5);
  return hasNewItems;
};

const updateStreams = () => {
  const renderIfNeeded = (array) => {
    const needUpdate = array.reduce((acc, el) => acc || el, false);
    if (needUpdate) {
      renderLists();
    }
    updateStreams();
  };

  const addNewArticles = () => {
    const cors = 'https://crossorigin.me/';
    const promises = state.listOfRssLinks.map(el =>
      axios.get(`${cors}${el}`)
        .then(response => parseRSS(response))
        .then(response => addNewItems(response))
        .catch(() => false));
    Promise.all(promises)
      .then(renderIfNeeded)
      .catch(renderIfNeeded);
  };
  setTimeout(addNewArticles, 5000);
};

const addStream = (event) => {
  const cors = 'https://crossorigin.me/';
  event.preventDefault();
  const url = document.getElementById('url').value;
  state.listOfRssLinks.push(url);
  const corsUrl = `${cors}${url}`;
  axios.get(corsUrl)
    .then(response => parseRSS(response), error => getError(error))
    .then(response => addRssToLists(response), error => parseError(error))
    .then(() => renderLists());
  return false;
};

const handler = () => {
  const urlField = document.getElementById('url');
  urlField.addEventListener('input', validateInput);
  const formAdd = document.getElementById('addRSS');
  formAdd.addEventListener('submit', event => addStream(event));
  updateStreams();
};

export default handler;
