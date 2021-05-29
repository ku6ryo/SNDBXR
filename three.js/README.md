This is the SNDBXR three.js player. The build is deployed to the server. (not automatically but copying manually for now.)

# Development
Run and localhost:7000 can be accessible on browser.
```
yarn
yarn start
```

Open developer tool or similar too on your browser. Run the following code with your WASM file URL.
```
window.connector.requestLoad([WASM_URL])
```
