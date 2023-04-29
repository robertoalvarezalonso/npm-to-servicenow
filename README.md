# npm-to-servicenow
Compile a Node.js module into a single ServiceNow-ready file.

1. Write your code in `./src/index`. 
2. Execute `npm run build` from your terminal.
3. Find your compiled code in `./dist_sn`.
4. Try your code in ServiceNow, for instance in the background script. If it works you are ready to save it as a Script Include.
5. If ServiceNow complains about any reserved word you have in your code, add it to [sanitizer.js](plugins/babel-servicenow/src/sanitizer.js) and build again.



### Example (📽️ [Video](http://www.youtube.com/watch?v=TyRbXMVzWmw))

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

![image](https://user-images.githubusercontent.com/81647176/235316685-e0e4e92a-7f86-4cff-b58b-a31736ae411a.png)


And it's ready to be used in our instance 🎉

![image](https://user-images.githubusercontent.com/81647176/235315318-3f9dc5c3-86b1-485b-a0f1-46bb66d8b6ab.png)


### Limitations
Unfortunately your code still won't work if it contains any of the following classes non supported by Rhino:
* `new Map();`
* `new Uint8Array();`

### References
This repo leverages [vercel/ncc](https://github.com/vercel/ncc) for compiling the Node.js module into a single file and a modified version of the Babel plugins and presets from [nuovolo/sincronia](https://github.com/nuvolo/sincronia)
