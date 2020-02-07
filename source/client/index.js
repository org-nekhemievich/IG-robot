const ig = require('./like-feed');

(async () => {
  await ig.initialize();
  await ig.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  await ig.like([process.env.IG_TAG]);
})()

// IG_TYPE=profile or tag
// IG_TYPE=tag IG_USERNAME=username IG_PASSWORD=password IG_TAG=javascript node ./source/client
