webpackJsonp([77],{890:function(u,t,o){"use strict";function e(u,t){return 1===t?u.one:t>=2&&t<=4?u.twoFour:u.other}function n(u,t,o){var n=e(u,t);return(n[o]||n).replace("{{count}}",t)}function r(u){return["lessThan","about","over","almost"].filter(function(t){return!!u.match(new RegExp("^"+t))})[0]}function a(u){var t="";return"almost"===u&&(t="takmer"),"about"===u&&(t="približne"),t.length>0?t+" ":""}function c(u){var t="";return"lessThan"===u&&(t="menej než"),"over"===u&&(t="viac než"),t.length>0?t+" ":""}function i(u){return u.charAt(0).toLowerCase()+u.slice(1)}function s(u,t,o){o=o||{};var e=r(u)||"",s=i(u.substring(e.length)),l=m[s];return o.addSuffix?o.comparison>0?a(e)+"za "+c(e)+n(l,t,"future"):a(e)+"pred "+c(e)+n(l,t,"past"):a(e)+c(e)+n(l,t,"regular")}Object.defineProperty(t,"__esModule",{value:!0}),t.default=s;var m={xSeconds:{one:{regular:"sekunda",past:"sekundou",future:"sekundu"},twoFour:{regular:"{{count}} sekundy",past:"{{count}} sekundami",future:"{{count}} sekundy"},other:{regular:"{{count}} sekúnd",past:"{{count}} sekundami",future:"{{count}} sekúnd"}},halfAMinute:{other:{regular:"pol minúty",past:"pol minútou",future:"pol minúty"}},xMinutes:{one:{regular:"minúta",past:"minútou",future:"minútu"},twoFour:{regular:"{{count}} minúty",past:"{{count}} minútami",future:"{{count}} minúty"},other:{regular:"{{count}} minút",past:"{{count}} minútami",future:"{{count}} minút"}},xHours:{one:{regular:"hodina",past:"hodinou",future:"hodinu"},twoFour:{regular:"{{count}} hodiny",past:"{{count}} hodinami",future:"{{count}} hodiny"},other:{regular:"{{count}} hodín",past:"{{count}} hodinami",future:"{{count}} hodín"}},xDays:{one:{regular:"deň",past:"dňom",future:"deň"},twoFour:{regular:"{{count}} dni",past:"{{count}} dňami",future:"{{count}} dni"},other:{regular:"{{count}} dní",past:"{{count}} dňami",future:"{{count}} dní"}},xMonths:{one:{regular:"mesiac",past:"mesiacom",future:"mesiac"},twoFour:{regular:"{{count}} mesiace",past:"{{count}} mesiacmi",future:"{{count}} mesiace"},other:{regular:"{{count}} mesiacov",past:"{{count}} mesiacmi",future:"{{count}} mesiacov"}},xYears:{one:{regular:"rok",past:"rokom",future:"rok"},twoFour:{regular:"{{count}} roky",past:"{{count}} rokmi",future:"{{count}} roky"},other:{regular:"{{count}} rokov",past:"{{count}} rokmi",future:"{{count}} rokov"}}};u.exports=t.default}});
//# sourceMappingURL=50a72a3a77625df209e1.js.map
