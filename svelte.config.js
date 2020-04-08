const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  // emits CSS as "files" for other plugins to process
  emitCss: true,
  // we'll extract any component CSS out into
  // a separate file  better for performance
  css: (css) => {
    css.write("public/build/bundle.css");
  },
  preprocess: sveltePreprocess(),
};
