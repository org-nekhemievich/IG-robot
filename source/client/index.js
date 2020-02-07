const ig = require('./like-feed');

(async () => {
  await ig.initialize();
  await ig.login('username', 'password');
  await ig.curtirFotos(['encantoscamor']);
})()
