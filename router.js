const Lorem = require("./lorem.js");
const renderer = require("./renderer.js");
const url = require('url');
const querystring = require('querystring')

exports.home = (req, res) => {
  if (req.url === '/') {
    if (req.method.toLowerCase() === 'get') {
      res.statusCode = 200;
      renderer.renderHtml('header', {}, res);
      renderer.renderHtml('input', {}, res);
      renderer.renderHtml('footer', {}, res);
      res.end();
    } else if (req.method.toLowerCase() === 'post') {
      req.on('data', (queStr) => {
        const reqObj = querystring.parse(queStr.toString());
        res.writeHead(303, { 'Location': `/?selected=${reqObj.selected}&number=${reqObj.number}` })
        res.end();
      })
    }
  }
};

const onSuccess = (ipsum, res) => {
  const data = {ipsum}
  res.statusCode = 200;
  renderer.renderHtml('header', {}, res);
  renderer.renderHtml('ipsum', data, res);
  renderer.renderHtml('footer', {}, res);
  res.end();
}

const onError = (res) => {
  res.statusCode = 200;
  renderer.renderHtml('header', {}, res);
  renderer.renderHtml('error', {}, res);
  renderer.renderHtml('input', {}, res);
  renderer.renderHtml('footer', {}, res);
  res.end();
}

exports.ipsum = (req, res) => {
  const query = url.parse(req.url, true).query;
  JSON.stringify(query)
  if (query.number) {
    if (query.selected === 'sentences') {
      const ipsum = new Lorem(undefined, query.number);
      ipsum.on("end", (newIpsum) => onSuccess(newIpsum[0].split('.'), res))
      ipsum.on("error", () => onError(res))
    } else if (query.selected === 'paras') {
      const ipsum = new Lorem(query.number);
      ipsum.on("end", (newIpsum) => onSuccess(newIpsum, res))
      ipsum.on("error", () => onError(res))
    } else if (query.selected === 'words') {
      const ipsum = new Lorem(undefined, query.number);
      ipsum.on("end", (newIpsum) => {
        var string = newIpsum[0].split('.').join('').split(' ');
        let trimmedString = '';
        for (let index = 0; index < query.number; index++) {
          trimmedString += `${string[index]} `
        }
        newIpsum = [trimmedString]
        return onSuccess(newIpsum, res)
      })
      ipsum.on("error", () => onError(res))
    }
  }
};
