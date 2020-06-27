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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
// Overriding Custom Window Object Since cannot am unable to extend the default window obj
let windowObj = window;
let timeString;
let currentUrl;
let milisec = 0;
let sec = 0; /* holds incrementing value */
let min = 0;
let hour = 0;
let miliSecOut = 0;
let secOut = 0;
let minOut = 0;
let hourOut = 0;
// Setting Popup dynamically
chrome.browserAction.setBadgeBackgroundColor({ color: "#5CAD62" });
chrome.tabs.onActivated.addListener(function (activeInfo) {
    const activeTabId = activeInfo.tabId;
    chrome.tabs.get(activeTabId, function (tab) {
        currentUrl = tab.url;
    });
});
// Persisting Data Stuffst
const problem = {};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request) {
        if (request.action == "setProblem") {
            problem.problemName = request.payload.problemName;
            problem.difficulty = request.payload.difficulty;
        }
        else if (request.action == "getProblem") {
            sendResponse(problem);
        }
        else if (request.action == "setTimer") {
            startStop();
        }
        else if (request.action == "getTimer") {
            sendResponse({ startstop: startstop });
        }
        else if (request.action === 'getCurrentTime') {
            sendResponse({
                miliSecOut: miliSecOut,
                hourOut: hourOut,
                secOut: secOut,
                minOut: minOut
            });
        }
    }
});
// Updating Timer Stuffs
let startstop = 0;
let x;
/* Toggle StartStop */
function startStop() {
    startstop = startstop + 1;
    let document = chrome.extension.getViews({ type: "popup" })[0].document;
    if (startstop == 1) {
        startTimer();
        document.getElementById("start").innerHTML = "Pause";
    }
    else if (startstop == 2) {
        document.getElementById("start").innerHTML = "Start";
        startstop = 0;
        stopTimer();
    }
}
// Creating my Custom Window object since Typescript doesnt allow much flexiblity
windowObj.startStop = startStop;
windowObj.resetFunc = reset;
windowObj.saveData = saveData;
//Starts the Timer
function startTimer() {
    x = setInterval(timer, 10);
}
// Stops the timer
function stopTimer() {
    clearInterval(x);
}
// Declaring Variables
// Driver for Timer
function timer() {
    let popup = chrome.extension.getViews({ type: "popup" })[0];
    let document = popup && popup.document;
    miliSecOut = checkTime(milisec);
    secOut = checkTime(sec);
    minOut = checkTime(min);
    hourOut = checkTime(hour);
    milisec = ++milisec;
    if (milisec === 100) {
        milisec = 0;
        sec = ++sec;
    }
    if (sec == 60) {
        min = ++min;
        sec = 0;
    }
    if (min == 60) {
        min = 0;
        hour = ++hour;
    }
    // Updates DOM
    /*
    When the Popup is closed background does'nt have reference to the Popup's
    document object  we no need to render when the popup is not opened
  
  
    */
    if (document) {
        document.getElementById("milisec").innerHTML = miliSecOut.toString();
        document.getElementById("sec").innerHTML = secOut.toString();
        document.getElementById("min").innerHTML = minOut.toString();
        document.getElementById("hour").innerHTML = hourOut.toString();
    }
    // Update the badge Text
    timeString = helpers_1.getTimeasString(secOut, minOut, hourOut);
    chrome.browserAction.setBadgeText({ text: timeString });
}
// Checks time to add 0 or not
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
// Resets the timer
function reset() {
    stopTimer();
    chrome.browserAction.setBadgeText({ text: "" });
    let document = chrome.extension.getViews({ type: "popup" })[0].document;
    /*Reset*/
    startstop = 0;
    document.getElementById("start").innerHTML = "Start";
    milisec = 0;
    sec = 0;
    min = 0;
    hour = 0;
    miliSecOut = 0;
    hourOut = 0;
    minOut = 0;
    secOut = 0;
    document.getElementById("milisec").innerHTML = "00";
    document.getElementById("sec").innerHTML = "00";
    document.getElementById("min").innerHTML = "00";
    document.getElementById("hour").innerHTML = "00";
}
function setData() {
    let data = JSON.parse(localStorage.getItem("leetCodeExtensionDetails"));
    let today = new Date();
    //@ts-ignore
    let dd = String(today.getDate()).padStart(2, "0");
    //@ts-ignore
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    const todayString = dd + "/" + mm + "/" + yyyy;
    const problemName = problem.problemName.split(".")[1];
    const dataMap = {
        problemName: problemName,
        difficulty: problem.difficulty,
        timeTaken: timeString,
        date: todayString,
        problemUrl: currentUrl,
    };
    let currentDiffProblemArray = data[problem.difficulty.toLowerCase()];
    let exists = currentDiffProblemArray.filter((item) => {
        return item.problemName === problemName;
    });
    let problemObj = exists[0];
    if (exists.length > 0) {
        // dataMap.problemName +=  problemObj.duplicateIndex.toString();
        problemObj.duplicateIndex += 1;
        const itemToFind = (item) => item.problemName == dataMap.problemName;
        let idx = currentDiffProblemArray.findIndex(itemToFind);
        data[problem.difficulty.toLowerCase()][idx] = problemObj;
        dataMap.problemName += ` (${problemObj.duplicateIndex})`;
        data[problemObj.difficulty.toLowerCase()].push(dataMap);
        localStorage.setItem("leetCodeExtensionDetails", JSON.stringify(data));
    }
    else {
        dataMap.duplicateIndex = 0;
        data[dataMap.difficulty.toLowerCase()].push(dataMap);
        let dataToSet = JSON.stringify(data);
        localStorage.setItem("leetCodeExtensionDetails", dataToSet);
    }
    alert("Saved!");
    chrome.runtime.sendMessage({ showGraph: true });
}
function saveData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield reset();
        if (!localStorage.getItem("leetCodeExtensionDetails")) {
            setInitialData();
            setData();
        }
        else {
            setData();
        }
    });
}
function setInitialData() {
    var problemDetails = JSON.stringify({
        easy: [],
        medium: [],
        hard: [],
    });
    localStorage.setItem("leetCodeExtensionDetails", problemDetails);
}


