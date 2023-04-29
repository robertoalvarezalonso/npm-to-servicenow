# npm-to-servicenow
Compile a Node.js module into a single ServiceNow-ready file.

1. Write your code in `./src/index`. 
2. Execute `npm run build` from your terminal.
3. Find your compiled code in `./dist_sn`.
4. Try your code in ServiceNow, for instance in the background script. If it works you are ready to save it as a Script Include.
5. If ServiceNow complains about any reserved word you have in your code, add it to [sanitizer.js](plugins/babel-servicenow/src/sanitizer.js) and build again.

### Limitations
`new Map();`
`new Uint8Array();`

### References
It leverages [vercel/ncc](https://github.com/vercel/ncc) for compiling the Node.js module into a single file and a modified version of the Babel plugins and presets of [nuovolo/sincronia](https://github.com/nuvolo/sincronia)

### Example

In this example we will use the spread operator, which is not valid in ServiceNow and we will import the [hellow-world-npm](https://www.npmjs.com/package/hello-world-npm) module, from which we will use the function `helloWorld`.
```javascript
import * as HW from 'hello-world-npm';

var Test = Class.create();
Test.prototype = {
    initialize: function () { },
    testFunc: function () {
        let arr = [1];
        gs.print([...arr, 2, 3]);
    },

    printHello: function () {
        gs.print(HW.helloWorld());
    },
    type: "Test"
}
```

Once we run the build, we will get the code ready to be used in a Script Include record in ServiceNow. For that we only have to create a new Script Include, and paste in the Script field the code we have generated.

![image](https://user-images.githubusercontent.com/81647176/235313895-bf86bb21-a378-457e-a1bb-fd0689642401.png)

And it's ready to be used in our instance 🎉

![image](https://user-images.githubusercontent.com/81647176/235313924-54bd211d-ddb0-484c-8d69-dc4e0091e58c.png)
