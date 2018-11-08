const path = require('path');
const fs = require('fs');

// ./button-next => ./Button-next
const upperCaseFirstChar = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ./Button-Next => ./ButtonNext
const formatToPascalCase = str => {
  return str.split('-').map(subStr => upperCaseFirstChar(subStr)).join('');
};

module.exports = function (pathName, dts, options) {
  const componentsPath = path.resolve('dist', pathName);
  options.forcePascalCaseFormat = options.forcePascalCaseFormat || false;

  if (fs.existsSync(componentsPath)) {
    fs
      .readdirSync(componentsPath)

      .map(name => [name, path.resolve(componentsPath, name)])

      .filter(([, absolutePath]) =>
        fs.lstatSync(absolutePath).isDirectory() && fs.readdirSync(absolutePath).includes('index.js')
      )

      .map(([name, absolutePath]) => {
        const componentPath = path.relative('./', absolutePath);
        name = options.forcePascalCaseFormat ? formatToPascalCase(name) : name;

        const files = [
          {path: `./${name}.js`, source: `module.exports = require('./${componentPath}');\n`},
        ];

        if (dts) {
          const declarationFile = {path: `./${name}.d.ts`, source: `export * from './${componentPath}';\n`};
          files.push(declarationFile);
        }
        return files;
      })

      .map(files => files.forEach(({path, source}) => {
        fs.writeFileSync(path, source);
      }));
  }
};
