webpackHotUpdate("main",{

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rbd_pnpm_volume_ffac6d26_81aa_4a2c_80df_27dd7c3dee38_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! /rbd/pnpm-volume/ffac6d26-81aa-4a2c-80df-27dd7c3dee38/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../rbd/pnpm-volume/ffac6d26-81aa-4a2c-80df-27dd7c3dee38/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../rbd/pnpm-volume/ffac6d26-81aa-4a2c-80df-27dd7c3dee38/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_d3_library__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-d3-library */ "../rbd/pnpm-volume/ffac6d26-81aa-4a2c-80df-27dd7c3dee38/node_modules/react-d3-library/dist/react-d3-library.js");
/* harmony import */ var react_d3_library__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_d3_library__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App.css */ "./src/App.css");
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_usa_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-usa-map */ "../rbd/pnpm-volume/ffac6d26-81aa-4a2c-80df-27dd7c3dee38/node_modules/react-usa-map/index.js");
/* harmony import */ var react_usa_map__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_usa_map__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _analysis__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./analysis */ "./src/analysis.js");
/* harmony import */ var _analysis__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_analysis__WEBPACK_IMPORTED_MODULE_5__);

var _jsxFileName = "/app/src/App.js";





const purple = "#7e00c9";
const RD3Component = react_d3_library__WEBPACK_IMPORTED_MODULE_2___default.a.Component;
/* All documentation found at: https://www.npmjs.com/package/react-usa-map */

