This is a repository to develop the SNDBXR scripting API set.

# Policy
Please do not implement engine specific APIs (e.g. APIs only work for Unity).
We are thiking how to implement engine specific APIs as extensions.

# Directory structure
- assembly : API codes
- src : test codes

# Test
```
node build_wasm.js
yarn test
```