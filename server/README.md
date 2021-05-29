This is the server containing remote script compiling, script editor and playground for Unity WebGL and three.js
This server is deployed to `https://sndbxr.org`.

# Key URLs
- /artifacts : Stores scripts written by users and WASM artifacts .wasm and .wat.
- /playground/unity/ : Unity playground
- /playground/three/ : three.js playground
- /compile : Entrypoint to compile SNDBXR scripts. POST (text/plain) is accepted.

# Development
Please install [yarn](https://yarnpkg.com/) as you like. (`npm install -g yarn` might be easiest)

## Start server locally
To start the server locally, please run the following commands.
```
yarn
yarn dev
```

## Updating SNDBXR wasm api module
After changing API codes, you should run `yarn upgrade` in this directory and restart the server to provide new APIs to the compiler.