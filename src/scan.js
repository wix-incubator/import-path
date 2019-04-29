const path = require('path');
const fs = require('fs');
const {tsquery} = require('@phenomnomnominal/tsquery');

// ./button-next => ./Button-next
const upperCaseFirstChar = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ./Button-Next => ./ButtonNext
const formatToPascalCase = str => {
  return str.split('-').map(subStr => upperCaseFirstChar(subStr)).join('');
};

const getDtsFilePath = componentPath =>
  path.join(componentPath, 'index.d.ts');

const hasDtsFile = componentPath =>
  fs.existsSync(getDtsFilePath(componentPath));

const hasDefaultExport = componentPath => tsquery(
  tsquery.ast(fs.readFileSync(
    getDtsFilePath(componentPath)
  ).toString()),
  'DefaultKeyword',
  {visitAllChildren: true}
).length > 0;

module.exports = function (pathName, dts, options = {}) {
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
          if (hasDtsFile(componentPath) &&
            hasDefaultExport(componentPath)) {
            files.push({
              path: `./${name}.d.ts`,
              source: [`export * from './${componentPath}';`,
                `import defaultExport from './${componentPath}';`,
                `export default defaultExport`].join('\n')
            });
          } else {
            files.push({path: `./${name}.d.ts`, source: `export * from './${componentPath}';\n`});
          }
        }
        return files;
      })

      .map(files => files.forEach(({path, source}) => {
        fs.writeFileSync(path, source);
      }));
  }
};
