// import 'jquery';
import state from './state';

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

  const createButton = (articleTitle) => {
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary');
    btn.setAttribute('data-toggle', 'modal');
    btn.setAttribute('data-target', '#modalWindow');
    btn.setAttribute('data-whatever', `${articleTitle}`);
    btn.textContent = 'Описание';
    return btn;
  };

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
    const butn = createButton(obj.title);
    butn.addEventListener('click', () => {
      document.getElementById('modalTitle').textContent = obj.title;
      document.getElementById('modalBody').textContent = obj.description ===
        '' ? 'Описание отсутствует' : obj.description;
    });
    divEl.append(butn);
    const brTag = document.createElement('br');
    divEl.append(brTag);
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
