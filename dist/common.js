Object.defineProperty(exports,"__esModule",{value:true});exports.removeEmpty=removeEmpty;function removeEmpty(obj){var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};if(!obj){return obj;}var omitZero=options.omitZero===true;var ignore=options.ignore||[];var accepts={};Object.keys(obj).forEach(function(key){if(ignore.includes(key)){accepts[key]=obj[key];}else{if(!(obj[key]===null||obj[key]===undefined||obj[key]===0&&omitZero)){accepts[key]=obj[key];}}});return accepts;}
//# sourceMappingURL=common.js.map