/***/ }),

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Converts the given individuval time parts to human readable form
function getTimeasString(seconds, mins, hours) {
    if (hours > 0 && mins > 0) {
        return `${normalize(hours)}hr ${normalize(mins)}minutes`;
    }
    else if (hours > 0) {
        return `${normalize(hours)} hour`;
    }
    else if (mins > 0) {
        return `${normalize(mins)} minutes`;
    }
    else if (seconds > 0) {
        return `${normalize(seconds)} seconds`;
    }
    else {
        return '0 seconds (:(:';
    }
}
exports.getTimeasString = getTimeasString;
// Removes trailing zeroes from the TimeStamp
function normalize(num) {
    let n = Math.floor(num);
    return n;
}
exports.normalize = normalize;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTtBQUNiO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE4QyxjQUFjO0FBQzVELGtCQUFrQixtQkFBTyxDQUFDLG1DQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsbUJBQW1CO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGdCQUFnQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxnQkFBZ0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxtQkFBbUI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxXQUFXO0FBQ2xELDhDQUE4QyxnQkFBZ0I7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsMEJBQTBCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdk5hO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQ7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQixLQUFLLGdCQUFnQjtBQUN4RDtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0Esa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2JhY2tncm91bmQudHNcIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcbi8vIE92ZXJyaWRpbmcgQ3VzdG9tIFdpbmRvdyBPYmplY3QgU2luY2UgY2Fubm90IGFtIHVuYWJsZSB0byBleHRlbmQgdGhlIGRlZmF1bHQgd2luZG93IG9ialxyXG5sZXQgd2luZG93T2JqID0gd2luZG93O1xyXG5sZXQgdGltZVN0cmluZztcclxubGV0IGN1cnJlbnRVcmw7XHJcbmxldCBtaWxpc2VjID0gMDtcclxubGV0IHNlYyA9IDA7IC8qIGhvbGRzIGluY3JlbWVudGluZyB2YWx1ZSAqL1xyXG5sZXQgbWluID0gMDtcclxubGV0IGhvdXIgPSAwO1xyXG5sZXQgbWlsaVNlY091dCA9IDA7XHJcbmxldCBzZWNPdXQgPSAwO1xyXG5sZXQgbWluT3V0ID0gMDtcclxubGV0IGhvdXJPdXQgPSAwO1xyXG4vLyBTZXR0aW5nIFBvcHVwIGR5bmFtaWNhbGx5XHJcbmNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlQmFja2dyb3VuZENvbG9yKHsgY29sb3I6IFwiIzVDQUQ2MlwiIH0pO1xyXG5jaHJvbWUudGFicy5vbkFjdGl2YXRlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoYWN0aXZlSW5mbykge1xyXG4gICAgY29uc3QgYWN0aXZlVGFiSWQgPSBhY3RpdmVJbmZvLnRhYklkO1xyXG4gICAgY2hyb21lLnRhYnMuZ2V0KGFjdGl2ZVRhYklkLCBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgY3VycmVudFVybCA9IHRhYi51cmw7XHJcbiAgICB9KTtcclxufSk7XHJcbi8vIFBlcnNpc3RpbmcgRGF0YSBTdHVmZnN0XHJcbmNvbnN0IHByb2JsZW0gPSB7fTtcclxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xyXG4gICAgaWYgKHJlcXVlc3QpIHtcclxuICAgICAgICBpZiAocmVxdWVzdC5hY3Rpb24gPT0gXCJzZXRQcm9ibGVtXCIpIHtcclxuICAgICAgICAgICAgcHJvYmxlbS5wcm9ibGVtTmFtZSA9IHJlcXVlc3QucGF5bG9hZC5wcm9ibGVtTmFtZTtcclxuICAgICAgICAgICAgcHJvYmxlbS5kaWZmaWN1bHR5ID0gcmVxdWVzdC5wYXlsb2FkLmRpZmZpY3VsdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3QuYWN0aW9uID09IFwiZ2V0UHJvYmxlbVwiKSB7XHJcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZShwcm9ibGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVxdWVzdC5hY3Rpb24gPT0gXCJzZXRUaW1lclwiKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0U3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChyZXF1ZXN0LmFjdGlvbiA9PSBcImdldFRpbWVyXCIpIHtcclxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3RhcnRzdG9wOiBzdGFydHN0b3AgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlcXVlc3QuYWN0aW9uID09PSAnZ2V0Q3VycmVudFRpbWUnKSB7XHJcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XHJcbiAgICAgICAgICAgICAgICBtaWxpU2VjT3V0OiBtaWxpU2VjT3V0LFxyXG4gICAgICAgICAgICAgICAgaG91ck91dDogaG91ck91dCxcclxuICAgICAgICAgICAgICAgIHNlY091dDogc2VjT3V0LFxyXG4gICAgICAgICAgICAgICAgbWluT3V0OiBtaW5PdXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuLy8gVXBkYXRpbmcgVGltZXIgU3R1ZmZzXHJcbmxldCBzdGFydHN0b3AgPSAwO1xyXG5sZXQgeDtcclxuLyogVG9nZ2xlIFN0YXJ0U3RvcCAqL1xyXG5mdW5jdGlvbiBzdGFydFN0b3AoKSB7XHJcbiAgICBzdGFydHN0b3AgPSBzdGFydHN0b3AgKyAxO1xyXG4gICAgbGV0IGRvY3VtZW50ID0gY2hyb21lLmV4dGVuc2lvbi5nZXRWaWV3cyh7IHR5cGU6IFwicG9wdXBcIiB9KVswXS5kb2N1bWVudDtcclxuICAgIGlmIChzdGFydHN0b3AgPT0gMSkge1xyXG4gICAgICAgIHN0YXJ0VGltZXIoKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0XCIpLmlubmVySFRNTCA9IFwiUGF1c2VcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHN0YXJ0c3RvcCA9PSAyKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydFwiKS5pbm5lckhUTUwgPSBcIlN0YXJ0XCI7XHJcbiAgICAgICAgc3RhcnRzdG9wID0gMDtcclxuICAgICAgICBzdG9wVGltZXIoKTtcclxuICAgIH1cclxufVxyXG4vLyBDcmVhdGluZyBteSBDdXN0b20gV2luZG93IG9iamVjdCBzaW5jZSBUeXBlc2NyaXB0IGRvZXNudCBhbGxvdyBtdWNoIGZsZXhpYmxpdHlcclxud2luZG93T2JqLnN0YXJ0U3RvcCA9IHN0YXJ0U3RvcDtcclxud2luZG93T2JqLnJlc2V0RnVuYyA9IHJlc2V0O1xyXG53aW5kb3dPYmouc2F2ZURhdGEgPSBzYXZlRGF0YTtcclxuLy9TdGFydHMgdGhlIFRpbWVyXHJcbmZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XHJcbiAgICB4ID0gc2V0SW50ZXJ2YWwodGltZXIsIDEwKTtcclxufVxyXG4vLyBTdG9wcyB0aGUgdGltZXJcclxuZnVuY3Rpb24gc3RvcFRpbWVyKCkge1xyXG4gICAgY2xlYXJJbnRlcnZhbCh4KTtcclxufVxyXG4vLyBEZWNsYXJpbmcgVmFyaWFibGVzXHJcbi8vIERyaXZlciBmb3IgVGltZXJcclxuZnVuY3Rpb24gdGltZXIoKSB7XHJcbiAgICBsZXQgcG9wdXAgPSBjaHJvbWUuZXh0ZW5zaW9uLmdldFZpZXdzKHsgdHlwZTogXCJwb3B1cFwiIH0pWzBdO1xyXG4gICAgbGV0IGRvY3VtZW50ID0gcG9wdXAgJiYgcG9wdXAuZG9jdW1lbnQ7XHJcbiAgICBtaWxpU2VjT3V0ID0gY2hlY2tUaW1lKG1pbGlzZWMpO1xyXG4gICAgc2VjT3V0ID0gY2hlY2tUaW1lKHNlYyk7XHJcbiAgICBtaW5PdXQgPSBjaGVja1RpbWUobWluKTtcclxuICAgIGhvdXJPdXQgPSBjaGVja1RpbWUoaG91cik7XHJcbiAgICBtaWxpc2VjID0gKyttaWxpc2VjO1xyXG4gICAgaWYgKG1pbGlzZWMgPT09IDEwMCkge1xyXG4gICAgICAgIG1pbGlzZWMgPSAwO1xyXG4gICAgICAgIHNlYyA9ICsrc2VjO1xyXG4gICAgfVxyXG4gICAgaWYgKHNlYyA9PSA2MCkge1xyXG4gICAgICAgIG1pbiA9ICsrbWluO1xyXG4gICAgICAgIHNlYyA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAobWluID09IDYwKSB7XHJcbiAgICAgICAgbWluID0gMDtcclxuICAgICAgICBob3VyID0gKytob3VyO1xyXG4gICAgfVxyXG4gICAgLy8gVXBkYXRlcyBET01cclxuICAgIC8qXHJcbiAgICBXaGVuIHRoZSBQb3B1cCBpcyBjbG9zZWQgYmFja2dyb3VuZCBkb2VzJ250IGhhdmUgcmVmZXJlbmNlIHRvIHRoZSBQb3B1cCdzXHJcbiAgICBkb2N1bWVudCBvYmplY3QgIHdlIG5vIG5lZWQgdG8gcmVuZGVyIHdoZW4gdGhlIHBvcHVwIGlzIG5vdCBvcGVuZWRcclxuICBcclxuICBcclxuICAgICovXHJcbiAgICBpZiAoZG9jdW1lbnQpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1pbGlzZWNcIikuaW5uZXJIVE1MID0gbWlsaVNlY091dC50b1N0cmluZygpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VjXCIpLmlubmVySFRNTCA9IHNlY091dC50b1N0cmluZygpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWluXCIpLmlubmVySFRNTCA9IG1pbk91dC50b1N0cmluZygpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG91clwiKS5pbm5lckhUTUwgPSBob3VyT3V0LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICAvLyBVcGRhdGUgdGhlIGJhZGdlIFRleHRcclxuICAgIHRpbWVTdHJpbmcgPSBoZWxwZXJzXzEuZ2V0VGltZWFzU3RyaW5nKHNlY091dCwgbWluT3V0LCBob3VyT3V0KTtcclxuICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7IHRleHQ6IHRpbWVTdHJpbmcgfSk7XHJcbn1cclxuLy8gQ2hlY2tzIHRpbWUgdG8gYWRkIDAgb3Igbm90XHJcbmZ1bmN0aW9uIGNoZWNrVGltZShpKSB7XHJcbiAgICBpZiAoaSA8IDEwKSB7XHJcbiAgICAgICAgaSA9IFwiMFwiICsgaTtcclxuICAgIH1cclxuICAgIHJldHVybiBpO1xyXG59XHJcbi8vIFJlc2V0cyB0aGUgdGltZXJcclxuZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICBzdG9wVGltZXIoKTtcclxuICAgIGNocm9tZS5icm93c2VyQWN0aW9uLnNldEJhZGdlVGV4dCh7IHRleHQ6IFwiXCIgfSk7XHJcbiAgICBsZXQgZG9jdW1lbnQgPSBjaHJvbWUuZXh0ZW5zaW9uLmdldFZpZXdzKHsgdHlwZTogXCJwb3B1cFwiIH0pWzBdLmRvY3VtZW50O1xyXG4gICAgLypSZXNldCovXHJcbiAgICBzdGFydHN0b3AgPSAwO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydFwiKS5pbm5lckhUTUwgPSBcIlN0YXJ0XCI7XHJcbiAgICBtaWxpc2VjID0gMDtcclxuICAgIHNlYyA9IDA7XHJcbiAgICBtaW4gPSAwO1xyXG4gICAgaG91ciA9IDA7XHJcbiAgICBtaWxpU2VjT3V0ID0gMDtcclxuICAgIGhvdXJPdXQgPSAwO1xyXG4gICAgbWluT3V0ID0gMDtcclxuICAgIHNlY091dCA9IDA7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1pbGlzZWNcIikuaW5uZXJIVE1MID0gXCIwMFwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWNcIikuaW5uZXJIVE1MID0gXCIwMFwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtaW5cIikuaW5uZXJIVE1MID0gXCIwMFwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob3VyXCIpLmlubmVySFRNTCA9IFwiMDBcIjtcclxufVxyXG5mdW5jdGlvbiBzZXREYXRhKCkge1xyXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibGVldENvZGVFeHRlbnNpb25EZXRhaWxzXCIpKTtcclxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvL0B0cy1pZ25vcmVcclxuICAgIGxldCBkZCA9IFN0cmluZyh0b2RheS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcclxuICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgbGV0IG1tID0gU3RyaW5nKHRvZGF5LmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCBcIjBcIik7IC8vSmFudWFyeSBpcyAwIVxyXG4gICAgbGV0IHl5eXkgPSB0b2RheS5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgdG9kYXlTdHJpbmcgPSBkZCArIFwiL1wiICsgbW0gKyBcIi9cIiArIHl5eXk7XHJcbiAgICBjb25zdCBwcm9ibGVtTmFtZSA9IHByb2JsZW0ucHJvYmxlbU5hbWUuc3BsaXQoXCIuXCIpWzFdO1xyXG4gICAgY29uc3QgZGF0YU1hcCA9IHtcclxuICAgICAgICBwcm9ibGVtTmFtZTogcHJvYmxlbU5hbWUsXHJcbiAgICAgICAgZGlmZmljdWx0eTogcHJvYmxlbS5kaWZmaWN1bHR5LFxyXG4gICAgICAgIHRpbWVUYWtlbjogdGltZVN0cmluZyxcclxuICAgICAgICBkYXRlOiB0b2RheVN0cmluZyxcclxuICAgICAgICBwcm9ibGVtVXJsOiBjdXJyZW50VXJsLFxyXG4gICAgfTtcclxuICAgIGxldCBjdXJyZW50RGlmZlByb2JsZW1BcnJheSA9IGRhdGFbcHJvYmxlbS5kaWZmaWN1bHR5LnRvTG93ZXJDYXNlKCldO1xyXG4gICAgbGV0IGV4aXN0cyA9IGN1cnJlbnREaWZmUHJvYmxlbUFycmF5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBpdGVtLnByb2JsZW1OYW1lID09PSBwcm9ibGVtTmFtZTtcclxuICAgIH0pO1xyXG4gICAgbGV0IHByb2JsZW1PYmogPSBleGlzdHNbMF07XHJcbiAgICBpZiAoZXhpc3RzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyBkYXRhTWFwLnByb2JsZW1OYW1lICs9ICBwcm9ibGVtT2JqLmR1cGxpY2F0ZUluZGV4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcHJvYmxlbU9iai5kdXBsaWNhdGVJbmRleCArPSAxO1xyXG4gICAgICAgIGNvbnN0IGl0ZW1Ub0ZpbmQgPSAoaXRlbSkgPT4gaXRlbS5wcm9ibGVtTmFtZSA9PSBkYXRhTWFwLnByb2JsZW1OYW1lO1xyXG4gICAgICAgIGxldCBpZHggPSBjdXJyZW50RGlmZlByb2JsZW1BcnJheS5maW5kSW5kZXgoaXRlbVRvRmluZCk7XHJcbiAgICAgICAgZGF0YVtwcm9ibGVtLmRpZmZpY3VsdHkudG9Mb3dlckNhc2UoKV1baWR4XSA9IHByb2JsZW1PYmo7XHJcbiAgICAgICAgZGF0YU1hcC5wcm9ibGVtTmFtZSArPSBgICgke3Byb2JsZW1PYmouZHVwbGljYXRlSW5kZXh9KWA7XHJcbiAgICAgICAgZGF0YVtwcm9ibGVtT2JqLmRpZmZpY3VsdHkudG9Mb3dlckNhc2UoKV0ucHVzaChkYXRhTWFwKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxlZXRDb2RlRXh0ZW5zaW9uRGV0YWlsc1wiLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkYXRhTWFwLmR1cGxpY2F0ZUluZGV4ID0gMDtcclxuICAgICAgICBkYXRhW2RhdGFNYXAuZGlmZmljdWx0eS50b0xvd2VyQ2FzZSgpXS5wdXNoKGRhdGFNYXApO1xyXG4gICAgICAgIGxldCBkYXRhVG9TZXQgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxlZXRDb2RlRXh0ZW5zaW9uRGV0YWlsc1wiLCBkYXRhVG9TZXQpO1xyXG4gICAgfVxyXG4gICAgYWxlcnQoXCJTYXZlZCFcIik7XHJcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHNob3dHcmFwaDogdHJ1ZSB9KTtcclxufVxyXG5mdW5jdGlvbiBzYXZlRGF0YSgpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgeWllbGQgcmVzZXQoKTtcclxuICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibGVldENvZGVFeHRlbnNpb25EZXRhaWxzXCIpKSB7XHJcbiAgICAgICAgICAgIHNldEluaXRpYWxEYXRhKCk7XHJcbiAgICAgICAgICAgIHNldERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNldERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBzZXRJbml0aWFsRGF0YSgpIHtcclxuICAgIHZhciBwcm9ibGVtRGV0YWlscyA9IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBlYXN5OiBbXSxcclxuICAgICAgICBtZWRpdW06IFtdLFxyXG4gICAgICAgIGhhcmQ6IFtdLFxyXG4gICAgfSk7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxlZXRDb2RlRXh0ZW5zaW9uRGV0YWlsc1wiLCBwcm9ibGVtRGV0YWlscyk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLy8gQ29udmVydHMgdGhlIGdpdmVuIGluZGl2aWR1dmFsIHRpbWUgcGFydHMgdG8gaHVtYW4gcmVhZGFibGUgZm9ybVxyXG5mdW5jdGlvbiBnZXRUaW1lYXNTdHJpbmcoc2Vjb25kcywgbWlucywgaG91cnMpIHtcclxuICAgIGlmIChob3VycyA+IDAgJiYgbWlucyA+IDApIHtcclxuICAgICAgICByZXR1cm4gYCR7bm9ybWFsaXplKGhvdXJzKX1ociAke25vcm1hbGl6ZShtaW5zKX1taW51dGVzYDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhvdXJzID4gMCkge1xyXG4gICAgICAgIHJldHVybiBgJHtub3JtYWxpemUoaG91cnMpfSBob3VyYDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1pbnMgPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke25vcm1hbGl6ZShtaW5zKX0gbWludXRlc2A7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzZWNvbmRzID4gMCkge1xyXG4gICAgICAgIHJldHVybiBgJHtub3JtYWxpemUoc2Vjb25kcyl9IHNlY29uZHNgO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICcwIHNlY29uZHMgKDooOic7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5nZXRUaW1lYXNTdHJpbmcgPSBnZXRUaW1lYXNTdHJpbmc7XHJcbi8vIFJlbW92ZXMgdHJhaWxpbmcgemVyb2VzIGZyb20gdGhlIFRpbWVTdGFtcFxyXG5mdW5jdGlvbiBub3JtYWxpemUobnVtKSB7XHJcbiAgICBsZXQgbiA9IE1hdGguZmxvb3IobnVtKTtcclxuICAgIHJldHVybiBuO1xyXG59XHJcbmV4cG9ydHMubm9ybWFsaXplID0gbm9ybWFsaXplO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9