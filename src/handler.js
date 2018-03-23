/* eslint-env browser */
import isURL from 'validator/lib/isURL';
import axios from 'axios';

const getURL = () => {
  console.log('GET URL');
  const url = document.forms.addRSS.elements.url.value;
  console.log(url);
  return url;
};

const validateInput = (userInput) => {
  const url = userInput.value; // document.forms.addRSS.elements.url.value;
  const isValidInput = isURL(url);
  if (!isValidInput) {
    console.log('Некорректный URL');
    document.getElementById('url').setCustomValidity('Введён некорректный адрес');
    document.getElementById('url').class = 'form-control is-invalid';
  }
  return isValidInput;
};

const parseRSS = (str) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, 'application/xml');
};

const addRssToList = (dom, rssList) => {
  const keys = Object.keys(rssList);
  const newList = keys.reduce((acc, el) => {
    acc[el] = rssList[el];
    return acc;
  }, {});
  newList[dom.title] = { description: dom.description, link: dom.link };
  return newList;
};

const parseError = (str) => {
  console.log('Не удаётся обработать RSS-поток');
  return new Error(str);
};

const addStream = (list) => {
  const url = getURL();
  const isValid = validateInput(url);
  if (!isValid) {
    console.log('Введён некорректный адрес');
    return;
  }
  const corsUrl = `https://crossorigin.me/${url}`;
  url.value = '';
  axios.get(corsUrl)
    .then(response => parseRSS(response))
    .then(response => addRssToList(response, list))
    .catch(error => parseError(error));
};

export default addStream;
