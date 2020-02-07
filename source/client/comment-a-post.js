class CommentAPost {
  constructor(props) {
    if (!props.getBody || !props.getLinks) return false;

    this.start = props.start;
    this.count = props.count;
    this.interval = props.interval;

    this.getBody = props.getBody;
    this.getLinks = props.getLinks;
    this.getModal = props.getModal;
    this.getLikeButton = props.getLikeButton;
    this.getLikeButtonText = props.getLikeButtonText;
    this.getCloseButton = props.getCloseButton;
    this.placeholder = props.placeholder;

    this.init();
  }

  init() {
    this.getBody().scrollTop = 0;
    this.setNewTimeout();
  }

  setNewTimeout(index) {
    let idx = index | this.start;
    return setTimeout(() => {
      console.log(`Item #${idx}...`)

      const link = this.getLinks()[idx];
      if(link) {
        this.like(link, idx);
        idx += this.count;
      }

      this.setNewTimeout(idx);
    }, this.getTimeout() * 1.5);
  }

  getSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  getShortTimeout() {
    return Math.floor((Math.random() * 1000));
  }

  getTimeout() {
    return (this.getSign() * Math.floor((Math.random() * 1000))) + this.interval;
  }

  scrollToBottom() {
    window.scrollTo({ top: this.getBody().scrollHeight });
  }

  handleClosePost(){
    this.getCloseButton().click();
  }

  like(link, idx) {
    if (!link || typeof link === 'undefined') {
      console.log('Scrolling to bottom...');
      this.scrollToBottom();
      return false;
    }

    link.click();

    setTimeout(() => {
      const modal = this.getModal();
      const likeButton = this.getLikeButton(modal).querySelector('textarea');

      if(likeButton) {
        if (this.getLikeButtonText(likeButton) === this.placeholder) {
          const keyEvent = new KeyboardEvent("keydown", {
              bubbles : true,
              cancelable : true,
              char : "Tab",
              key : "Tab",
              shiftKey : true,
              keyCode : 9
          });
          document.dispatchEvent(keyEvent);
          likeButton.value = 'Muito Legal!! Parabéns';
          this.getLikeButton(modal).querySelector('button').click();
          console.log(`%c ✔ Liked #${idx}!`, 'color: #00c853');
          return setTimeout(() => this.handleClosePost(), this.getShortTimeout());
        }

        console.log(`%c 𝗫 Skipped ${idx}`, 'color: #d50000');
      }

      setTimeout(() => this.handleClosePost(), this.getShortTimeout());
    }, this.getTimeout());

    return link;
  }

}

new CommentAPost({
  getBody: () => document.getElementsByTagName('body')[0],
  getLinks: () => document.querySelectorAll('article')[0].querySelectorAll('a'),
  getModal: () => document.querySelectorAll('article')[1],
  getLikeButton: modal => modal.querySelector('form'),
  getLikeButtonText: likeButton => likeButton.getAttribute('aria-label'),
  getCloseButton: () => document.querySelectorAll('button')[document.querySelectorAll('button').length-1],
  placeholder: 'Adicione um comentário...',
  start: 0,
  count: 1,
  interval: 3000
});
