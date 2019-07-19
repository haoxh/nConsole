export function isObject(args) {
  return Object.prototype.toString ?
    Object.prototype.toString.call(args) === "[object Object]" :
    typeof args === "object";
}

export function stringify(object) {
  try {
    return JSON.stringify(object);
  } catch (e) {
    return object.toString();
  }
}

export function mapToString(Map) {
  if (Array.from) {
    return JSON.stringify(Array.from(Map));
  } else {
    Map.toString();
  }
}

export function toString(value) {
  return value.toString();
}

export function setToString(Set) {
  if (Array.from) {
    return JSON.stringify(Array.from(Set));
  }
  return JSON.stringify(Set);
}

export function parse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export function toNull() {
  return null;
}

export function toUndefined() {
  return undefined;
}

export function toBoolean(value) {
  return new Function("return " + value)();
}


export function ToSet(value) {
  if (window.Set) {
    return new Set(JSON.parse(value));
  } else {
    return value;
  }
}

export function toMap(value) {
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

export function toFunction(value) {
  return new Function("return " + value)();
}

export function toNumber(value) {
  return Number(value);
}

