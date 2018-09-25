const fs = require('fs');

const replaceMock = (fileContents, data) => {
  for (let keys in data) {
    let elementArr = '';
    for (let index = 0; index < data[keys].length; index++) {
      elementArr += `<div class="responseHtml">${data[keys][index]}</div>`
    }
    fileContents = fileContents.replace(`{{${keys}}}`, elementArr)
  }
  return fileContents
}

exports.renderHtml = (templateName, data, response) => {
  let fileContents = fs.readFileSync(`./${templateName}.html`, { encoding: 'utf8' });
  fileContents = replaceMock(fileContents, data);
  response.write(fileContents);
}