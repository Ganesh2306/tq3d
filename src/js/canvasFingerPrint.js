/*eslint-disable */ !(function(e, t) {
"object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(((e = e || self).CanvasFingerprint = {}));
})(this, function(e) {
  "use strict";
  (e.Config = function e() {
    console.log("CanvasFingerprint version 1.0 (20.07.2020)"),
      Object.assign(e.prototype, {
        get: function() {
          var e = document.createElement("canvas"),
            t = e.getContext("2d"),
            r = "Textronic Design System";
          (t.textBaseline = "top"),
          (t.font = "14px 'Arial'"),
          (t.textBaseline = "alphabetic"),
          (t.fillStyle = "#f60"),
          t.fillRect(125, 1, 62, 20),
            (t.fillStyle = "#069"),
            t.fillText(r, 2, 15),
            (t.fillStyle = "rgba(102, 204, 0, 0.7)"),
            t.fillText(r, 4, 17);
          var n = e.toDataURL().replace("data:image/png;base64,", "");
          return (function(e) {
              for (var t, r = [], n = 0; n < 256; n++) {
                t = n;
                for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
                r[n] = t;
              }
              for (var o = -1, a = 0; a < e.length; a++) o = (o >>> 8) ^ r[255 & (o ^ e.charCodeAt(a))];
              return (-1 ^ o) >>> 0;
            })(atob(n).slice(-16, -12))
            .toString(16)
            .toUpperCase();
        },
        getBrowser: function() {
          return (function(e) {
            switch (!0) {
              case -1 < e.indexOf("edge"):
                return "edge";
              case -1 < e.indexOf("edg"):
                return "chromium based edge (dev or canary)";
              case -1 < e.indexOf("opr") && !!window.opr:
                return "opera";
              case -1 < e.indexOf("chrome") && !!window.chrome:
                return "chrome";
              case -1 < e.indexOf("trident"):
                return "ie";
              case -1 < e.indexOf("firefox"):
                return "firefox";
              case -1 < e.indexOf("safari"):
                return "safari";
              default:
                return "other";
            }
          })(window.navigator.userAgent.toLowerCase());
        },
        getDeviceType: function() {
          var ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
          }
          if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
              ua
            )
          ) {
            return "mobile";
          }
          return "desktop";
        },
      });
  }),
  Object.defineProperty(e, "__esModule", {
    value: !0
  });
});