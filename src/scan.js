const path = require('path');
const fs = require('fs');

// ./Button-Next => ./ButtonNext
const componentNameFormat = (str) => {
  return str.split('-').map(subStr => upperCaseFirstChar(subStr)).join('')
}

// ./button-next => ./Button-next
const upperCaseFirstChar = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = function (pathName, dts, options) {
  const componentsPath = path.resolve('dist', pathName);
  const defaultOptions = {componentNameFormat: true}
  options = Object.assign({}, defaultOptions, options)

  if (fs.existsSync(componentsPath)) {
    fs
      .readdirSync(componentsPath)

      .map(name => [name, path.resolve(componentsPath, name)])

      .filter(([, absolutePath]) =>
        fs.lstatSync(absolutePath).isDirectory() && fs.readdirSync(absolutePath).includes('index.js')
      )

      .map(([name, absolutePath]) => {
        const componentPath = path.relative('./', absolutePath);
        name = options.componentNameFormat ? componentNameFormat(name) : name

        let files = [
          {path: `./${name}.js`, source: `module.exports = require('./${componentPath}');\n`},
        ];

        if (dts) {
          const declarationFile = {path: `./${name}.d.ts`, source: `export * from './${componentPath}';\n`};
          files.push(declarationFile);
        };
        console.log(files)
        return files;
      })

      .map(files => files.forEach(({path, source}) => {
        fs.writeFileSync(path, source);
      }));
  }
};