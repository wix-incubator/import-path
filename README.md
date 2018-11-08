# import-path

## Intro
This package helps creating a nicer API for your require paths.

If for example your `dist` folder is being published in your packge, usually users will try to require it by using the full path:

```javascript
import {importantFunction} from 'my-package/dist/src/importantFunction';
```

This is where this package comes in to play, as it allows you to have:

```javascript
import {importantFunction} from 'my-package/importantFunction';
```

## Usage

Install the package

```
npm i --save-dev import-path
```

Add the following to your build command in the `package.json`:

```javasript
 "scripts": {
    "build": "haste build && import-path --path <desired-path>",
    ...
```
Note that [haste](https://github.com/wix/haste) is the build tool which is being used in this example, but ofcourse it is not mandatory.

`<desiredPath>` is the path you wish to change the require from. For example:

```
import-path --path src/importantFunction
```

Will allow users to do:
```javascript
import {importantFunction} from 'my-package/importantFunction';
```

If you wish your require path (entry point) name format to be pascal cased, like seen here :

```javascript
import {importantFunction} from 'my-package/dist/src/ImportantFunction';
```

pass to the importPath function, a third aregumes : `{componentNameFormat: true}` (defaulted as false).


Typescript definitions can also be generated using the `--dts` option:

```javasript
 import-path --path <desired-path> --dts",
```

or, you can choose to  pass as a second boolean argument to the importPath function

```javasript
 importPath('src/components', true);
```

This will create a `.d.ts` for every generated `.js` file.
Note that the .d.ts files only support named exports and do not support `export default...` and `exports = ...`.

On every build we scan for all the files under 'my-package/dist/src/importantFunction' which contain `index.js` file inside of them, and for each file we create the following file under the root dir:

```js
// importantFunction.js

module.exports = require('./dist/src/importantFunction');
```

There is no need to push them to Github, so add this to the `.gitignore` file:

```
/*.js
/*.d.ts // if you use the dts option
!wallaby.js
!protractor.conf.js
```

If you have more `*.js` files under the root dir that you don't want to ignore, add them with prefix `!`.

The last thing you need to do is to publish all of the new generated files:

```javascript
// package.json

"files": [
    "dist",
    "*.js",
    '*.d.ts', // if you use the dts option
    "!wallaby.js",
    "!protractor.conf.js"
  ],
```

You can use `npm pack` to see what are you going to publish to the npm registry.
