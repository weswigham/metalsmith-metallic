
# metalsmith-excerpt

  A Metalsmith plugin to add an excerpt from files.

## Installation

    $ npm install metalsmith-excerpt

## CLI Usage

  Install via npm and then add the `metalsmith-excerpt` key to your `metalsmith.json` plugin, like so:

```json
{
  "plugins": {
    "metalsmith-excerpt": true
  } 
}
```

## Javascript Usage

```js
var excerpt = require('metalsmith-excerpt');

metalsmith.use(excerpt());
```

## License

  MIT