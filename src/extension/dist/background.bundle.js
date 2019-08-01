/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension/background.js":
/*!*************************************!*\
  !*** ./src/extension/background.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var bg;\nvar snapshotArr = [];\nvar mode = {\n  persist: false,\n  locked: false,\n  paused: false\n};\nvar firstSnapshot = true; // establishing connection with devtools\n\nchrome.runtime.onConnect.addListener(function (port) {\n  bg = port; // if snapshots were saved in the snapshotArr,\n  // send it to devtools as soon as connection to devtools is made\n\n  if (snapshotArr.length > 0) {\n    bg.postMessage({\n      action: 'initialConnectSnapshots',\n      payload: {\n        snapshots: snapshotArr,\n        mode: mode\n      }\n    });\n  } // receive snapshot from devtools and send it to contentScript\n\n\n  port.onMessage.addListener(function (msg) {\n    var action = msg.action,\n        payload = msg.payload;\n\n    switch (action) {\n      case 'emptySnap':\n        snapshotArr.splice(1);\n        break;\n\n      case 'setLock':\n        mode.locked = payload;\n        break;\n\n      case 'setPause':\n        mode.paused = payload;\n        break;\n\n      case 'setPersist':\n        mode.persist = payload;\n        break;\n\n      default:\n    } // find active tab\n\n\n    chrome.tabs.query({\n      active: true,\n      currentWindow: true\n    }, function (tabs) {\n      // send message to tab\n      chrome.tabs.sendMessage(tabs[0].id, msg);\n    });\n  });\n}); // background.js recieves message from contentScript.js\n\nchrome.runtime.onMessage.addListener(function (request) {\n  var action = request.action;\n  var persist = mode.persist;\n\n  switch (action) {\n    case 'tabReload':\n      firstSnapshot = true;\n      mode.locked = false;\n      mode.paused = false;\n      if (!persist) snapshotArr = [];\n      break;\n\n    case 'recordSnap':\n      if (firstSnapshot) {\n        firstSnapshot = false; // don't add anything to snapshot storage if mode is persisting for the initial snapshot\n\n        if (!persist) snapshotArr.push(request.payload);\n        bg.postMessage({\n          action: 'initialConnectSnapshots',\n          payload: {\n            snapshots: snapshotArr,\n            mode: mode\n          }\n        });\n        break;\n      }\n\n      snapshotArr.push(request.payload); // TODO:\n      // get active tab id\n      // get snapshot arr from tab object\n      // send message to devtools\n\n      bg.postMessage({\n        action: 'sendSnapshots',\n        payload: snapshotArr\n      });\n      break;\n\n    default:\n  }\n});\n\n//# sourceURL=webpack:///./src/extension/background.js?");

/***/ })

/******/ });