const remark = require("remark");
const plugin = require("./index.js");

test("transform fenced into vue-live with live flag", () => {
  remark()
    .use(plugin)
    .process(
      `
\`\`\`vue live
<comp/>
\`\`\`
`,
      (err, file) => {
        if (err) {
          throw err;
        }
        expect(String(file)).toMatchInlineSnapshot(`
          "<vue-live 
                :layout-props=\\"{lang:'vue'}\\"
                :code=\\"\`&lt;comp/&gt;\`\\"  ></vue-live>
          "
        `);
      }
    );
});

test("avoid transform fenced into vue-live", () => {
  remark()
    .use(plugin)
    .process(
      `
\`\`\`vue
<comp/>
\`\`\`
  `,
      (err, file) => {
        if (err) {
          throw err;
        }
        expect(String(file)).toMatchInlineSnapshot(`
          "\`\`\`vue
          <comp/>
          \`\`\`
          "
        `);
      }
    );
});

test("transform custom fenced into vue-live", () => {
  remark()
    .use(plugin, { liveFilter: (lang) => /pizza/.test(lang) })
    .process(
      `
\`\`\`pizza
<comp/>
\`\`\`
    `,
      (err, file) => {
        if (err) {
          throw err;
        }
        expect(String(file)).toMatchInlineSnapshot(`
          "<vue-live 
                :layout-props=\\"{lang:'pizza'}\\"
                :code=\\"\`&lt;comp/&gt;\`\\"  ></vue-live>
          "
        `);
      }
    );
});

test("transform require and import statements", () => {
  remark()
    .use(plugin)
    .process(
      `
\`\`\`js live
import b from 'test/import'
const a = require('test/req')
<comp/>
\`\`\`
      `,
      (err, file) => {
        if (err) {
          throw err;
        }
        expect(String(file)).toMatchInlineSnapshot(`
          "<vue-live 
                :layout-props=\\"{lang:'js'}\\"
                :requires=\\"{'test/import': require('test/import'),'test/req': require('test/req')}\\"
                :code=\\"\`import b from 'test/import'
          const a = require('test/req')
          &lt;comp/&gt;\`\\"  ></vue-live>
          "
        `);
      }
    );
});

test("transform require and import statements", () => {
  remark()
    .use(plugin)
    .process(
      `
  \`\`\`js live {"lineNumbers": true}
  <comp/>
  \`\`\`
        `,
      (err, file) => {
        if (err) {
          throw err;
        }
        expect(String(file)).toMatchInlineSnapshot(`
          "<vue-live 
                :layout-props=\\"{lang:'js'}\\"
                :code=\\"\`&lt;comp/&gt;\`\\" 
                :editor-props=\\"{&quot;lineNumbers&quot;: true}\\" ></vue-live>
          "
        `);
      }
    );
});
