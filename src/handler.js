import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import renderLists from './renderer';

const listOfRss = [];
const listOfArticles = [];

const validateInput = () => {
  const url = document.forms.addRSS.elements.url.value;
  const isValidInput = isURL(url);
  if (!isValidInput) {
    document.getElementById('url').setCustomValidity('Введите адрес');
    document.getElementById('url').class = 'form-control :invalid';
    document.getElementById('url').borderColor = 'red';
  } else {
    document.getElementById('url').setCustomValidity('');
    document.getElementById('url').class = 'form-control :valid';
    document.getElementById('url').borderColor = '';
  }
  return isValidInput;
};

const getURL = () => {
  console.log('GET URL');
  const url = document.getElementById('url').value;
  console.log(`url = ${url}`);
  return url;
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

const addRssToLists = (dom) => {
//  const channelKeys = dom.firstChild.firstChild.children;
  const findTitle = dom.querySelector('title');
  const title = findTitle.firstChild.data;
  const findDesc = dom.querySelector('description');
  //  let desc = '';
  // if (findDesc.length === 0) {
  //  console.log('Description отсутствует');
  // } else {
  const desc = findDesc.firstChild.data;
  // }
  const findLink = dom.querySelector('link');
  // let lnk = '';
  // if (findLink[0].children.length === 0) {
  //  lnk = findLink[0].href;
  // } else {
  const lnk = findLink.firstChild.data;
  // }
  console.log('CONTROL');
  console.log(`$$$ find = ${title} ... ${desc} ... ${lnk}`);
  //  const keys = Object.keys(listOfRss);
  //  const newList = keys.reduce((acc, el) => {
  //    acc[el] = listOfRss[el];
  //    return acc;
  //  }, {});
  listOfRss.push({ title, description: desc, link: lnk });

  const [...findItem] = dom.getElementsByTagName('item');
  const addItem = (arr, i = 19) => {
    if (i < 0) {
      console.log('00000000000');
      return;
    }
    const itemTitle = arr[i].querySelector('title').firstChild.data;
    const itemDesc = arr[i].querySelector('description').firstChild.data;
    const itemLink = arr[i].querySelector('link').firstChild.data;
    console.log(`!!!! item ${itemTitle} .. ${itemDesc} .. ${itemLink}`);
    listOfArticles.push({ title: itemTitle, description: itemDesc, link: itemLink });
    addItem(arr, i - 1);
  };

  if (findItem.length < 20) {
    addItem(findItem, findItem.length - 1);
  } else {
    addItem(findItem);
  }

  console.log(listOfRss);
  console.log(listOfArticles);
  return [listOfRss, listOfArticles];
};

const addStream = () => {
  const url = getURL();
  if (url === '') {
    return;
  }
  const corsUrl = `https://crossorigin.me/${url}`;
  console.log(`----- corsURL -- ${corsUrl} --`);
  document.getElementById('url').value = '';
  axios.get(corsUrl)
    .then(response => parseRSS(response))
    .then(response => addRssToLists(response))
    .then(response => renderLists(response))
    .catch(error => parseError(error));
};

const urlField = document.getElementById('url');
urlField.addEventListener('input', validateInput);
const butn = document.getElementById('button');
butn.addEventListener('click', addStream);
console.log(Object.keys(listOfRss));
// export default addStream(listOfRss);
