const makeDom = (el, array) => {
  if (!array || array.length === 0) {
    return el;
  }
  const header = el;

  const hasElt = (object) => {
    console.log('entry point');
    let result = false;
    const [...elements] = el.parentElement.children;
    elements.forEach((element) => {
      const titleIs = element.querySelector('title').firstChild.data;
      if (object.title === titleIs) {
        result = true;
      }
    });
    console.log(`4444 ${result}`);
    return result;
  };

  const addElt = (obj) => {
//    if (hasElt(obj)) {
//      return;
//    }
    const pEl = document.createElement('p');
    const keys = Object.keys(obj);
    keys.forEach((elem) => {
      const tag = document.createElement('elem');
      const text = document.createTextNode(`${obj[elem]}`);
      tag.appendChild(text);
      pEl.appendChild(tag);
    });
    el.parentElement.prepend(pEl);
    el.parentElement.prepend(header);
  };
  array.forEach(elt => addElt(elt));
  return el;
};

const render = (arr) => {
  if (arr.length === 0) {
    return new Error('Отсутствуют элементы');
  }
  const rssList = document.getElementById('rssList');
  const articleList = document.getElementById('articleList');

  const rssDom = makeDom(rssList, arr[0]);
  const articleDom = makeDom(articleList, arr[1]);

  return [rssDom, articleDom];
};

export default render;
