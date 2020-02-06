(function() {
  const count = 1;
  const interval = 3000;
  const selector = document.querySelectorAll('article')[0].querySelectorAll('a');
  const start = 0;

  const toArray = selector => {
    elems = selector;
    ret_elems = [];
    for (var i in elems) {
      if (elems[i].nodeType == 1) { // means nodeType = ELEMENT_NODE
        ret_elems.push(elems[i]);
      }
    }
    return ret_elems;
  }

  const getBody = () => document.getElementsByTagName('body')[0];
  const getButtons = () => toArray(selector);
  const getCloseBtn = () => document.querySelectorAll('button')[document.querySelectorAll('button').length-1];
  const getSign = () => Math.random() < 0.5 ? -1 : 1;
  const getShortTimeout = () => Math.floor((Math.random() * 1000));
  const getTimeout = () => (getSign() * Math.floor((Math.random() * 1000))) + interval;
  const scrollToBottom = () => window.scrollTo({ top: getBody().scrollHeight });
  const closePost = () => getCloseBtn().click();

  function like(els, idx) {
    if (!els || typeof els === 'undefined' || els.length < 1)
      throw new Error('Ran out of posts.')

    return els.map(el => {
      el.click();
      setTimeout(() => {
        let article = document.querySelectorAll('article')[1]
        let btn = article.children[2].firstChild.firstChild.firstChild
        if (btn.classList.contains('coreSpriteLikeHeartFull')) {
          console.log(`%c 𝗫 Skipped ${idx}`, 'color: #D50000')
          return setTimeout(() => closePost(), getShortTimeout())
        }
        btn.click()
        console.log(`%c ✔ Liked #${idx}!`, 'color: #00C853')
        setTimeout(() => closePost(), getShortTimeout())
      }, getTimeout())
    })
  }

  function main() {
    getBody().scrollTop = 0;

    let idx = start
    const setNewTimeout = () => setTimeout(() => {
      console.log(`Modal #${idx}...`)
      like(toArray(selector).slice(idx, idx + count), idx)
      idx += count
      setNewTimeout();
    }, getTimeout()*1.5)

    setNewTimeout()
  }

  main();
})()
