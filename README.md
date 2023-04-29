# npm-to-servicenow
Compile a Node.js module into a single file, and ServiceNow ready.

1. Write your code in `./src/index`. 
2. Execute `npm run build` from your terminal.
3. Find your compiled code in `./dist_sn`.
4. Try your code in ServiceNow, for instance in the background script. If it works you are ready to save it as a Script Include.
5. If ServiceNow complains about any reserved word you have in your code, add it to [sanitizer.js](plugins/babel-servicenow/src/sanitizer.js) and build again.

### Limitations
`new Map();`
`new Uint8Array();`
