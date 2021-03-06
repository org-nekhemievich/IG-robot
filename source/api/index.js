const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressStatusMonitor = require('express-status-monitor');

dotenv.config({ path: path.resolve(__dirname, '../../.env.example') });

const app = express();
const passportConfig = require('./config/passport');
const apiController = require('./controllers/api');

app.set('port', process.env.PORT || 3000);
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.disable('x-powered-by');

app.get('/', (req, res) => res.json({ message: 'IG Robot' }));

app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);

app.get('/auth/instagram', passport.authenticate('instagram', { scope: ['basic', 'public_content'] }));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

app.listen(app.get('port'), () => {
  console.log('%s http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
