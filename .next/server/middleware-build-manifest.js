self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/404": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/404.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/events": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/events.js"
    ],
    "/register": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/register.js"
    ],
    "/role-selection": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/role-selection.js"
    ],
    "/signin": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/signin.js"
    ],
    "/timetables": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/timetables.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];