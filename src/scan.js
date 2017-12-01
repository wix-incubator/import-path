const path = require('path');
const fs = require('fs');

module.exports = function (pathName) {
  const componentsPath = path.resolve('dist', pathName);

  if (fs.existsSync(componentsPath)) {
    fs
      .readdirSync(componentsPath)

      .map(name => [name, path.resolve(componentsPath, name)])

      .filter(([, absolutePath]) =>
        fs.lstatSync(absolutePath).isDirectory() && fs.readdirSync(absolutePath).includes('index.js')
      )

      .map(([name, absolutePath]) => {
        const componentPath = path.relative('./', absolutePath);

        return [
          `./${name}.js`,
          `module.exports = require('./${componentPath}');\n`
        ];
      })

      .map(([path, source]) =>
        fs.writeFileSync(path, source));
  }
};
