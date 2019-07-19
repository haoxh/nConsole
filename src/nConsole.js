
import io from 'socket.io-client/dist/socket.io.slim'

if (!Array.isArray) {
  Array.isArray = function (args) {
    return "length" in args && "push" in args;
  };
}
if (!Object.keys) {
  Object.keys = function (args) {
    if (Object.prototype.toString.call(args) !== "[object Object]")
      throw new TypeError(" arguments must be an Object");
    var keys = [];
    for (var key in args) {
      keys.push(key);
    }
    return keys;
  };
}
if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    var T, A, k;
    if (this === null) throw new TypeError(" this is null or not defined");
    var O = Object(this);
    var len = O.length >>> 0;
    if (Object.prototype.toString.call(callback) !== "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }
    if (thisArg) T = thisArg;
    A = new Array(len);
    k = 0;
    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}
let _console = {};
let ioMessage = {};
const M = Math.random().toString();

export default function nConsole(options = {}) {
  const isHTTPS = window.location.protocol === 'https:';
  const userAgent = window.navigator.userAgent;
  let {
    protocol = 'http',
    host = '0.0.0.0',
    port = '3114',
    path = '/nconsole_message'
  } = options;
  if (!window.console) window.console = {};
  if (isHTTPS) protocol = 'https';
  ioMessage = io.connect(`${protocol}://${host}:${port}${path}`);
  repalceConsole()
  registerConsoleMessage()
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
  ioMessage.on("consoleMessage", consoleMessage)
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
    try {
      _console[code].apply(_console[code], args);
    } finally {
      if (args.length) {
        messageSend(code, args);
      }
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
  "[object Undefined]": toUndefined,
  "[object Function]": toFunction,
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


window.addEventListener("error", function (e) {
  if (e.error && e.error.stack) {
    console.error(e.error.stack.toString());
  } else {
    console.error(Object(e));
  }
});


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
    let o = {}
    o[item] = deepToObject(data[item])
    return o
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

function toFunction(value) {
  return new Function("return " + value)();
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