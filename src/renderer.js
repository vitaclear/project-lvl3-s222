import state from './';

const makeDom = (head, array, name) => {
  if (!array || array.length === 0) {
    return head;
  }
  const txt = document.createTextNode(name);
  const header = document.createElement('h2');
  header.appendChild(txt);

  const [...children] = head.children;
  children.forEach(el => head.removeChild(el));
  const br = document.createElement('br');
  head.appendChild(br);

  const addElt = (obj) => {
    const divEl = document.createElement('div');
    const keys = Object.keys(obj);
    keys.forEach((elem) => {
      const tag = elem === 'title' ? document.createElement('h5') : document.createElement('p');
      tag.className = `${elem}`;
      const elemText = document.createTextNode(`${obj[elem]}`);
      const aEl = document.createElement('a');
      aEl.href = `${obj[elem]}`;
      aEl.appendChild(elemText);
      const text = elem === 'link' ? aEl : elemText;
      tag.appendChild(text);
      divEl.appendChild(tag);
    });
    head.prepend(divEl);
  };
  array.forEach(elt => addElt(elt));
  head.prepend(header);
  return head;
};

const render = () => {
  const rssList = document.getElementById('rssList');
  const articleList = document.getElementById('articleList');

  const rssDom = makeDom(rssList, state.listOfRss, 'Список потоков');
  const articleDom = makeDom(articleList, state.listOfArticles, 'Список статей');

  return [rssDom, articleDom];
};

export default render;
