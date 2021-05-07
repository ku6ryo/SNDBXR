const assert = require("assert");
const myModule = require("..");
myModule.main()

let i = 0
const interval = setInterval(() => {
  if (i === 2) {
     myModule.onEvent(10, 0)
  }
  if (i > 3) {
    clearInterval(interval)
  }
  myModule.check()
  i ++
}, 1000)
console.log("ok");
