const path = require('path');
const fs = require('fs');

module.exports = function (pathName, dts) {
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
