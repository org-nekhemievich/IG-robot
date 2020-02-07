(function(start, count, interval) {
  const selector = '.wpO6b';

  const toArray = selector => {
    elems = document.querySelectorAll(selector);
    ret_elems = [];
    for (var i in elems) {
      if (elems[i].nodeType == 1) {
        ret_elems.push(elems[i]);
      }
    }
    return ret_elems;
  }

  const _body = () => document.getElementsByTagName('body')[0];
  const _getButtons = () => toArray(selector);
  const _plusOrMinus = () => Math.random() < 0.5 ? -1 : 1;
  const _randomTimeout = () => (_plusOrMinus() * Math.floor((Math.random() * 500))) + 1500;
  const _scrollToBottom = () => window.scrollTo({ top: _body().scrollHeight });

  function _like(els, idx) {
    if (!els || typeof els === 'undefined' || els.length < 1) {
      console.log('Ran out of posts. Scrolling to bottom...')
      _scrollToBottom();
      setTimeout(() => {}, 750);
    }

    return els.map(el => {
      if (el.firstChild.getAttribute('aria-label') === 'Curtir') {
        setTimeout(() => {
          el.click()
          console.log(`CLICKED -> ${idx}`)
        }, _randomTimeout())
      } else {
        // console.log(`Skipped -> ${idx}`)
      }
    });
  }

  let idx = start
  const getInterval = () => interval + _randomTimeout()
  const setNewTimeout = () => setTimeout(() => {
    console.log(`Starting over at ${idx}!`)
    const elsArr = toArray(selector);
    _like(elsArr.slice(idx, idx+count), idx)
    idx += count
    setNewTimeout()
  }, getInterval())

  setNewTimeout()
})(0, 3, 4000)
