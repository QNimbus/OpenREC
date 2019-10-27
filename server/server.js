// Global imports
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const fs = require('fs');

// Local imports
const connectDB = require('../config/db');
const pkg = require('../package.json');

// Initialize globals and constants
const app = express();
const start = Date.now();
const protocol = process.env.PROTOCOL || 'http';
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';
let server;

// Connect to the database
connectDB().then(msg => {
  console.log(chalk.blue(`[%s] ${msg}`), pkg.name);
});

// Initialize middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Create 'version' API route
app.get('/version', function(req, res) {
  res.json({
    version: pkg.version
  });
});

// Define API routes
app.use('/api/events', require('./routes/api/events'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/eventlogs', require('./routes/api/eventlogs'));
app.use('/api/filters', require('./routes/api/filters'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/jobs', require('./routes/api/jobs'));
app.use('/api/status', require('./routes/api/status'));

if (protocol === 'https') {
  const { execSync } = require('child_process');
  const execOptions = { encoding: 'utf-8', windowsHide: true };
  let key = './certs/key.pem';
  let certificate = './certs/certificate.pem';

  if (!fs.existsSync(key) || !fs.existsSync(certificate)) {
    try {
      if (!fs.existsSync('certs')) {
        fs.mkdirSync('certs');
      }
      execSync('openssl version', execOptions);
      execSync(
        `openssl req -x509 -newkey rsa:2048 -keyout ./certs/key.tmp.pem -out ${certificate} -days 365 -nodes -subj '/C=US/ST=Foo/L=Bar/O=Baz/CN=localhost'`,
        execOptions
      );
      execSync(`openssl rsa -in ./certs/key.tmp.pem -out ${key}`, execOptions);
      execSync('rm ./certs/key.tmp.pem', execOptions);
    } catch (error) {
      console.error(error);
    }
  }

  const options = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(certificate),
    passphrase: 'password'
  };

  server = require('https').createServer(options, app);
} else {
  server = require('http').createServer(app);
}

server.listen({ host, port }, () => {
  console.log(chalk.blue('[%s] Booted in %dms - %s://%s:%s'), pkg.name, Date.now() - start, protocol, host, port);
});
