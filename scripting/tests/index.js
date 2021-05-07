const assert = require("assert");
const myModule = require("..");
myModule.main()

let i = 0
const interval = setInterval(() => {
  if (i === 2) {
     myModule.onEvent(1, 1000)
  }
  if (i === 3) {
    myModule.onEvent(2, 1000)
  }
  if (i === 4) {
    clearInterval(interval)
  }
  myModule.check()
  i += 1
}, 1000)
console.log("ok");
