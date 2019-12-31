# manablox-cli


## Zero configuration webpack runner

With manablox-cli you can run any ES20xx js file from anywhere. This is heavily inspired by [backpack](https://github.com/jaredpalmer/backpack).


## Installation

run ```npm install -g manablox-cli```


## How to use

Get into the folder, where your javascript lives, and get started by typing ```manablox dev myfile.js```
This will start a development instance of your code.


## Other starting options


### Usage: manablox [options] [command]

```
zero config webpack runner

Options:
  -v,--version            output the version number
  -h, --help              output usage information

Commands:
  build [options] [file]  Build a production package
  dev [file]              start a development server

```


### Usage: manablox build [options] [file]

```
Build a production package

Options:
  -r, --run         start build after compiling
  -o, --run-only    only start a ready built package
  -s, --as-service  run the package with nodemon
  -h, --help        output usage information
```


### Usage: manablox dev [options] [file]

```
start a development server

Options:
  -h, --help  output usage information
```



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
