# manablox-cli

## Zero configuration webpack runner

With manablox-cli you can run any ES20xx js file from anywhere. This is heavily inspired by [backpack](https://github.com/jaredpalmer/backpack).

## Installation

run ```npm install -g manablox-cli```

## How to use

Create an ```index.js``` anywhere and create your modern javascript.

Then just type ```manablox``` in the same folder.

The CLI will create a build folder with your compiled index.js and an index.map file

If you want to start a file which is not named index.js, for example you want a file called ```server.js``` then just run ```manablox server.js``` to let it run

## Custom configuration

To add a new config to webpack, you can create a ```manablox.config.js``` file.

For example: 

```js
module.exports = {
    webpack: (config, options, webpack) => {
        // add a custom alias for imports
        config.resolve = {
            alias: {
                '~~': './'
            }
        }

        return config
    }
}
```
