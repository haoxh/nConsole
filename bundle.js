(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/features/array/map'), require('core-js/features/array/keys'), require('core-js/features/object/assign'), require('socket.io-client')) :
  typeof define === 'function' && define.amd ? define(['core-js/features/array/map', 'core-js/features/array/keys', 'core-js/features/object/assign', 'socket.io-client'], factory) :
  (global = global || self, global.myBundle = factory(null, null, null, global.io));
}(this, function (map, keys, assign, io) { 'use strict';

  io = io && io.hasOwnProperty('default') ? io['default'] : io;

  let _console = {};
  let ioMessage = {};
  const M = Math.random().toString();

  function nConsole(options = {}) {
    const isHTTPS = window.location.protocol === 'https:';
    const userAgent = window.navigator.userAgent;
    let {
      protocol = 'https',
      host = '127.0.0.1',
      port = '3114',
      path = '/nconsole_message'
    } = options;
    if (!window.console) window.console = {};
    if (isHTTPS) protocol = 'https';
    ioMessage = io.connect(`${protocol}://${host}:${port}${path}`);
    repalceConsole();
    registerConsoleMessage();
    ioMessage.emit("userAgent", userAgent);
  }

  function socketEmit(data, code) {
    let o = {
      message: data,
      code: code,
      M: M
    };
    ioMessage.emit("socketEmitMessage", o);
  }

  function registerConsoleMessage() {
    ioMessage.on("fetchState", fetchState);
    ioMessage.on("consoleMessage", consoleMessage);
  }

  function repalceConsole() {
    const _consoleDescriptors = ["error", "log", "info", "warn", "dir", 'compiler', 'print'];
    for (let i = 0, len = _consoleDescriptors.length; i < len; i++) {
      let code = _consoleDescriptors[i];
      if (code in window.console) {
        _console[code] = window.console[code];
        messageDir(code);
      } else {
        registerConsole(code);
      }
    }
  }

  function registerConsole(code) {
    window.console[code] = function messageInstall() {
      return socketEmit(Array.prototype.slice.apply(arguments), code);
    };
  }

  function fetchState(data) {
    if (data === 'fetchOpen') {
      window._isWatchRequest = true;
    } else {
      window._isWatchRequest = null;
    }
  }

  function consoleMessage(data) {
    if (data.M && data.M !== M) {
      let code = data.code;
      let message = data.message;
      let arr = [];
      if (code === 'compiler') {
        arr = message.map(function (i) {
          if (typeof i === 'string') {
            try {
              return (new Function('return ' + i))()
            } catch (e) { }
          }
        });
        messageSend('log', arr);
        return
      } else if (code === 'performance') {
        if (window.performance) {
          var o = {};
          arr = message;
          if (!arr[0] || arr[0] === 'resource') {
            o = window.performance.getEntriesByType("resource");
          } else if (arr[0] === 'timing') {
            var _performance = window.performance.timing;
            o = Object(_performance);
          }
          socketEmit([o], 'log');
        }
        return
      }
      message.map(item => {
        arr.push(toSource(item));
      });
      if (code === 'print') {
        if (console.table) {
          console.table.apply(console.table, arr);
        } else {
          _console['log'].apply(_console['log'], arr);
        }
        return
      }
      _console[code].apply(_console[code], arr);
    }
  }

  function messageDir(code) {
    window.console[code] = function messageInstall() {
      let args = Array.prototype.slice.apply(arguments);
      _console[code].apply(_console[code], args);
      if (args.length) {
        messageSend(code, args);
      }
    };
  }

  const outputObject = {
    "[object Object]": stringify,
    "[object Array]": stringify,
    "[object Map]": mapToString,
    "[object Null]": stringify,
    "[object Boolean]": stringify,
    "[object Symbol]": toString,
    "[object Function]": toString,
    "[object Set]": setToString,
    "[object Number]": toNumber,
    "[object Undefined]": stringify
  };
  const outputSorce = {
    "[object Object]": parse,
    "[object Array]": parse,
    "[object Null]": toNull,
    "[object Boolean]": toBoolean,
    "[object Symbol]": parse,
    "[object Set]": ToSet,
    "[object Map]": toMap,
    "[object Number]": toNumber,
    "[object Undefined]": toUndefined
  };

  function messageSend(code, args) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === window || args[i] instanceof HTMLElement) {
        args[i] = args[i].toString();
      }
      if (Array.isArray(args[i]) || isObject(args[i])) {
        args[i] = deepToObject(args[i]);
      } else {
        args[i] = outputToString(args[i]);
      }
    }
    if (typeof args[0].value === 'string' && /(\[WDS\])|(\[HMR\])/.test(args[0].value)) {
      return
    }
    socketEmit(args, code);
  }

  /**************** utils ⬇ ****************/
  function isObject(args) {
    return Object.prototype.toString ?
      Object.prototype.toString.call(args) === "[object Object]" :
      typeof args === "object";
  }

  function deepArrayToString(data) {
    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = deepToObject(data[i]);
    }
    return data;
  }

  function deepObjectToString(data) {
    data = Object.keys(data).map(function (item) {
      return {
        [item]: deepToObject(data[item])
      };
    });
    return data;
  }

  function deepToObject(data) {
    if (Array.isArray(data)) {
      return deepArrayToString(data);
    } else if (isObject(data)) {
      return deepObjectToString(data);
    }
    return outputObjectToString(data);
  }

  function outputObjectToString(value) {
    let key = {}.toString.call(value);
    if (outputObject[key]) {
      return outputObject[key].call(this, value)
    } else {
      return value
    }
  }

  function outputToString(value) {
    let key = {}.toString.call(value);
    if (outputObject[key]) {
      return {
        value: outputObject[key].call(this, value),
        type: key
      };
    }
    return {
      value: value,
      type: key
    };
  }


  function stringify(object) {
    try {
      return JSON.stringify(object);
    } catch (e) {
      return object.toString();
    }
  }

  function mapToString(Map) {
    if (Array.from) {
      return JSON.stringify(Array.from(Map));
    } else {
      Map.toString();
    }
  }

  function toString(value) {
    return value.toString();
  }

  function setToString(Set) {
    if (Array.from) {
      return JSON.stringify(Array.from(Set));
    }
    return JSON.stringify(Set);
  }

  function parse(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  function toNull() {
    return null;
  }

  function toUndefined() {
    return undefined;
  }

  function toBoolean(value) {
    return new Function("return " + value)();
  }

  function ToSet(value) {
    if (window.Set) {
      return new Set(JSON.parse(value));
    } else {
      return value;
    }
  }

  function toMap(value) {
    if (window.Map) {
      try {
        return new Map(JSON.parse(value));
      } catch (e) {
        return value;
      }
    } else {
      return value;
    }
  }

  function toNumber(value) {
    return Number(value);
  }

  function toSource(message) {
    if (message && message.type) {
      if (outputSorce[message.type]) {
        return outputSorce[message.type](message.value);
      } else {
        return message.value;
      }
    } else {
      return message;
    }
  }

  return nConsole;

}));
