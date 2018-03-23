/* eslint-env browser */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const listOfRss = {};

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

const addRssToList = (dom, rssList) => {
  const channelKeys = dom.firstChild.firstChild.children;
  const find = dom.getElementsByTagName('title');
  const title = channelKeys[0].firstChild.data;
  const desc = channelKeys[1].firstChild.data;
  const lnk = channelKeys[2].firstChild.data;
  console.log(`$$$ find = ${find[0].firstChild.data} ... ${lnk}`);
  const keys = Object.keys(rssList);
  const newList = keys.reduce((acc, el) => {
    acc[el] = rssList[el];
    return acc;
  }, {});
  newList[title] = { title, description: desc, link: lnk };
  console.log(`rssList == ${newList[title].link}`);
  return newList;
};

const finish = (list) => {
  const keys = Object.keys(list);
  keys.reduce((acc, el) => {
    acc[el] = list[el];
    return acc;
  }, listOfRss);
  console.log(listOfRss);
};

const addStream = (list) => {
  const url = getURL();
  if (url === '') {
    return;
  }
  const corsUrl = `https://crossorigin.me/${url}`;
  console.log(`----- corsURL -- ${corsUrl} --`);
  //  url.value = '';
  axios.get(corsUrl)
    .then(response => parseRSS(response))
    .then(response => addRssToList(response, list))
    .then(response => finish(response))
    .catch(error => parseError(error));
};

document.getElementById('button').onclick = addStream(listOfRss);
console.log(Object.keys(listOfRss));
// export default addStream(listOfRss);
