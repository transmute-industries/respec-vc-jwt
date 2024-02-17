/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   processExample: () => (/* binding */ processExample)\n/* harmony export */ });\n/* harmony import */ var _src_getHtml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/getHtml */ \"./src/getHtml.js\");\n\n\n\nasync function processVcJoseCose() {\n    // add styling for examples\n    addVcJoseStyles();\n\n    const examples = Array.from(document.querySelectorAll(\".vc-jose-cose\")).filter((e) => !!e.innerText)\n    for (const index in examples) {\n        const example = examples[index]\n        const alg = 'ES384'\n        const json = JSON.parse(example.innerText.replace(/\\/\\/ .*$/gm, ''))\n        const processedData = await processExample(index, alg, json);\n        example.outerHTML = processedData.html\n    }\n}\n\nfunction addVcJoseStyles() {\n    const styles = document.createElement('style');\n\n    styles.innerHTML += `\n    .vc-jose-cose-tabbed {\n    overflow-x: hidden;\n    margin: 0 0;\n  }\n  \n  .vc-jose-cose-tabbed [type=\"radio\"] {\n    display: none;\n  }\n  \n  .vc-jose-cose-tabs {\n    display: flex;\n    align-items: stretch;\n    list-style: none;\n    padding: 0;\n    border-bottom: 1px solid #ccc;\n  }\n  \n  li.vc-jose-cose-tab {\n    margin: unset;\n    margin-left: 8px;\n  }\n  \n  .vc-jose-cose-tab>label {\n    display: block;\n    margin-bottom: -1px;\n    padding: .4em .5em;\n    border: 1px solid #ccc;\n    border-top-right-radius: .4em;\n    border-top-left-radius: .4em;\n    background: #eee;\n    color: #666;\n    cursor: pointer;\n    transition: all 0.3s;\n  }\n  \n  .vc-jose-cose-tab:hover label {\n    border-left-color: #333;\n    border-top-color: #333;\n    border-right-color: #333;\n    color: #333;\n  }\n  \n  .vc-jose-cose-tab-content {\n    display: none;\n  }\n  \n  .vc-jose-cose-tabbed [type=\"radio\"]:nth-of-type(1):checked~.vc-jose-cose-tabs .vc-jose-cose-tab:nth-of-type(1) label,\n  .vc-jose-cose-tabbed [type=\"radio\"]:nth-of-type(2):checked~.vc-jose-cose-tabs .vc-jose-cose-tab:nth-of-type(2) label,\n  .vc-jose-cose-tabbed [type=\"radio\"]:nth-of-type(3):checked~.vc-jose-cose-tabs .vc-jose-cose-tab:nth-of-type(3) label {\n    border-bottom-color: #fff;\n    background: #fff;\n    color: #222;\n  }\n  \n  .vc-jose-cose-tabbed [type=\"radio\"]:nth-of-type(1):checked~.vc-jose-cose-tab-content:nth-of-type(1),\n  .vc-jose-cose-tabbed [type=\"radio\"]:nth-of-type(2):checked~.vc-jose-cose-tab-content:nth-of-type(2),\n  .vc-jose-cose-tabbed [type=\"radio\"]:nth-of-type(3):checked~.vc-jose-cose-tab-content:nth-of-type(3) {\n    display: block;\n  }\n  \n  .sd-jwt-header {\n    color: red\n  }\n  .sd-jwt-payload {\n    color: green\n  }\n  \n  .sd-jwt-payload-verified{\n    color: purple\n  }\n  \n  .sd-jwt-signature {\n    color: blue\n  }\n  \n  .sd-jwt-disclosure {\n    color: purple\n  }\n  \n  .sd-jwt-compact {\n    background-color: rgba(0,0,0,.03);\n  }`;\n\n    document.head.appendChild(styles);\n}\n\nasync function processExample(index, alg, json) {\n    // const credentialMetadata = await getExampleMetadata({alg, json});\n    // const claims = generateIssuerClaims(json);\n    // const disclosure = generateHolderDisclosure(json);\n    // const {vc, vp, verified} = await issueAndVerifyWithSdJWt({\n    //     ...credentialMetadata,\n    //     claims: SD.YAML.load(claims),\n    //     disclosure: SD.YAML.load(disclosure)\n    // });\n    const html = (0,_src_getHtml__WEBPACK_IMPORTED_MODULE_0__.getHtml)({index});\n    return {html}; // Return the HTML or other data directly\n}\n\nwindow.respecVcJoseCose = {\n    processVcJoseCose\n}\n\n\n//# sourceURL=webpack://respec-vc-jose-cose/./index.js?");

