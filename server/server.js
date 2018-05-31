let ex = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
// https://stackoverflow.com/questions/16088824/serve-static-files-and-app-get-conflict-using-express-js

const port = 3666;
const server = ex();
console.log('__dirname is', __dirname);
server.use(ex.static(__dirname + '/../public'));
server.listen(port).on('error', (err) => console.log('error', err));
console.log('successfully started server on port ', port);