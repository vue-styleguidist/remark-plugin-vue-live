const visit = require("unist-util-visit");
const { parseComponent } = require("vue-template-compiler");
const { isCodeVueSfc } = require("vue-inbrowser-compiler-utils");
const getImports = require("./getImports");

module.exports = function attacher({ liveFilter } = {}) {
  return (ast) => visit(ast, "code", visitor);

  function visitor(node) {
    let { lang, meta } = node;

    if (
      liveFilter
        ? !liveFilter(lang, meta)
        : !/live$/.test(meta) && !/live /.test(meta)
    ) {
      return;
    }

    const getScript = (code) => {
      // script is at the beginning of a line after a return
      // In case we are loading a vue component as an example, extract script tag
      if (isCodeVueSfc(code)) {
        const parts = parseComponent(code);
        return parts && parts.script ? parts.script.content : "";
      }

      //else it could be the weird almost jsx of vue-styleguidist
      return code.split(/\n[\t ]*</)[0];
    };

    const code = node.value;

    // analyze code to find requires
    // put all requires into a "requires" object
    // add this as a prop
    const scr = getScript(code);

    const requires = getImports(scr).map(
      (mod) => `'${mod}': require('${mod}')`
    );

    const codeClean = code
      .replace(/\`/g, "\\`")
      .replace(/\$/g, "\\$")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const editorPropsArray = /\{.+\}/.exec(meta);
    const editorProps = editorPropsArray ? editorPropsArray[0] : undefined;
    const metaArray = meta ? meta.replace(editorProps, "").split(" ") : [];
    const jsx = metaArray.length > 2 && metaArray[1] === "jsx" ? "jsx " : ""; // to enable jsx, we want ```vue jsx live or ```jsx jsx live
    const markdownGenerated = `<vue-live ${jsx}
      :layout-props="{lang:'${lang}'}"${
      requires.length
        ? `
      :requires="{${requires.join(",")}}"`
        : ""
    }
      :code="\`${codeClean}\`" ${
      editorProps
        ? `
      :editor-props="${editorProps
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}"`
        : ""
    } ></vue-live>`;

    node.type = "html";
    node.value = markdownGenerated;
  }
};
