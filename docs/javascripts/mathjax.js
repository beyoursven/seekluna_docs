window.MathJax = {
  loader: {
    load: ['[tex]/color'],
    load: ['[tex]/ams'],
    load: ['[tex]/mathtools']
  },
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    packages: { '[+]': ['color'] },
    packages: { '[+]': ['ams'] },
    packages: { '[+]': ['mathtools'] }
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {
  MathJax.startup.output.clearCache()
  MathJax.typesetClear()
  MathJax.texReset()
  MathJax.typesetPromise()
})