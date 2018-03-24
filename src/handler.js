import isURL from 'validator/lib/isURL';
import axios from 'axios';
import renderLists from './renderer';
import state from './';

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
  console.log(str.data);
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
  const addItem = (arr, i = 19) => {
    if (i < 0) {
      return;
    }
    const itemTitle = arr[i].querySelector('title').firstChild.data;
    const itemDesc = arr[i].querySelector('description').firstChild.wholeText;
    const itemLink = arr[i].querySelector('link').firstChild.data;
    if (!hasItem(itemTitle, state.listOfArticles)) {
      state.listOfArticles.push({ title: itemTitle, description: itemDesc, link: itemLink });
    }
    addItem(arr, i - 1);
  };

  if (findItem.length < 20) {
    addItem(findItem, findItem.length - 1);
  } else {
    addItem(findItem);
  }
  return state;
};

const addStream = () => {
  const url = document.getElementById('url').value;
  const corsUrl = `https://crossorigin.me/${url}`;
  document.getElementById('url').value = '';
  axios.get(corsUrl)
    .then(response => parseRSS(response))
    .then(response => addRssToLists(response))
    .then(() => renderLists())
    .catch(error => parseError(error));
};

const urlField = document.getElementById('url');
urlField.addEventListener('input', validateInput);
const formAdd = document.getElementById('addRSS');
// const btn = document.getElementById('button');
formAdd.addEventListener('submit', addStream);
// btn.addEventListener('click', addStream);
