const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  app.locals.assetPath = function (filePath) {
    if (env.name == 'development') {
      return filePath;
    }

    // environment is "production"
    // we need to parse the json file from '../public/assets/rev-manifest.json'
    // and fetch the filePath (key) from that json file (object)
    // then finally, return that filePath.
    return (
      '/' +
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '../public/assets/rev-manifest.json')
        )
      )[filePath]
    );
  };
};