class App extends react__WEBPACK_IMPORTED_MODULE_1__["Component"] {
  constructor(props) {
    super(props);

    this.mapHandler = event => {
      alert(event.target.dataset.name);
    };

    this.componentToHex = c => {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };

    this.rgbToHex = rgb => {
      console.log(rgb);

      const _rgb = Object(_rbd_pnpm_volume_ffac6d26_81aa_4a2c_80df_27dd7c3dee38_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(rgb, 3),
            r = _rgb[0],
            g = _rgb[1],
            b = _rgb[2];

      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };

    this.getColor = weight => {
      const w1 = weight / 663204;
      const w2 = 1 - w1;
      const color1 = [200, 0, 32];
      const color2 = [248, 232, 237];
      var rgb = [Math.round(color1[0] * w1 + color2[0] * w2), Math.round(color1[1] * w1 + color2[1] * w2), Math.round(color1[2] * w1 + color2[2] * w2)];
      return this.rgbToHex(rgb);
    };

    this.statesCustomConfig = () => {
      let config = {};

      for (let key in this.state_counts) {
        config[key] = {
          fill: this.getColor(this.state_counts[key]),
          clickHandler: () => alert(this.state_abbr[key] + " (" + key + ") has had " + this.state_counts[key] + " car accidents in the past four years.")
        };
      }

      return config;
    };

    this.state = {
      d3: ''
    };
    this.state_counts = {
      'CA': 663204,
      'TX': 298062,
      'FL': 223746,
      'SC': 146689,
      'NC': 142460,
      'NY': 137799,
      'PA': 90395,
      'MI': 88694,
      'IL': 86390,
      'GA': 83620,
      'VA': 79957,
      'OR': 70840,
      'MN': 62727,
      'AZ': 62330,
      'WA': 61367,
      'TN': 58289,
      'OH': 55863,
      'LA': 52481,
      'OK': 51297,
      'NJ': 49942,
      'MD': 43328,
      'UT': 41385,
      'CO': 40124,
      'AL': 36369,
      'MA': 33014,
      'IN': 30040,
      'MO': 29012,
      'CT': 22803,
      'NE': 22505,
      'KY': 19122,
      'WI': 17580,
      'RI': 10483,
      'IA': 10346,
      'NV': 9524,
      'NH': 7064,
      'KS': 6887,
      'MS': 5961,
      'NM': 5020,
      'DE': 4434,
      'DC': 3653,
      'WV': 2274,
      'ME': 2065,
      'ID': 1757,
      'AR': 1749,
      'VT': 585,
      'MT': 504,
      'WY': 492,
      'SD': 60,
      'ND': 43
    };
    this.state_abbr = {
      "AL": "Alabama",
      "AK": "Alaska",
      "AS": "American Samoa",
      "AZ": "Arizona",
      "AR": "Arkansas",
      "CA": "California",
      "CO": "Colorado",
      "CT": "Connecticut",
      "DE": "Delaware",
      "DC": "District Of Columbia",
      "FM": "Federated States Of Micronesia",
      "FL": "Florida",
      "GA": "Georgia",
      "GU": "Guam",
      "HI": "Hawaii",
      "ID": "Idaho",
      "IL": "Illinois",
      "IN": "Indiana",
      "IA": "Iowa",
      "KS": "Kansas",
      "KY": "Kentucky",
      "LA": "Louisiana",
      "ME": "Maine",
      "MH": "Marshall Islands",
      "MD": "Maryland",
      "MA": "Massachusetts",
      "MI": "Michigan",
      "MN": "Minnesota",
      "MS": "Mississippi",
      "MO": "Missouri",
      "MT": "Montana",
      "NE": "Nebraska",
      "NV": "Nevada",
      "NH": "New Hampshire",
      "NJ": "New Jersey",
      "NM": "New Mexico",
      "NY": "New York",
      "NC": "North Carolina",
      "ND": "North Dakota",
      "MP": "Northern Mariana Islands",
      "OH": "Ohio",
      "OK": "Oklahoma",
      "OR": "Oregon",
      "PW": "Palau",
      "PA": "Pennsylvania",
      "PR": "Puerto Rico",
      "RI": "Rhode Island",
      "SC": "South Carolina",
      "SD": "South Dakota",
      "TN": "Tennessee",
      "TX": "Texas",
      "UT": "Utah",
      "VT": "Vermont",
      "VI": "Virgin Islands",
      "VA": "Virginia",
      "WA": "Washington",
      "WV": "West Virginia",
      "WI": "Wisconsin",
      "WY": "Wyoming"
    };
  }

  componentDidMount() {
    this.setState({
      d3: _analysis__WEBPACK_IMPORTED_MODULE_5___default.a
    });
  }

  // statesCustomConfig = () => {
  //     return {
  //       "AL": { fill: "#CC0000", 
  //             clickHandler: () => alert("Alabama has 9 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "AK": { fill: "#CC0000",
  //             clickHandler: () => alert("Alaska has 3 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "AZ": { fill: purple, 
  //             clickHandler: () => alert("Arizona has 11 electoral votes. Historically, the state votes Republican, but in 2016 the state was won by a margin of only 3.6%. Both Democratic and Republican votes will likely have an important impact on the 2020 federal election.")},
  //       "AR": { fill: "#CC0000",
  //             clickHandler: () => alert("Arkansas has 6 electoral votes. Historically, the state votes Republican, with the Republican margin of victory increasing in each of the last four elections. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "CA": { fill: "navy", 
  //             clickHandler: () => alert("California has 55 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "CO": { fill: purple, 
  //             clickHandler: () => alert("Colorado has 9 electoral votes. In the last three elections, the state has voted Democrat, but it is likely to be a battleground in the coming election. Both Democratic and Republican votes will likely have an important impact on the 2020 federal election.")},
  //       "CT": { fill: "navy", 
  //             clickHandler: () => alert("Connecticut has 7 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "DE": { fill: "navy",
  //             clickHandler: () => alert("Delaware has 3 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "DC": { fill: "navy",
  //             clickHandler: () => alert("The District of Columbia has 3 electoral votes. Historically, the district votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "FL": { fill: purple,
  //              clickHandler: () => alert("Florida has 29 electoral votes. Although it leans slightly Republican, the state is considered a battleground state for the 2020 election, as margins of victory hover around 1%. Both Democratic and Republican votes in this state will likely have a great impact on the 2020 federal election.")},
  //       "GA": { fill: purple,
  //             clickHandler: () => alert("Georgia has 16 electoral votes. The state has voted Republican in the past, but margins are growing more narrow (5% in 2016). Both Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")},
  //       "HI": { fill: "navy",
  //             clickHandler: () => alert("Hawaii has 4 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "ID": { fill: "#CC0000",
  //             clickHandler: () => alert("Idaho has 4 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "IL": { fill: "navy",
  //             clickHandler: () => alert("Illinois has 20 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "IN": { fill: "#CC0000",
  //             clickHandler: () => alert("Indiana has 11 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "IA": { fill: purple,
  //             clickHandler: () => alert("Iowa has 6 electoral votes. Due to the closeness of the general election vote and the importance of its caucuses, both Democratic and Republican votes may have a great impact on the 2020 federal election.")},
  //       "KS": { fill: "#CC0000",
  //             clickHandler: () => alert("Kansas has 6 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "KY": { fill: "#CC0000", 
  //             clickHandler: () => alert("Kentucky has 8 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "LA": { fill: "#CC0000",
  //             clickHandler: () => alert("Louisiana has 8 electoral votes. Historically, the state votes Republican, although it has voted Democratic three times since 1976 when the nominee was a Southern governor. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "ME": { fill: purple,
  //             clickHandler: () => alert("Maine has 4 electoral votes. Historically, the state votes Democrat, although the margin of victory shrunk to just 2.9% in 2016. Both Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")},
  //       "MD": { fill: "navy",
  //             clickHandler: () => alert("Maryland has 10 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "MA": { fill: "navy",
  //             clickHandler: () => alert("Massachusetts has 11 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "MI": { fill: purple,
  //             clickHandler: () => alert("Michigan has 16 electoral votes. Historically, the state votes Democrat, although in 2016 Trump flipped the state with a margin of just 0.2%. Both Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")},
  //       "MN": { fill: purple,
  //             clickHandler: () => alert("Minnesota has 10 electoral votes. Historically, the state votes Democrat, but in the 2016 election the margin of victory was only 1.5%. Both Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")},
  //       "MS": { fill: "#CC0000",
  //             clickHandler: () => alert("Mississippi has 6 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "MO": { fill: "#CC0000",
  //              clickHandler: () => alert("Missouri has 10 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "MT": { fill: "#CC0000",
  //             clickHandler: () => alert("Montana has 3 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a great impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "NE": { fill: purple,
  //             clickHandler: () => alert("Nebraska has 5 electoral votes. Historically, the state votes Republican, however it does not use a winner-take-all approach of electoral votes. As such, both Democratic and Republican votes in this state may have an important impact on the 2020 federal election.")},
  //       "NV": { fill: purple,
  //             clickHandler: () => alert("Nevada has 6 electoral votes. Historically, the state leans Democrat, although it has been a battleground recently (2016 margin of victory is 2%). Both Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")},        
  //       "NH": { fill: purple,
  //             clickHandler: () => alert("New Hampshire has 4 electoral votes. While it has voted Democratic in the last seven elections, in 2016 the Democratic margin of victory was only 0.4%, the closest state after Michigan. Considered a battleground state, both Democratic and Republican votes will likely have an important impact in the 2020 federal election.")},
  //       "NJ": { fill: "navy",
  //             clickHandler: () => alert("New Jersey has 14 electoral votes. Historically, the state votes Democratic. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can great impact on local and state elections.")},
  //       "NM": { fill: "navy",
  //             clickHandler: () => alert("New Mexico has 5 electoral votes. It has voted Democratic in six of the last seven elections. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "NY": { fill: "navy",
  //             clickHandler: () => alert("New York has 29 electoral votes. Historically, the state votes Democratic. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "NC": { fill: purple,
  //             clickHandler: () => alert("North Carolina has 15 electoral votes. Historically, it has voted Republican, however it went Democratic in 2008 for Obama. In the 2016 election, the Republican margin of victory was 3.6%. Both Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")}, 
  //       "ND": { fill: "#CC0000",
  //             clickHandler: () => alert("North Dakota has 3 electoral votes. historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "OH": { fill: "#CC0000",
  //             clickHandler: () => alert("Ohio has 18 electoral votes. Historically, the state has flipped between Democratic and Republican, however in 2016 the margin of victory for the Republican party was the highest since 1988. Democratic votes in this state may or may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "OK": { fill: "#CC0000",
  //             clickHandler: () => alert("Oklahoma has 7 electoral votes. Historically, it votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "OR": { fill: "navy",
  //             clickHandler: () => alert("Oregon has 7 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "PA": { fill: purple,
  //             clickHandler: () => alert("Pennsylvania has 20 electoral votes. It has voted Democratic in six of the last seven elections (prior to 2016). It has been a battleground recently (2016 margin of victory was 0.7%). Both Democratic and Republican votes will likely have an important impact in the 2020 federal election.")},
  //       "RI": { fill: "navy",
  //             clickHandler: () => alert("Rhode Island has 4 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "SC": { fill: "#CC0000",
  //             clickHandler: () => alert("South Carolina has 9 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "SD": { fill: "#CC0000",
  //             clickHandler: () => alert("South Dakota has 3 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "TN": { fill: "#CC0000",
  //             clickHandler: () => alert("Tennessee has 11 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "TX": { fill: "#CC0000",
  //             clickHandler: () => alert("Texas has 38 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "UT": { fill: "#CC0000",
  //             clickHandler: () => alert("Utah has 6 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "VT": { fill: "navy",
  //             clickHandler: () => alert("Vermont has 3 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "VA": { fill: "navy",
  //             clickHandler: () => alert("Virginia has 13 electoral votes. Recently, the state leans Democrat. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "WA": { fill: "navy",
  //             clickHandler: () => alert("Washington has 12 electoral votes. Historically, the state votes Democrat. Republican votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "WV": { fill: "#CC0000",
  //             clickHandler: () => alert("West Virginia has 5 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //       "WI": { fill: purple,
  //             clickHandler: () => alert("Wisconsin has 10 electoral votes. This state is a swing state historically, although seven of the last 10 elections were Democrat. The Republican margin of victory in 2016 was 0.7%. Democratic and Republican votes in this state may have a great impact on the 2020 federal election.")},
  //       "WY": { fill: "#CC0000",
  //             clickHandler: () => alert("Wyoming has 3 electoral votes. Historically, the state votes Republican. Democratic votes in this state may not have a large impact on the 2020 federal election, however both Republican and Democratic votes can have great impact on local and state elections.")},
  //     };
  // };
  render() {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      className: "App",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 233
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 234
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(RD3Component, {
      data: this.state.d3,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 235
      },
      __self: this
    })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_usa_map__WEBPACK_IMPORTED_MODULE_4___default.a, {
      customize: this.statesCustomConfig(),
      onClick: this.mapHandler,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 237
      },
      __self: this
    }));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ })

})
//# sourceMappingURL=main.c6c952f43266d5e1cc05.hot-update.js.map