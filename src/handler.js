import isURL from 'validator/lib/isURL';
import axios from 'axios';
import renderLists from './renderer';
import state from './';

const cors = 'https://crossorigin.me/';

const validateInput = () => {
  const url = document.forms.addRSS.elements.url.value;
  state.isValidURL = isURL(url);
  if (!state.isValidURL) {
  //    document.getElementById('url').setCustomValidity('Введите адрес');
    document.getElementById('url').className = 'form-control is-invalid';
  } else {
  //  document.getElementById('url').setCustomValidity('');
    document.getElementById('url').className = 'form-control is-valid';
  }
  return state.isValidURL;
};

const parseError = (str) => {
  console.log('Не удаётся обработать RSS-поток');
  return new Error(str);
};

const parseRSS = (str) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(str.data, 'application/xml');
  return parsed;
};

const hasItem = (titl, lst) => lst.reduce((acc, el) => {
  if (el.title === titl) {
    return true;
  }
  return acc;
}, false);

const addItemToList = (newItem) => {
  const itemTitle = newItem.querySelector('title').firstChild.data;
  const itemDesc = newItem.querySelector('description').firstChild.wholeText;
  const itemLink = newItem.querySelector('link').firstChild.data;
  if (!hasItem(itemTitle, state.listOfArticles)) {
    state.listOfArticles.push({ title: itemTitle, description: itemDesc, link: itemLink });
  }
  return state;
};

const addRssToLists = (dom) => {
  const findTitle = dom.querySelector('title');
  const title = findTitle.firstChild.data;
  const findDesc = dom.querySelector('description');
  const desc = findDesc.firstChild.data;
  const findLink = dom.querySelector('link');
  const lnk = findLink.firstChild.data;
  if (!hasItem(title, state.listOfRss)) {
    state.listOfRss.push({ title, description: desc, link: lnk });
  }
  const [...findItem] = dom.getElementsByTagName('item');
  const addItem = (arr, i) => {
    if (i < 0) {
      return;
    }
    addItemToList(arr[i]);
    addItem(arr, i - 1);
  };
  if (findItem.length < 20) {
    addItem(findItem, findItem.length - 1);
  } else {
    addItem(findItem, 19);
  }
  return state;
};

const addNewItems = (dom) => {
  const [...findItems] = dom.getElementsByTagName('item');
  console.log('TEST TEST TEST');
};

const findNewArticles = () => {
  state.listOfRss.forEach((el) => {
    const corsUrl = `${cors}${el.link}`;
    axios.get(corsUrl)
      .then(response => parseRSS(response))
      .then(response => addNewItems(response))
      .catch(error => parseError(error));
  });
//  renderLists();
};

const addStream = (event) => {
  event.preventDefault();
  const url = document.getElementById('url').value;
  const corsUrl = `${cors}${url}`;
  document.getElementById('url').value = '';
  axios.get(corsUrl)
    .then(response => parseRSS(response))
    .then(response => addRssToLists(response))
    .then(() => renderLists())
    .then(() => setInterval(findNewArticles, 5000))
    .catch(error => parseError(error));
  return false;
};

const urlField = document.getElementById('url');
urlField.addEventListener('input', validateInput);
const formAdd = document.getElementById('addRSS');
formAdd.addEventListener('submit', event => addStream(event));
