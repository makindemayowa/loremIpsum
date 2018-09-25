//create web server
const http = require('http');
const router = require('./router');

const port = 3000;

const server = http.createServer((req, res) => {
  router.home(req, res);
  router.ipsum(req, res);
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
