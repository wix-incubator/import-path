const path = require('path');
const fs = require('fs');

//  ./button-next => ./ButtonNext
const camelize = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '').replace('-','');
}

module.exports = function (pathName, dts, camelizePath = false) {
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

        let files = [
          {path: `./${name}.js`, source: `module.exports = require('./${componentPath}');\n`},
        ];

        if (dts) {
          const declarationFile = {path: `./${name}.d.ts`, source: `export * from './${componentPath}';\n`};
          files.push(declarationFile);
        };

        if (camelizePath){
          files = files.map((file) => {
            file.path = camelize(file.path);
            return file;
          });
        };

        return files;
      })

      .map(files => files.forEach(({path, source}) => {
        fs.writeFileSync(path, source);
      }));
  }
};