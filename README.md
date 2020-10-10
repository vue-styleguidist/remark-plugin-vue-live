# remark-plugin-vue-live

[![Build Status](https://travis-ci.com/vue-styleguidist/remark-plugin-vue-live.svg?branch=main)](https://travis-ci.com/vue-styleguidist/remark-plugin-vue-live)
[![](https://img.shields.io/npm/v/remark-plugin-vue-live.svg)](https://www.npmjs.com/package/remark-plugin-vue-live) [![](https://img.shields.io/npm/dw/remark-plugin-vue-live.svg)](https://www.npmjs.com/package/remark-plugin-vue-live)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A remark plugin make markdown example plugin.

## Usage Example

```js
const remark = require("remark");
const plugin = require("remark-plugin-vue-live");

remark()
  .use(plugin, { liveFilter: (lang) => /pizza/.test(lang) })
  .process(
    `
\`\`\`pizza
<comp/>
\`\`\`
    `,
    (err, file) => {
      console.log(file);
    }
  );
```
