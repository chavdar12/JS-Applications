# JS Applications

Solutions for the SoftUni **JS Applications** course (2021 edition): async programming, REST & auth,
SPAs, architecture & testing, client-side rendering (lit-html) and routing (page.js).

## Tests

```sh
npm install
npm test          # node --test, jsdom, fetch is mocked - no server needed
```

Every program has a `*.test.mjs` next to it. Shared helpers live in `test-utils/dom.mjs`.

## Running an app

1. Start the practice REST server from the module's `server/` folder:

   ```sh
   cd 004-Exercise-Remote-Data-And-Authentication/server
   node ../../server.cjs     # http://localhost:3030
   ```

2. Serve the program folder, e.g. `npx http-server -c-1` and open the page.
   Programs with a `package.json` (lit-html / page.js) need `npm install` in that folder first;
   the routed apps (SoftTerest, Cookbook, Furniture) are started with `npm start` for SPA fallback.
