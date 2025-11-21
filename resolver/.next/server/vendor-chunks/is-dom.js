/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-dom";
exports.ids = ["vendor-chunks/is-dom"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-dom/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-dom/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var isObject = __webpack_require__(/*! is-object */ \"(ssr)/./node_modules/is-object/index.js\")\nvar isWindow = __webpack_require__(/*! is-window */ \"(ssr)/./node_modules/is-window/index.js\")\n\nfunction isNode (val) {\n  if (!isObject(val) || !isWindow(window) || typeof window.Node !== 'function') {\n    return false\n  }\n\n  return typeof val.nodeType === 'number' &&\n    typeof val.nodeName === 'string'\n}\n\nmodule.exports = isNode\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtZG9tL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBLGVBQWUsbUJBQU8sQ0FBQywwREFBVztBQUNsQyxlQUFlLG1CQUFPLENBQUMsMERBQVc7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3h4ZGstZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9pcy1kb20vaW5kZXguanM/NjJkZSJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCdpcy1vYmplY3QnKVxudmFyIGlzV2luZG93ID0gcmVxdWlyZSgnaXMtd2luZG93JylcblxuZnVuY3Rpb24gaXNOb2RlICh2YWwpIHtcbiAgaWYgKCFpc09iamVjdCh2YWwpIHx8ICFpc1dpbmRvdyh3aW5kb3cpIHx8IHR5cGVvZiB3aW5kb3cuTm9kZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWwubm9kZVR5cGUgPT09ICdudW1iZXInICYmXG4gICAgdHlwZW9mIHZhbC5ub2RlTmFtZSA9PT0gJ3N0cmluZydcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05vZGVcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-dom/index.js\n");

/***/ })

};
;