/***/ }),

/***/ "./src/getHtml.js":
/*!************************!*\
  !*** ./src/getHtml.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getHtml: () => (/* binding */ getHtml)\n/* harmony export */ });\n\nconst getSdHtml = (vc) =>{\n  const [token, ...disclosure] = vc.split('~');\n  const [header, payload, signature] = token.split('.');\n  const disclosures = disclosure.map((d)=>{\n    return `~<span class=\"sd-jwt-disclosure\">${d}</span>`\n  }).join('')\n  return `\n<div class=\"sd-jwt-compact\"><span class=\"sd-jwt-header\">${header}</span>.<span class=\"sd-jwt-payload\">${payload}</span>.<span class=\"sd-jwt-signature\">${signature}</span>${disclosures}</div>`\n}\n\nconst getVerifiedHtml = (verified)=> {\nreturn `<div>\n  <pre class=\"sd-jwt-header\">\n// disclosed protected header\n${JSON.stringify(verified.protectedHeader, null, 2).trim()}</pre>\n  <pre class=\"sd-jwt-payload-verified\">\n// disclosed protected claimset\n${JSON.stringify(verified.claimset, null, 2).trim()}</pre>\n</div>\n`\n}\n\nconst getDisclosabilityHtml = (claims)=> {\n  return `<pre>\n${claims.trim().replace(/\\!sd/g, `<span class=\"sd-jwt-disclosure\">!sd</span>`)}\n  </pre>`\n  }\n\nconst getDisclosuresHtml = (disclosure)=> {\n  return `<pre>${disclosure.trim().replace(/False/g, `<span class=\"sd-jwt-disclosure\">False</span>`)}</pre>`\n  }\n\nconst getHtml = ({ index })=>{\n  // TODO: refactor\n  // const tab1Content = getDisclosabilityHtml(claims);\n  // const tab2Content = getSdHtml(vc);\n  // const tab3Content = getDisclosuresHtml(disclosure);\n  // const tab4Content = getSdHtml(vp);\n  // const tab5Content = getVerifiedHtml(verified);\n\n  // 3 tabs is the most that fits on 1 screen\n  const tab1Content = 'tab1Content';\n  const tab2Content  = 'tab2Content';\n  const tab3Content  = 'tab3Content';\n  // const tab4Content  = 'tab4Content';\n  // const tab5Content  = 'tab5Content';\n\n  return `\n<div class=\"vc-jose-cose-tabbed\">\n    <input type=\"radio\" id=\"vc-jose-cose-tab-${index}-cose\" name=\"vc-jose-cose-tabs-${index}\" checked=\"checked\">\n    <input type=\"radio\" id=\"vc-jose-cose-tab-${index}-jwt\" name=\"vc-jose-cose-tabs-${index}\" >\n    <input type=\"radio\" id=\"vc-jose-cose-tab-${index}-sd-jwt\" name=\"vc-jose-cose-tabs-${index}\">\n    <ul class=\"vc-jose-cose-tabs\">\n      <li class=\"vc-jose-cose-tab\">\n        <label for=\"vc-jose-cose-tab-${index}-cose\">COSE</label>\n      </li>\n      <li class=\"vc-jose-cose-tab\">\n        <label for=\"vc-jose-cose-tab-${index}-jwt\">JWT</label>\n      </li>\n      <li class=\"vc-jose-cose-tab\">\n        <label for=\"vc-jose-cose-tab-${index}-sd-jwt\">SD-JWT</label>\n      </li>\n    </ul>\n    <div class=\"vc-jose-cose-tab-content\">\n${tab1Content}\n    </div>\n    <div class=\"vc-jose-cose-tab-content\">\n${tab2Content}\n    </div>\n    <div class=\"vc-jose-cose-tab-content\">\n${tab3Content}\n    </div> \n</div>`\n}\n\n//# sourceURL=webpack://respec-vc-jose-cose/./src/getHtml.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;