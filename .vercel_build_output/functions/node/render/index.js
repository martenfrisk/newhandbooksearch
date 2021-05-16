var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/.pnpm/node-fetch@2.6.1/node_modules/node-fetch/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/node-fetch@2.6.1/node_modules/node-fetch/lib/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream2 = _interopDefault(require("stream"));
    var http2 = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var https2 = _interopDefault(require("https"));
    var zlib2 = _interopDefault(require("zlib"));
    var Readable2 = Stream2.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob2 = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options2 = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob2) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options2 && options2.type !== void 0 && String(options2.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable2();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob2([], {type: arguments[2]});
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob2.prototype, {
      size: {enumerable: true},
      type: {enumerable: true},
      slice: {enumerable: true}
    });
    Object.defineProperty(Blob2.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError2(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError2.prototype = Object.create(Error.prototype);
    FetchError2.prototype.constructor = FetchError2;
    FetchError2.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS2 = Symbol("Body internals");
    var PassThrough2 = Stream2.PassThrough;
    function Body2(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob2(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream2)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS2] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream2) {
        body.on("error", function(err) {
          const error3 = err.name === "AbortError" ? err : new FetchError2(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS2].error = error3;
        });
      }
    }
    Body2.prototype = {
      get body() {
        return this[INTERNALS2].body;
      },
      get bodyUsed() {
        return this[INTERNALS2].disturbed;
      },
      arrayBuffer() {
        return consumeBody2.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody2.call(this).then(function(buf) {
          return Object.assign(new Blob2([], {
            type: ct.toLowerCase()
          }), {
            [BUFFER]: buf
          });
        });
      },
      json() {
        var _this2 = this;
        return consumeBody2.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body2.Promise.reject(new FetchError2(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody2.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody2.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody2.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body2.prototype, {
      body: {enumerable: true},
      bodyUsed: {enumerable: true},
      arrayBuffer: {enumerable: true},
      blob: {enumerable: true},
      json: {enumerable: true},
      text: {enumerable: true}
    });
    Body2.mixIn = function(proto) {
      for (const name of Object.getOwnPropertyNames(Body2.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body2.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody2() {
      var _this4 = this;
      if (this[INTERNALS2].disturbed) {
        return Body2.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS2].disturbed = true;
      if (this[INTERNALS2].error) {
        return Body2.Promise.reject(this[INTERNALS2].error);
      }
      let body = this.body;
      if (body === null) {
        return Body2.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob2(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body2.Promise.resolve(body);
      }
      if (!(body instanceof Stream2)) {
        return Body2.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body2.Promise(function(resolve2, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError2(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError2(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError2(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve2(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError2(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob2(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone2(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream2 && typeof body.getBoundary !== "function") {
        p1 = new PassThrough2();
        p2 = new PassThrough2();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS2].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType2(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob2(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream2) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes2(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob2(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream2(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob2(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body2.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === "") {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers2 = class {
      constructor() {
        let init2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = Object.create(null);
        if (init2 instanceof Headers2) {
          const rawHeaders = init2.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init2 == null)
          ;
        else if (typeof init2 === "object") {
          const method = init2[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init2) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init2)) {
              const value = init2[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers2.prototype.entries = Headers2.prototype[Symbol.iterator];
    Object.defineProperty(Headers2.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers2.prototype, {
      get: {enumerable: true},
      forEach: {enumerable: true},
      set: {enumerable: true},
      append: {enumerable: true},
      has: {enumerable: true},
      delete: {enumerable: true},
      keys: {enumerable: true},
      values: {enumerable: true},
      entries: {enumerable: true}
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index2 = _INTERNAL.index;
        const values = getHeaders(target, kind);
        const len = values.length;
        if (index2 >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index2 + 1;
        return {
          value: values[index2],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({__proto__: null}, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers2();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$12 = Symbol("Response internals");
    var STATUS_CODES = http2.STATUS_CODES;
    var Response3 = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body2.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers2(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType2(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$12] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$12].url || "";
      }
      get status() {
        return this[INTERNALS$12].status;
      }
      get ok() {
        return this[INTERNALS$12].status >= 200 && this[INTERNALS$12].status < 300;
      }
      get redirected() {
        return this[INTERNALS$12].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$12].statusText;
      }
      get headers() {
        return this[INTERNALS$12].headers;
      }
      clone() {
        return new Response3(clone2(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body2.mixIn(Response3.prototype);
    Object.defineProperties(Response3.prototype, {
      url: {enumerable: true},
      status: {enumerable: true},
      ok: {enumerable: true},
      redirected: {enumerable: true},
      statusText: {enumerable: true},
      headers: {enumerable: true},
      clone: {enumerable: true}
    });
    Object.defineProperty(Response3.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$22 = Symbol("Request internals");
    var parse_url = Url.parse;
    var format_url = Url.format;
    var streamDestructionSupported = "destroy" in Stream2.Readable.prototype;
    function isRequest2(input) {
      return typeof input === "object" && typeof input[INTERNALS$22] === "object";
    }
    function isAbortSignal2(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request2 = class {
      constructor(input) {
        let init2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest2(input)) {
          if (input && input.href) {
            parsedURL = parse_url(input.href);
          } else {
            parsedURL = parse_url(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parse_url(input.url);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest2(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init2.body != null ? init2.body : isRequest2(input) && input.body !== null ? clone2(input) : null;
        Body2.call(this, inputBody, {
          timeout: init2.timeout || input.timeout || 0,
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType2(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest2(input) ? input.signal : null;
        if ("signal" in init2)
          signal = init2.signal;
        if (signal != null && !isAbortSignal2(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$22] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow !== void 0 ? init2.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init2.compress !== void 0 ? init2.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$22].method;
      }
      get url() {
        return format_url(this[INTERNALS$22].parsedURL);
      }
      get headers() {
        return this[INTERNALS$22].headers;
      }
      get redirect() {
        return this[INTERNALS$22].redirect;
      }
      get signal() {
        return this[INTERNALS$22].signal;
      }
      clone() {
        return new Request2(this);
      }
    };
    Body2.mixIn(Request2.prototype);
    Object.defineProperty(Request2.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request2.prototype, {
      method: {enumerable: true},
      url: {enumerable: true},
      headers: {enumerable: true},
      redirect: {enumerable: true},
      clone: {enumerable: true},
      signal: {enumerable: true}
    });
    function getNodeRequestOptions2(request) {
      const parsedURL = request[INTERNALS$22].parsedURL;
      const headers = new Headers2(request[INTERNALS$22].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream2.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes2(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError2(message) {
      Error.call(this, message);
      this.type = "aborted";
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError2.prototype = Object.create(Error.prototype);
    AbortError2.prototype.constructor = AbortError2;
    AbortError2.prototype.name = "AbortError";
    var PassThrough$1 = Stream2.PassThrough;
    var resolve_url = Url.resolve;
    function fetch3(url, opts) {
      if (!fetch3.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body2.Promise = fetch3.Promise;
      return new fetch3.Promise(function(resolve2, reject) {
        const request = new Request2(url, opts);
        const options2 = getNodeRequestOptions2(request);
        const send = (options2.protocol === "https:" ? https2 : http2).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error3 = new AbortError2("The user aborted a request.");
          reject(error3);
          if (request.body && request.body instanceof Stream2.Readable) {
            request.body.destroy(error3);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error3);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options2);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError2(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError2(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch3.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            const locationURL = location === null ? null : resolve_url(request.url, location);
            switch (request.redirect) {
              case "error":
                reject(new FetchError2(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError2(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers2(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (res.statusCode !== 303 && request.body && getTotalBytes2(request) === null) {
                  reject(new FetchError2("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve2(fetch3(new Request2(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response3(body, response_options);
            resolve2(response);
            return;
          }
          const zlibOptions = {
            flush: zlib2.Z_SYNC_FLUSH,
            finishFlush: zlib2.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib2.createGunzip(zlibOptions));
            response = new Response3(body, response_options);
            resolve2(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib2.createInflate());
              } else {
                body = body.pipe(zlib2.createInflateRaw());
              }
              response = new Response3(body, response_options);
              resolve2(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib2.createBrotliDecompress === "function") {
            body = body.pipe(zlib2.createBrotliDecompress());
            response = new Response3(body, response_options);
            resolve2(response);
            return;
          }
          response = new Response3(body, response_options);
          resolve2(response);
        });
        writeToStream2(req, request);
      });
    }
    fetch3.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch3.Promise = global.Promise;
    module2.exports = exports = fetch3;
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.default = exports;
    exports.Headers = Headers2;
    exports.Request = Request2;
    exports.Response = Response3;
    exports.FetchError = FetchError2;
  }
});

// node_modules/.pnpm/cross-fetch@3.1.4/node_modules/cross-fetch/dist/node-ponyfill.js
var require_node_ponyfill = __commonJS({
  "node_modules/.pnpm/cross-fetch@3.1.4/node_modules/cross-fetch/dist/node-ponyfill.js"(exports, module2) {
    var nodeFetch = require_lib();
    var realFetch = nodeFetch.default || nodeFetch;
    var fetch3 = function(url, options2) {
      if (/^\/\//.test(url)) {
        url = "https:" + url;
      }
      return realFetch.call(this, url, options2);
    };
    fetch3.ponyfill = true;
    module2.exports = exports = fetch3;
    exports.fetch = fetch3;
    exports.Headers = nodeFetch.Headers;
    exports.Request = nodeFetch.Request;
    exports.Response = nodeFetch.Response;
    exports.default = fetch3;
  }
});

// node_modules/.pnpm/cross-fetch@3.1.4/node_modules/cross-fetch/dist/node-polyfill.js
var require_node_polyfill = __commonJS({
  "node_modules/.pnpm/cross-fetch@3.1.4/node_modules/cross-fetch/dist/node-polyfill.js"() {
    var fetchNode = require_node_ponyfill();
    var fetch3 = fetchNode.fetch.bind({});
    fetch3.polyfill = true;
    if (!global.fetch) {
      global.fetch = fetch3;
      global.Response = fetchNode.Response;
      global.Headers = fetchNode.Headers;
      global.Request = fetchNode.Request;
    }
  }
});

// node_modules/.pnpm/meilisearch@0.18.2/node_modules/meilisearch/dist/bundles/meilisearch.umd.js
var require_meilisearch_umd = __commonJS({
  "node_modules/.pnpm/meilisearch@0.18.2/node_modules/meilisearch/dist/bundles/meilisearch.umd.js"(exports, module2) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports, require_node_polyfill()) : typeof define === "function" && define.amd ? define(["exports", "cross-fetch/polyfill"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.window = global2.window || {}));
    })(exports, function(exports2) {
      "use strict";
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }
      var __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s2, i = 1, n = arguments.length; i < n; i++) {
            s2 = arguments[i];
            for (var p in s2)
              if (Object.prototype.hasOwnProperty.call(s2, p))
                t[p] = s2[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      function __generator(thisArg, body) {
        var _ = {label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: []}, f, y, t, g;
        return g = {next: verb(0), "throw": verb(1), "return": verb(2)}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return {value: op[1], done: false};
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return {value: op[0] ? op[1] : void 0, done: true};
        }
      }
      var MeiliSearchError = function(_super) {
        __extends(MeiliSearchError2, _super);
        function MeiliSearchError2(message) {
          var _this = _super.call(this, message) || this;
          _this.name = "MeiliSearchError";
          _this.type = "MeiliSearchError";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchError2);
          }
          return _this;
        }
        return MeiliSearchError2;
      }(Error);
      var MeiliSearchTimeOutError = function(_super) {
        __extends(MeiliSearchTimeOutError2, _super);
        function MeiliSearchTimeOutError2(message) {
          var _this = _super.call(this, message) || this;
          _this.name = "MeiliSearchTimeOutError";
          _this.type = _this.constructor.name;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchTimeOutError2);
          }
          return _this;
        }
        return MeiliSearchTimeOutError2;
      }(Error);
      function removeUndefinedFromObject(obj) {
        return Object.entries(obj).reduce(function(acc, curEntry) {
          var key = curEntry[0], val = curEntry[1];
          if (val !== void 0)
            acc[key] = val;
          return acc;
        }, {});
      }
      function sleep(ms) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [
                  4,
                  new Promise(function(resolve2) {
                    return setTimeout(resolve2, ms);
                  })
                ];
              case 1:
                return [
                  2,
                  _a.sent()
                ];
            }
          });
        });
      }
      var MeiliSearchCommunicationError = function(_super) {
        __extends(MeiliSearchCommunicationError2, _super);
        function MeiliSearchCommunicationError2(message, body) {
          var _this = _super.call(this, message) || this;
          _this.name = "MeiliSearchCommunicationError";
          _this.type = "MeiliSearchCommunicationError";
          if (body instanceof Response) {
            _this.message = body.statusText;
            _this.statusCode = body.status;
          }
          if (body instanceof Error) {
            _this.errno = body.errno;
            _this.code = body.code;
          }
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchCommunicationError2);
          }
          return _this;
        }
        return MeiliSearchCommunicationError2;
      }(Error);
      var MeiliSearchApiError = function(_super) {
        __extends(class_1, _super);
        function class_1(error3, status) {
          var _this = _super.call(this, error3.message) || this;
          _this.type = "MeiliSearchApiError";
          _this.name = "MeiliSearchApiError";
          _this.errorCode = error3.errorCode;
          _this.errorType = error3.errorType;
          _this.errorLink = error3.errorLink;
          _this.message = error3.message;
          _this.httpStatus = status;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeiliSearchApiError);
          }
          return _this;
        }
        return class_1;
      }(Error);
      function httpResponseErrorHandler(response) {
        return __awaiter(this, void 0, void 0, function() {
          var err;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                if (!!response.ok)
                  return [
                    3,
                    5
                  ];
                err = void 0;
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3, , 4]);
                return [
                  4,
                  response.json()
                ];
              case 2:
                err = _a.sent();
                return [
                  3,
                  4
                ];
              case 3:
                _a.sent();
                throw new MeiliSearchCommunicationError(response.statusText, response);
              case 4:
                throw new MeiliSearchApiError(err, response.status);
              case 5:
                return [
                  2,
                  response
                ];
            }
          });
        });
      }
      function httpErrorHandler(response) {
        if (response.type !== "MeiliSearchApiError") {
          throw new MeiliSearchCommunicationError(response.message, response);
        }
        throw response;
      }
      var HttpRequests = function() {
        function HttpRequests2(config) {
          this.headers = __assign(__assign(__assign({}, config.headers || {}), {
            "Content-Type": "application/json"
          }), config.apiKey ? {
            "X-Meili-API-Key": config.apiKey
          } : {});
          this.url = new URL(config.host);
        }
        HttpRequests2.addTrailingSlash = function(url) {
          if (!url.endsWith("/")) {
            url += "/";
          }
          return url;
        };
        HttpRequests2.prototype.request = function(_a) {
          var method = _a.method, url = _a.url, params = _a.params, body = _a.body, config = _a.config;
          return __awaiter(this, void 0, void 0, function() {
            var constructURL, queryParams_1, response, parsedBody, parsedJson, e_1;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _b.trys.push([0, 3, , 4]);
                  constructURL = new URL(url, this.url);
                  if (params) {
                    queryParams_1 = new URLSearchParams();
                    Object.keys(params).filter(function(x) {
                      return params[x] !== null;
                    }).map(function(x) {
                      return queryParams_1.set(x, params[x]);
                    });
                    constructURL.search = queryParams_1.toString();
                  }
                  return [
                    4,
                    fetch(constructURL.toString(), __assign(__assign({}, config), {
                      method,
                      body: body ? JSON.stringify(body) : void 0,
                      headers: this.headers
                    })).then(function(res) {
                      return httpResponseErrorHandler(res);
                    })
                  ];
                case 1:
                  response = _b.sent();
                  return [
                    4,
                    response.text()
                  ];
                case 2:
                  parsedBody = _b.sent();
                  try {
                    parsedJson = JSON.parse(parsedBody);
                    return [
                      2,
                      parsedJson
                    ];
                  } catch (_) {
                    return [
                      2
                    ];
                  }
                  return [
                    3,
                    4
                  ];
                case 3:
                  e_1 = _b.sent();
                  httpErrorHandler(e_1);
                  return [
                    3,
                    4
                  ];
                case 4:
                  return [
                    2
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype.get = function(url, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "GET",
                      url,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype.post = function(url, data, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "POST",
                      url,
                      body: data,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype.put = function(url, data, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "PUT",
                      url,
                      body: data,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        HttpRequests2.prototype["delete"] = function(url, data, params, config) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.request({
                      method: "DELETE",
                      url,
                      body: data,
                      params,
                      config
                    })
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        return HttpRequests2;
      }();
      var Index = function() {
        function Index2(config, uid, primaryKey) {
          this.uid = uid;
          this.primaryKey = primaryKey;
          this.httpRequest = new HttpRequests(config);
        }
        Index2.getApiRoutes = function() {
          return Index2.apiRoutes;
        };
        Index2.getRouteConstructors = function() {
          return Index2.routeConstructors;
        };
        Index2.prototype.getUpdateStatus = function(updateId) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getUpdateStatus(this.uid, updateId);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.waitForPendingUpdate = function(updateId, _a) {
          var _b = _a === void 0 ? {} : _a, _c = _b.timeOutMs, timeOutMs = _c === void 0 ? 5e3 : _c, _d = _b.intervalMs, intervalMs = _d === void 0 ? 50 : _d;
          return __awaiter(this, void 0, void 0, function() {
            var startingTime, response;
            return __generator(this, function(_e) {
              switch (_e.label) {
                case 0:
                  startingTime = Date.now();
                  _e.label = 1;
                case 1:
                  if (!(Date.now() - startingTime < timeOutMs))
                    return [
                      3,
                      4
                    ];
                  return [
                    4,
                    this.getUpdateStatus(updateId)
                  ];
                case 2:
                  response = _e.sent();
                  if (response.status !== "enqueued")
                    return [
                      2,
                      response
                    ];
                  return [
                    4,
                    sleep(intervalMs)
                  ];
                case 3:
                  _e.sent();
                  return [
                    3,
                    1
                  ];
                case 4:
                  throw new MeiliSearchTimeOutError("timeout of " + timeOutMs + "ms has exceeded on process " + updateId + " when waiting for pending update to resolve.");
              }
            });
          });
        };
        Index2.prototype.getAllUpdateStatus = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getAllUpdateStatus(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.search = function(query, options2, method, config) {
          if (method === void 0) {
            method = "POST";
          }
          return __awaiter(this, void 0, void 0, function() {
            var url, params, getParams;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.search(this.uid);
                  params = {
                    q: query,
                    offset: options2 === null || options2 === void 0 ? void 0 : options2.offset,
                    limit: options2 === null || options2 === void 0 ? void 0 : options2.limit,
                    cropLength: options2 === null || options2 === void 0 ? void 0 : options2.cropLength,
                    filters: options2 === null || options2 === void 0 ? void 0 : options2.filters,
                    matches: options2 === null || options2 === void 0 ? void 0 : options2.matches,
                    facetFilters: options2 === null || options2 === void 0 ? void 0 : options2.facetFilters,
                    facetsDistribution: options2 === null || options2 === void 0 ? void 0 : options2.facetsDistribution,
                    attributesToRetrieve: options2 === null || options2 === void 0 ? void 0 : options2.attributesToRetrieve,
                    attributesToCrop: options2 === null || options2 === void 0 ? void 0 : options2.attributesToCrop,
                    attributesToHighlight: options2 === null || options2 === void 0 ? void 0 : options2.attributesToHighlight
                  };
                  if (!(method.toUpperCase() === "POST"))
                    return [
                      3,
                      2
                    ];
                  return [
                    4,
                    this.httpRequest.post(url, removeUndefinedFromObject(params), void 0, config)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
                case 2:
                  if (!(method.toUpperCase() === "GET"))
                    return [
                      3,
                      4
                    ];
                  getParams = __assign(__assign({}, params), {
                    facetFilters: Array.isArray(options2 === null || options2 === void 0 ? void 0 : options2.facetFilters) && (options2 === null || options2 === void 0 ? void 0 : options2.facetFilters) ? JSON.stringify(options2.facetFilters) : void 0,
                    facetsDistribution: (options2 === null || options2 === void 0 ? void 0 : options2.facetsDistribution) ? JSON.stringify(options2.facetsDistribution) : void 0,
                    attributesToRetrieve: (options2 === null || options2 === void 0 ? void 0 : options2.attributesToRetrieve) ? options2.attributesToRetrieve.join(",") : void 0,
                    attributesToCrop: (options2 === null || options2 === void 0 ? void 0 : options2.attributesToCrop) ? options2.attributesToCrop.join(",") : void 0,
                    attributesToHighlight: (options2 === null || options2 === void 0 ? void 0 : options2.attributesToHighlight) ? options2.attributesToHighlight.join(",") : void 0
                  });
                  return [
                    4,
                    this.httpRequest.get(url, removeUndefinedFromObject(getParams), config)
                  ];
                case 3:
                  return [
                    2,
                    _a.sent()
                  ];
                case 4:
                  throw new MeiliSearchError("method parameter should be either POST or GET");
              }
            });
          });
        };
        Index2.prototype.getRawInfo = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url, res;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.indexRoute(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  res = _a.sent();
                  this.primaryKey = res.primaryKey;
                  return [
                    2,
                    res
                  ];
              }
            });
          });
        };
        Index2.prototype.fetchInfo = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.getRawInfo()
                  ];
                case 1:
                  _a.sent();
                  return [
                    2,
                    this
                  ];
              }
            });
          });
        };
        Index2.prototype.fetchPrimaryKey = function() {
          return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  _a = this;
                  return [
                    4,
                    this.getRawInfo()
                  ];
                case 1:
                  _a.primaryKey = _b.sent().primaryKey;
                  return [
                    2,
                    this.primaryKey
                  ];
              }
            });
          });
        };
        Index2.create = function(config, uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var url, req, index2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.apiRoutes.indexes;
                  req = new HttpRequests(config);
                  return [
                    4,
                    req.post(url, __assign(__assign({}, options2), {
                      uid
                    }))
                  ];
                case 1:
                  index2 = _a.sent();
                  return [
                    2,
                    new Index2(config, uid, index2.primaryKey)
                  ];
              }
            });
          });
        };
        Index2.prototype.update = function(data) {
          return __awaiter(this, void 0, void 0, function() {
            var url, index2;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.update(this.uid);
                  return [
                    4,
                    this.httpRequest.put(url, data)
                  ];
                case 1:
                  index2 = _a.sent();
                  this.primaryKey = index2.primaryKey;
                  return [
                    2,
                    this
                  ];
              }
            });
          });
        };
        Index2.prototype["delete"] = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors["delete"](this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getStats = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = "/indexes/" + this.uid + "/stats";
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDocuments = function(options2) {
          return __awaiter(this, void 0, void 0, function() {
            var url, attr;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getDocuments(this.uid);
                  if (options2 !== void 0 && Array.isArray(options2.attributesToRetrieve)) {
                    attr = options2.attributesToRetrieve.join(",");
                  }
                  return [
                    4,
                    this.httpRequest.get(url, __assign(__assign({}, options2), attr !== void 0 ? {
                      attributesToRetrieve: attr
                    } : {}))
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDocument = function(documentId) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getDocument(this.uid, documentId);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.addDocuments = function(documents, options2) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.addDocuments(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, documents, options2)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateDocuments = function(documents, options2) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateDocuments(this.uid);
                  return [
                    4,
                    this.httpRequest.put(url, documents, options2)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteDocument = function(documentId) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.deleteDocument(this.uid, documentId);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteDocuments = function(documentsIds) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.deleteDocuments(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, documentsIds)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.deleteAllDocuments = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.deleteAllDocuments(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getSettings = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getSettings(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateSettings = function(settings) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateSettings(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, settings)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetSettings = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetSettings(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getSynonyms = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getSynonyms(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateSynonyms = function(synonyms) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateSynonyms(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, synonyms)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetSynonyms = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetSynonyms(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getStopWords = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getStopWords(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateStopWords = function(stopWords) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateStopWords(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, stopWords)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetStopWords = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetStopWords(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getRankingRules = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getRankingRules(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateRankingRules = function(rankingRules) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateRankingRules(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, rankingRules)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetRankingRules = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetRankingRules(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDistinctAttribute = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getDistinctAttribute(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateDistinctAttribute = function(distinctAttribute) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateDistinctAttribute(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, distinctAttribute)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetDistinctAttribute = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetDistinctAttribute(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getAttributesForFaceting = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getAttributesForFaceting(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateAttributesForFaceting = function(attributesForFaceting) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateAttributesForFaceting(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, attributesForFaceting)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetAttributesForFaceting = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetAttributesForFaceting(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getSearchableAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getSearchableAttributes(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateSearchableAttributes = function(searchableAttributes) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateSearchableAttributes(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, searchableAttributes)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetSearchableAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetSearchableAttributes(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.getDisplayedAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.getDisplayedAttributes(this.uid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.updateDisplayedAttributes = function(displayedAttributes) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.updateDisplayedAttributes(this.uid);
                  return [
                    4,
                    this.httpRequest.post(url, displayedAttributes)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.prototype.resetDisplayedAttributes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = Index2.routeConstructors.resetDisplayedAttributes(this.uid);
                  return [
                    4,
                    this.httpRequest["delete"](url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        Index2.apiRoutes = {
          indexes: "indexes"
        };
        Index2.routeConstructors = {
          indexRoute: function indexRoute(indexUid) {
            return Index2.apiRoutes.indexes + "/" + indexUid;
          },
          getUpdateStatus: function getUpdateStatus(indexUid, updateId) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/" + ("updates/" + updateId);
          },
          getAllUpdateStatus: function getAllUpdateStatus(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/updates";
          },
          search: function search(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/search";
          },
          getRawInfo: function getRawInfo(indexUid) {
            return "indexes/" + indexUid;
          },
          update: function update(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid);
          },
          "delete": function _delete(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid);
          },
          getStats: function getStats(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/stats";
          },
          getDocument: function getDocument(indexUid, documentId) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/" + ("documents/" + documentId);
          },
          getDocuments: function getDocuments(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/documents";
          },
          addDocuments: function addDocuments(indexUid) {
            return Index2.routeConstructors.getDocuments(indexUid);
          },
          updateDocuments: function updateDocuments(indexUid) {
            return Index2.routeConstructors.getDocuments(indexUid);
          },
          deleteAllDocuments: function deleteAllDocuments(indexUid) {
            return Index2.routeConstructors.getDocuments(indexUid);
          },
          deleteDocument: function deleteDocument(indexUid, documentId) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/" + ("documents/" + documentId);
          },
          deleteDocuments: function deleteDocuments(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/documents/delete-batch";
          },
          getSettings: function getSettings(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings";
          },
          updateSettings: function updateSettings(indexUid) {
            return Index2.routeConstructors.getSettings(indexUid);
          },
          resetSettings: function resetSettings(indexUid) {
            return Index2.routeConstructors.getSettings(indexUid);
          },
          getSynonyms: function getSynonyms(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/synonyms";
          },
          updateSynonyms: function updateSynonyms(indexUid) {
            return Index2.routeConstructors.getSynonyms(indexUid);
          },
          resetSynonyms: function resetSynonyms(indexUid) {
            return Index2.routeConstructors.getSynonyms(indexUid);
          },
          getStopWords: function getStopWords(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/stop-words";
          },
          updateStopWords: function updateStopWords(indexUid) {
            return Index2.routeConstructors.getStopWords(indexUid);
          },
          resetStopWords: function resetStopWords(indexUid) {
            return Index2.routeConstructors.getStopWords(indexUid);
          },
          getRankingRules: function getRankingRules(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/ranking-rules";
          },
          updateRankingRules: function updateRankingRules(indexUid) {
            return Index2.routeConstructors.getRankingRules(indexUid);
          },
          resetRankingRules: function resetRankingRules(indexUid) {
            return Index2.routeConstructors.getRankingRules(indexUid);
          },
          getDistinctAttribute: function getDistinctAttribute(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/distinct-attribute";
          },
          updateDistinctAttribute: function updateDistinctAttribute(indexUid) {
            return Index2.routeConstructors.getDistinctAttribute(indexUid);
          },
          resetDistinctAttribute: function resetDistinctAttribute(indexUid) {
            return Index2.routeConstructors.getDistinctAttribute(indexUid);
          },
          getAttributesForFaceting: function getAttributesForFaceting(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/attributes-for-faceting";
          },
          updateAttributesForFaceting: function updateAttributesForFaceting(indexUid) {
            return Index2.routeConstructors.getAttributesForFaceting(indexUid);
          },
          resetAttributesForFaceting: function resetAttributesForFaceting(indexUid) {
            return Index2.routeConstructors.getAttributesForFaceting(indexUid);
          },
          getSearchableAttributes: function getSearchableAttributes(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/searchable-attributes";
          },
          updateSearchableAttributes: function updateSearchableAttributes(indexUid) {
            return Index2.routeConstructors.getSearchableAttributes(indexUid);
          },
          resetSearchableAttributes: function resetSearchableAttributes(indexUid) {
            return Index2.routeConstructors.getSearchableAttributes(indexUid);
          },
          getDisplayedAttributes: function getDisplayedAttributes(indexUid) {
            return Index2.routeConstructors.indexRoute(indexUid) + "/settings/displayed-attributes";
          },
          updateDisplayedAttributes: function updateDisplayedAttributes(indexUid) {
            return Index2.routeConstructors.getDisplayedAttributes(indexUid);
          },
          resetDisplayedAttributes: function resetDisplayedAttributes(indexUid) {
            return Index2.routeConstructors.getDisplayedAttributes(indexUid);
          }
        };
        return Index2;
      }();
      var MeiliSearch2 = function() {
        function MeiliSearch3(config) {
          config.host = HttpRequests.addTrailingSlash(config.host);
          this.config = config;
          this.httpRequest = new HttpRequests(config);
        }
        MeiliSearch3.getApiRoutes = function() {
          return MeiliSearch3.apiRoutes;
        };
        MeiliSearch3.getRouteConstructors = function() {
          return MeiliSearch3.routeConstructors;
        };
        MeiliSearch3.prototype.index = function(indexUid) {
          return new Index(this.config, indexUid);
        };
        MeiliSearch3.prototype.getIndex = function(indexUid) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [
                2,
                new Index(this.config, indexUid).fetchInfo()
              ];
            });
          });
        };
        MeiliSearch3.prototype.getOrCreateIndex = function(uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            var index2, e_1;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [
                    4,
                    this.getIndex(uid)
                  ];
                case 1:
                  index2 = _a.sent();
                  return [
                    2,
                    index2
                  ];
                case 2:
                  e_1 = _a.sent();
                  if (e_1.errorCode === "index_not_found") {
                    return [
                      2,
                      this.createIndex(uid, options2)
                    ];
                  }
                  throw new MeiliSearchApiError(e_1, e_1.status);
                case 3:
                  return [
                    2
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.listIndexes = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = MeiliSearch3.apiRoutes.listIndexes;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.createIndex = function(uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    Index.create(this.config, uid, options2)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.updateIndex = function(uid, options2) {
          if (options2 === void 0) {
            options2 = {};
          }
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [
                2,
                new Index(this.config, uid).update(options2)
              ];
            });
          });
        };
        MeiliSearch3.prototype.deleteIndex = function(uid) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [
                2,
                new Index(this.config, uid)["delete"]()
              ];
            });
          });
        };
        MeiliSearch3.prototype.getKeys = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = MeiliSearch3.apiRoutes.getKeys;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.health = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [
                    4,
                    this.httpRequest.get(MeiliSearch3.apiRoutes.health)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.isHealthy = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  _a.trys.push([0, 2, , 3]);
                  return [
                    4,
                    this.httpRequest.get(MeiliSearch3.apiRoutes.health)
                  ];
                case 1:
                  _a.sent();
                  return [
                    2,
                    true
                  ];
                case 2:
                  _a.sent();
                  return [
                    2,
                    false
                  ];
                case 3:
                  return [
                    2
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.stats = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = MeiliSearch3.apiRoutes.stats;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.version = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = MeiliSearch3.apiRoutes.version;
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.createDump = function() {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = MeiliSearch3.apiRoutes.createDump;
                  return [
                    4,
                    this.httpRequest.post(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.prototype.getDumpStatus = function(dumpUid) {
          return __awaiter(this, void 0, void 0, function() {
            var url;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  url = MeiliSearch3.routeConstructors.getDumpStatus(dumpUid);
                  return [
                    4,
                    this.httpRequest.get(url)
                  ];
                case 1:
                  return [
                    2,
                    _a.sent()
                  ];
              }
            });
          });
        };
        MeiliSearch3.apiRoutes = {
          listIndexes: "indexes",
          getKeys: "keys",
          health: "health",
          stats: "stats",
          version: "version",
          createDump: "dumps"
        };
        MeiliSearch3.routeConstructors = {
          getDumpStatus: function getDumpStatus(dumpUid) {
            return "dumps/" + dumpUid + "/status";
          }
        };
        return MeiliSearch3;
      }();
      exports2.MeiliSearch = MeiliSearch2;
      Object.defineProperty(exports2, "__esModule", {value: true});
    });
  }
});

// .svelte-kit/vercel/entry.js
__markAsModule(exports);
__export(exports, {
  default: () => entry_default
});

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.107_svelte@3.38.2/node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      fulfil(null);
      return;
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    let data;
    if (!isNaN(length)) {
      data = new Uint8Array(length);
      let i = 0;
      req.on("data", (chunk) => {
        data.set(chunk, i);
        i += chunk.length;
      });
    } else {
      if (h["transfer-encoding"] === void 0) {
        fulfil(null);
        return;
      }
      data = new Uint8Array(0);
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h["content-type"].split(/;\s*/);
      if (type === "application/octet-stream") {
        fulfil(data);
      }
      const decoder = new TextDecoder(h["content-encoding"] || "utf-8");
      fulfil(decoder.decode(data));
    });
  });
}

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.107_svelte@3.38.2/node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var {Readable} = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const {size} = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], {type: String(type).toLowerCase()});
    Object.assign(wm.get(blob), {size: span, parts: blobParts});
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: {enumerable: true},
  type: {enumerable: true},
  slice: {enumerable: true}
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const {buffer, byteOffset, byteLength} = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: {enumerable: true},
  bodyUsed: {enumerable: true},
  arrayBuffer: {enumerable: true},
  blob: {enumerable: true},
  json: {enumerable: true},
  text: {enumerable: true}
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let {body} = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let {body} = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({highWaterMark});
    p2 = new import_stream.PassThrough({highWaterMark});
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const {body} = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, {body}) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_HTTP_TOKEN"});
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", {value: "ERR_INVALID_CHAR"});
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = {enumerable: true};
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response2 = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response2(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response2(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response2.prototype, {
  url: {enumerable: true},
  status: {enumerable: true},
  ok: {enumerable: true},
  redirected: {enumerable: true},
  statusText: {enumerable: true},
  headers: {enumerable: true},
  clone: {enumerable: true}
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: {enumerable: true},
  url: {enumerable: true},
  headers: {enumerable: true},
  redirect: {enumerable: true},
  clone: {enumerable: true},
  signal: {enumerable: true}
});
var getNodeRequestOptions = (request) => {
  const {parsedURL} = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let {agent} = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response2(data, {headers: {"Content-Type": data.typeFull}});
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const {signal} = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch2(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
globalThis.fetch = fetch2;
globalThis.Response = Response2;
globalThis.Request = Request;
globalThis.Headers = Headers;

// node_modules/.pnpm/@sveltejs+kit@1.0.0-next.107_svelte@3.38.2/node_modules/@sveltejs/kit/dist/ssr.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set, update, subscribe};
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (branch) {
    branch.forEach(({node, loaded, fetched, uses_credentials}) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({node}) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = {head: "", html: "", css: {code: "", map: null}};
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"></script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${branch.map(({node}) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page.path)},
						query: new URLSearchParams(${s$1(page.query.toString())}),
						params: ${s$1(page.params)}
					}
				}` : "null"}
			});
		</script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({url, body: body2, json}) => {
    return body2 ? `<script type="svelte-data" url="${url}" body="${hash(body2)}">${json}</script>` : `<script type="svelte-data" url="${url}">${json}</script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({head, body})
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const {name, message, stack} = error3;
    serialized = try_serialize({name, message, stack});
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return {status: 500, error: error3};
    }
    return {status, error: error3};
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const {module: module2} = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url)) {
          response = await fetch(url, opts);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new Response(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await fetch(`http://${page.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers = {...opts.headers};
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers.cookie = request.headers.cookie;
              if (!headers.authorization) {
                headers.authorization = request.headers.authorization;
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new Response(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: {...context}
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({request, options: options2, state, $session, status, error: error3}) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (error4) {
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({request, options: options2, state, $session, route}) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({status, error: error3} = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page
    });
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({...request, params});
    if (response) {
      if (typeof response !== "object") {
        return error(`Invalid response from route ${request.path}: expected an object, got ${typeof response}`);
      }
      let {status = 200, body, headers = {}} = response;
      headers = lowercase_keys(headers);
      const type = headers["content-type"];
      if (type === "application/octet-stream" && !(body instanceof Uint8Array)) {
        return error(`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`);
      }
      if (body instanceof Uint8Array && type !== "application/octet-stream") {
        return error(`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`);
      }
      let normalized_body;
      if (typeof body === "object" && (!type || type === "application/json")) {
        headers = {...headers, "content-type": "application/json"};
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      return {status, body: normalized_body, headers};
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield key;
      }
    }
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value;
      }
    }
  }
};
function parse_body(req) {
  const raw = req.rawBody;
  if (!raw)
    return raw;
  const [type, ...directives] = req.headers["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const {data, append} = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const {data, append} = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers: lowercase_keys(incoming.headers),
        body: parse_body(incoming),
        params: null,
        locals: {}
      },
      render: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: {ssr: false, router: true, hydrate: true},
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// node_modules/.pnpm/svelte@3.38.2/node_modules/svelte/internal/index.mjs
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var tasks = new Set();
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({$$});
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, {$$slots = {}, context = new Map()} = {}) => {
      on_destroy = [];
      const result = {title: "", head: "", css: new Set()};
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
    }
    connectedCallback() {
      const {on_mount} = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// .svelte-kit/output/server/app.js
var import_meilisearch = __toModule(require_meilisearch_umd());
var css = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n</script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {stores} = $$props;
  let {page} = $$props;
  let {components} = $$props;
  let {props_0 = null} = $$props;
  let {props_1 = null} = $$props;
  let {props_2 = null} = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1pdgbjn"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({head, body}) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.ico" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
function init(settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-d40e0f6a.js",
      css: ["/./_app/assets/start-0826e215.css"],
      js: ["/./_app/start-d40e0f6a.js", "/./_app/chunks/vendor-7e9bbbe2.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{"file": "favicon.ico", "size": 1150, "type": "image/vnd.microsoft.icon"}, {"file": "robots.txt", "size": 67, "type": "text/plain"}, {"file": "svelte-welcome.png", "size": 360807, "type": "image/png"}, {"file": "svelte-welcome.webp", "size": 115470, "type": "image/webp"}],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({request, render: render2}) => render2(request))
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = {"src/routes/__layout.svelte": {"entry": "/./_app/pages/__layout.svelte-2b7bf193.js", "css": ["/./_app/assets/pages/__layout.svelte-39eaa565.css"], "js": ["/./_app/pages/__layout.svelte-2b7bf193.js", "/./_app/chunks/vendor-7e9bbbe2.js"], "styles": null}, ".svelte-kit/build/components/error.svelte": {"entry": "/./_app/error.svelte-b2609296.js", "css": [], "js": ["/./_app/error.svelte-b2609296.js", "/./_app/chunks/vendor-7e9bbbe2.js"], "styles": null}, "src/routes/index.svelte": {"entry": "/./_app/pages/index.svelte-c8bb1336.js", "css": [], "js": ["/./_app/pages/index.svelte-c8bb1336.js", "/./_app/chunks/vendor-7e9bbbe2.js"], "styles": null}};
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
init({paths: {"base": "", "assets": "/."}});
function render(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond({...request, host}, options, {prerender: prerender2});
}
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({error: error22, status}) {
  return {props: {error: error22, status}};
}
var Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let {status} = $$props;
  let {error: error22} = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<p>${escape2(error22.message)}</p>


${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error2,
  load
});
var secToMins = (seconds) => {
  const minutes = seconds / 60;
  const totMins = minutes.toFixed(2);
  const number = totMins.replace(".", ":");
  return number;
};
var randomQuery = [
  "santa man",
  "teaser freezer",
  "chef kevin",
  "moriarty",
  "scoop troop",
  "eggnog",
  "gmail roulette",
  "speak on that",
  "ice bucket challenge",
  "cards against humanity",
  "engineer cody boy",
  "i love you and i'm in love with you",
  "guardians of the galaxy",
  "teen pope",
  "bosch",
  "homemade water",
  "doughboys"
];
var getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
var EpList = [
  {
    id: "1",
    title: "Jake Johnson, Our Close Friend",
    pubDate: "Mon, 07 Oct 2013 10:00:00 GMT",
    description: `Sean and Hayes take us through their respective journeys and share how they became two A-List it boys. They do a quick recap of the Emmys by discussing Steve Levitan's message during his acceptance speech and open up the "Teaser Freezer" as they analyze the teaser for Regular Joe's "Don Jon." Then, the boys welcome JAKE JOHNSON of the News Girl who tells us how he gets into the "funny zone" by reaching into the "Popcorn Gallery" and performs a scene from the News Girl by hopping into the "Scene Machine." `,
    isoDate: "2013-10-07T10:00:00.000Z"
  },
  {
    id: "2",
    title: "Blake Anderson, Our Close Friend",
    pubDate: "Mon, 14 Oct 2013 10:00:00 GMT",
    description: `Sean and Hayes respond to all of the recent criticism they've received from the haters by opening up the "Celebrity Burn Journal." They'll let us know which TV shows are the funniest of the funny during the "Survival of The Funniest" and explain the VOD revolution in a segment called "OMG VOD." Then, BLAKE ANDERSON of Workofholics drops by to answer some questions about the writing process behind his show, tells us how he likes to relax, and shares why he never turns the funny off. `,
    isoDate: "2013-10-14T10:00:00.000Z"
  },
  {
    id: "3",
    title: "Donald Glover, Our Close Friend",
    pubDate: "Mon, 21 Oct 2013 10:00:00 GMT",
    description: `Sean and Hayes discuss the well deserved buzz around Scarlett Johnson's performance in the Spike Jonze's "Her." Then, DONALD GLOVER of Mystery Boys, Communion, and The Do Do List stops by to make a really big announcement and give some tips on how to recover from a tanking improv scene. `,
    isoDate: "2013-10-21T10:00:00.000Z"
  },
  {
    id: "4",
    title: "Adam Pally, Our Close Friend",
    pubDate: "Mon, 28 Oct 2013 10:00:00 GMT",
    description: `Sean and Hayes share their thoughts on the new "Batman," explain why Halloween is too commercial, and tell us how their adventures have inspired many films during their segment "The Right Stuff." Then, ADAM PALLY of The Mimby Project, The Happy Enders, and Saving Woodstock drops by to give listeners a scoop on what a day on the set of The Mimby Project is like, answer Sean & Hayes\u2019 question regarding sports on TV, and explain why he doesn't pull any pranks on the set. `,
    isoDate: "2013-10-28T10:00:00.000Z"
  },
  {
    id: "5",
    title: "Paul F. Tompkins, Our Close Friend",
    pubDate: "Mon, 04 Nov 2013 08:00:00 GMT",
    description: `Sean and Hayes share some of their stories from their friendship with Louis Reed and why they are the only ones who have the right to be sad about his death. Then they reopen the Teaser Freezer to dish on the teaser for "That Awkward Moment," starring Zac Afrin and Michael B. Jordan. Finally, PAUL F. TOMPKINS fills in at the last second to recall stories of the Honolulu underground comedy scene, tell us the difference between standup and funny movies, spill secrets of the 'cast biz, and answer some piping hot questions from the Popcorn Gallery. `,
    isoDate: "2013-11-04T08:00:00.000Z"
  },
  {
    id: "6",
    title: "Paul Rust, Our Close Friend",
    pubDate: "Mon, 11 Nov 2013 08:00:00 GMT",
    description: "Sean and Hayes reveal the real next gen power players of the biz by going through their list of 15 Under 15 Hollywood Up and Comers. Then they educate listeners on what role each 10 Percentary brings to the table during 10 Percentary Elementary. Finally, PAUL RUST does us a solid by dropping by to reminisce about his famous flash mobs, tells us  how he stays connected to the world outside of his funny glasses, performs some of his KTLA 5 10 Second Movie Reviews, speaks on working with Quentin Tarankillam on Inglourious Bees, and shares an embarrassing Hollywood moment while answering hard hitting questions from the Popcorn Gallery. ",
    isoDate: "2013-11-11T08:00:00.000Z"
  },
  {
    id: "7",
    title: "Ellie Kemper, Our Close Friend",
    pubDate: "Mon, 18 Nov 2013 08:00:00 GMT",
    description: "Sean and Hayes throw back the curtains on the industry by playing a game of Gmail Roulette and prepare listeners for any type of Hollywood meeting during Let\u2019s Do Lunching. Then, ELLIE KEMPER graciously lends us her time as she recalls old Hollywood Game Nights, chooses her favorite sitcom pitches while playing a game of Ellie-Vator Pitch, tells us if it\u2019s nice to be given clothes to act in, and shares how she\u2019s preparing for her upcoming portrayal of Lady Gaga. ",
    isoDate: "2013-11-18T08:00:00.000Z"
  },
  {
    id: "8",
    title: "Damien Fahey, Our Close Friend",
    pubDate: "Mon, 25 Nov 2013 08:00:00 GMT",
    description: "Sean and Hayes describe their favorite online grocery store TV shows and reveal the truth behind salacious Hollywood events as they read some blind items during Draw The Blinds Up. Then, DAMIEN FAHEY arrives to recall how Sean & Hayes ushered in the new age of music being associated with visual entertainment back when he hosted TRL, dish on who came to him for music video ideas, and cools off by offering nickname tips while answering questions from the Popcorn Gallery. ",
    isoDate: "2013-11-25T08:00:00.000Z"
  },
  {
    id: "9",
    title: "Michael Showalter, Our Close Friend",
    pubDate: "Mon, 02 Dec 2013 08:00:00 GMT",
    description: "Sean and Hayes help out Engineer Cody in another edition of Engineer My Career and reveal the truth on what really went on behind the scenes while filming The Godfather during Uncommon Commentary. Finally, MICHAEL SHOWALTER drops by to talk about joining the Earwolf family, recall how he had to kick Sean & Hayes out of The State, speak on the pressures of going in and out of the funny zone, share some of his favorite restaurants in town, and explain his decision to become Mr. Crystal Light. ",
    isoDate: "2013-12-02T08:00:00.000Z"
  },
  {
    id: "10",
    title: "Kyle Newacheck, Our Close Friend",
    pubDate: "Mon, 09 Dec 2013 08:00:00 GMT",
    description: "Sean and Hayes remember the late Nelson Mandela during That\u2019s A Wrap and talk about the other side of the business known as The Hobbies. Later, KYLE NEWACHECK (director/star of Workofholics) stops by to speak on his earlier Hong Kong action films, living the studio life, his time as a film teacher, and co-directing an upcoming film with Nathan Lane. ",
    isoDate: "2013-12-09T08:00:00.000Z"
  },
  {
    id: "11",
    title: "Jake Fogelnest, Our Close Friend",
    pubDate: "Mon, 16 Dec 2013 08:00:00 GMT",
    description: "Sean and Hayes celebrate the season of Goldie Nods by talking about how much they crushed in the comedy noms department and sharing their love of the music in the Coen bros film Inside Llewyn Davis. Then, child star JAKE FOGELNEST drops by to chat about his Hollywood upbringing, taking the Disney route, believing in the power of buzz, his big meeting with Grumpy Cat, and his role in the Third Wave podcast movement. ",
    isoDate: "2013-12-16T08:00:00.000Z"
  },
  {
    id: "12",
    title: "Ben Schwartz, Our Close Friend",
    pubDate: "Mon, 23 Dec 2013 08:00:00 GMT",
    description: "Sean and Hayes talk about the perfect gift to give your assistant this holiday season and reward the new engineer for surprising them. Then, TV and film star BEN SCHWARTZ joins the guys to give us a little insight on some of his many famous film characters, tell us a bit about his acting for GIFs program, and share his thoughts on the digital age of scripts. ",
    isoDate: "2013-12-23T08:00:00.000Z"
  },
  {
    id: "13",
    title: "Andy Daly, Our Close Friend",
    pubDate: "Mon, 30 Dec 2013 08:00:00 GMT",
    description: "Sean and Hayes give some tips on how to get rid of your screeners the right way during Disk Tsk Tsk. Then, TV\u2019s ANDY DALY stops by to open up about moving on from The Daily Show, tell us about his upcoming podcast project, play a character guessing game called \u201CYours, Mine, or Ours,\u201D and speak on being unable to leave the funny zone as we reach into the Popcorn Gallery. ",
    isoDate: "2013-12-30T08:00:00.000Z"
  },
  {
    id: "14",
    title: "Brian Huskey, Our Close Friend",
    pubDate: "Mon, 06 Jan 2014 08:00:00 GMT",
    description: "Sean and Hayes ring in the new year with a look back at their favorite podcast moments of 2013. Then BRIAN HUSKEY joins the boys for a table read of TEEN POPE, one of Brian's many scripts currently in development at studios. ",
    isoDate: "2014-01-06T08:00:00.000Z"
  },
  {
    id: "15",
    title: "Shelby Fero, Our Close Friend",
    pubDate: "Mon, 13 Jan 2014 08:00:00 GMT",
    description: "Sean and Hayes play a scary game of Gmail Roulette, and educate their listeners with a Guide to Hosting SNL. Then Twitter celebrity and TV writer SHELBY FERO pops by to debate whether she should give back Sean's Twitter followers and trade observations with Sean and Hayes on being extremely young in show business. Finally, everyone makes some prank phone calls to some of Hollywood's hottest young stars. ",
    isoDate: "2014-01-13T08:00:00.000Z"
  },
  {
    id: "16",
    title: "Grace Helbig, Our Close Friend",
    pubDate: "Mon, 20 Jan 2014 08:00:00 GMT",
    description: "Sean and Hayes quickly dig into some blind items as they name names and Draw the Blinds Up on Hollywood\u2019s biggest stars. Then new media celeb GRACE HELBIG drops by to give listeners some tips on how to create a presence online and explain how vlogging on YouTube is very different than Saved by the Bell. Finally, Grace tells us which A-List Hollywood celebs she would most like to see fail as she reaches into the Popcorn Gallery. ",
    isoDate: "2014-01-20T08:00:00.000Z"
  },
  {
    id: "17",
    title: "Dominic Dierkes, Our Close Friend",
    pubDate: "Mon, 27 Jan 2014 08:00:00 GMT",
    description: "Sean and Hayes are back from the Sundance Film Festival to share their Top Picks for this year's Breakout Artist. Then, Sean's prot\xE9g\xE9 DOMINIC DIERKES joins the boys to discuss the ins and outs of his infamous Fart Gun sketch, make each other feel old, and speak on why there is no white history month as they reach into the Popcorn Gallery. ",
    isoDate: "2014-01-27T08:00:00.000Z"
  },
  {
    id: "18",
    title: "Lamorne Morris, Our Close Friend",
    pubDate: "Mon, 03 Feb 2014 08:00:00 GMT",
    description: 'Sean and Hayes start things off by explaining why all of their negative reviews on iTunes are incorrect in a segment called "(Buzzer Sound)! Wrong." Then they open up for a dangerous confession related to the rise of the nerds in Hollywood. Then LAMORNE MORRIS of Newb Girl joins the podcast to discuss his love for commercial films, how much money he makes, and the effect Sean and Hayes giving out part of his phone number had on his life. ',
    isoDate: "2014-02-03T08:00:00.000Z"
  },
  {
    id: "19",
    title: "Adam DeVine, Our Close Friend",
    pubDate: "Mon, 10 Feb 2014 08:00:00 GMT",
    description: "Sean and Hayes delve into the Wrangler Fly Button Jeans Hot Button Issue of the Week  by discussing the recent Woody Allen controversy. Then they say a quick bye bye to one of their comedy heroes, Sir Jason Leno. Finally, ADAM DEVINE of Workalolics joins the boys to flex his comedy dick by re-booting some classic comedy bits, doing his impression of Javier Bardem, and finishing strong with some crowd work. ",
    isoDate: "2014-02-10T08:00:00.000Z"
  },
  {
    id: "20",
    title: "Dave Holmes, Our Close Friend",
    pubDate: "Mon, 17 Feb 2014 08:00:00 GMT",
    description: 'Sean and Hayes tell listeners all about the good TV they watch it in a segment called "Who Watches The Watchmans" and revisit the "Teaser Freezer" to discuss "3 Days to Kill" starring Kevin Copsner. Then the boys are fired up to be joined by DAVE HOLMES aka the original Noid from the Domino\u2019s pizza commercials to give us a quick sample from the board game he\u2019s working on, teach the guys how to watch TV on their phones, and go back through some of his most famous MTV moments. ',
    isoDate: "2014-02-17T08:00:00.000Z"
  },
  {
    id: "21",
    title: "Nick Thune, Our Close Friend",
    pubDate: "Mon, 24 Feb 2014 08:00:00 GMT",
    description: "Sean and Hayes start out the show talking about how the Oscars are a really exciting time in Tinseltown. They share some great tips for scoring a date to the big night with an A-list celebrity. Then, cool guy NICK THUNE joins the guys to discuss movies, his personal injuries, how it's possible to do comedy and music at the same time, and jump into the popcorn gallery to discuss TV show failures and other fan questions. ",
    isoDate: "2014-02-24T08:00:00.000Z"
  },
  {
    id: "22",
    title: "Jon Gabrus, Our Close Friend",
    pubDate: "Mon, 03 Mar 2014 08:00:00 GMT",
    description: "Sean and Hayes address some fan feedback and announce some more Notscar winners. Friend of the show and Guy Code regular JON GABRUS joins the guys to discuss emotions in movies, side chicks, and viral videos. Then, the Popcorn Gallery delves into controversial topics like The Da Vinci Code, the Nerdist podcast, Pellegrino, MTV, and who to avoid at Oscar after-parties. ",
    isoDate: "2014-03-03T08:00:00.000Z"
  },
  {
    id: "23",
    title: "DC Pierson, Our Close Friend",
    pubDate: "Mon, 10 Mar 2014 10:00:00 GMT",
    description: "Sean and Hayes start the show off by discussing a trend in media lately that they love: rando humor, or comedy that comes out of nowhere! Then, close friend of the show DC PIERSON joins the guys to walk through the evolution of video, share some exclusive tips for what to do when going to auditions, and chat about learning lines, Disneyland, and how to one-up your competition in the waiting room. ",
    isoDate: "2014-03-10T10:00:00.000Z"
  },
  {
    id: "24",
    title: "Rob Corddry, Our Close Friend",
    pubDate: "Mon, 17 Mar 2014 10:00:00 GMT",
    description: "Hayes and Sean start the show off with Sneakquel Peekquel, a segment where they  go into detail on sequels for two of Hollywood's biggest hits: Two More Bigger Guns and The Girl with Two Pearl Earrings. Then, funny man ROB CORDDRY, goofy clown actor joins the guys to talk about how inherently funny children's hospitals are and the importance of always being honest, and walks through a new pilot that includes Two-Face, Chicano wives, lawnmowers, law enforcement, and car sex. ",
    isoDate: "2014-03-17T10:00:00.000Z"
  },
  {
    id: "25",
    title: "Scott Aukerman and Jeff Ullrich, Our Business Associates",
    pubDate: "Mon, 24 Mar 2014 10:00:00 GMT",
    description: 'Hayes and Sean dish on their relationship with Kanye during a round of "Snail Mail Roulade" and then give listeners a peek into the inner workings of the Earwolf machine as Scott Ankerman and Jeff Ullrich enter a live negotiation with Hayes, Sean, and their powerful team of lawyers.\xA0 ',
    isoDate: "2014-03-24T10:00:00.000Z"
  },
  {
    id: "26",
    title: "Jason Mantzoukas, Our Close Friend",
    pubDate: "Mon, 31 Mar 2014 10:00:00 GMT",
    description: 'Hayes and Sean start off by playing "6 degrees of Cabocation" and talk about Nielson hatings. Then, friend of the show JASON MANTZOUKAS stops by to talk about expectations in a relationship, hanging around the office on his unknown Earwolf podcast "How did this get made?", Phoenix-fest, how superior laser discs are, and Ride Along. ',
    isoDate: "2014-03-31T10:00:00.000Z"
  },
  {
    id: "27",
    title: "Joe Wengert, Our Close Friend",
    pubDate: "Mon, 07 Apr 2014 10:00:00 GMT",
    description: "Sean and Hayes start off by discussing this week's biggest question: Who is going to replace Letterman when he leaves and should you make a list about it? Then, very good friend of the show JOE WENGERT stops by to talk about what it was like to do a standup special, joke set-ups, plot holes, mic styles, Pierce Brosnan, and blue jeans. Also, stop holding your breath- the Popcorn Gallery is back with more thoughtful and poignant questions.\xA0This episode is sponsored by Audible.com. Go to audible.com/hollywood for a free audio book and 30 day free trial. ",
    isoDate: "2014-04-07T10:00:00.000Z"
  },
  {
    id: "28",
    title: "Zach Gilford, Our Close Friend",
    pubDate: "Mon, 14 Apr 2014 10:00:00 GMT",
    description: 'The Hollywood Handbook guys start off with some tips on how to pitch a movie in the segment "Pitch Perfectly", with topics like writing yourself into scripts and classic beach pranks. Then ZACH GILFORD from Friday Night Lights shows up to complain about how annoying film crews are, the dynamics of working with your wife, and the Popcorn Gallery is back again to ask more important questions about Taylor Swift and starving children.\xA0 ',
    isoDate: "2014-04-14T10:00:00.000Z"
  },
  {
    id: "29",
    title: "Jordan Morris, Our Close Friend",
    pubDate: "Mon, 21 Apr 2014 10:00:00 GMT",
    description: "Sean and Hayes start off with a segment called Critically Ashamed, where they discuss the critical reception of the TV version of Fargo. Then, fellow podcast host on a rival network JORDAN MORRIS comes to the studio to talk with the guys about being a nerd, Demolition Man, fucked up childhoods, and being comedy. Then, the Popcorn Gallery is back again with more hard topics like All About Steve, Jesse Thorn, live shows, Criss Angel, and finally the gang delves into their fucked up mind caverns. ",
    isoDate: "2014-04-21T10:00:00.000Z"
  },
  {
    id: "30",
    title: "Little Esther, Our Close Friend",
    pubDate: "Mon, 28 Apr 2014 10:00:00 GMT",
    description: `Sean and Hayes explain why Sean's voice sounds different this week, then are inspired by the great Beatles to take you through "A Day In the Life" of Alexander Payne. Then LITTLE ESTHER joins the boys for a discussion of who's pretending to be gay, being scared of the Internet, American Girl dolls, and the difference between offer-only and a holding deal.\u200B\xA0 `,
    isoDate: "2014-04-28T10:00:00.000Z"
  },
  {
    id: "31",
    title: "Dave Thomas, Our Close Friend",
    pubDate: "Mon, 05 May 2014 10:00:00 GMT",
    description: "Hayes and Sean weigh in on the Donald Sterling controversy with insights into their own relationship with him, privacy, and Shakespeare. Then, friend DAVE THOMAS comes by to reminisce with the boys on the old days, Bob Hope, SCTV,  and the Chateau Marmont. Then, the Popcorn Gallery is back and they go into such fun topics as wearing condoms,  bear safety, spooky skellingtons, Cheech, and more!  ",
    isoDate: "2014-05-05T10:00:00.000Z"
  },
  {
    id: "32",
    title: "B.J. Novak, Our Close Friend",
    pubDate: "Mon, 12 May 2014 10:00:00 GMT",
    description: "Sean and Hayes start off the show by talking about social media, specifically what you should put as your occupation on Facebook and your bio on Twitter. Then, close friend B.J. NOVAK stops by to talk to the guys about pranking Usher, Punk'd, Celebrity Net Worth, and he pops into the Popcorn Gallery to discuss The Americans, #longhairdontcare, and John Candy. Also, tune in for The Amazing Spiderman and the Case of the Music Box Hostage Crisis!\xA0\xA0 ",
    isoDate: "2014-05-12T10:00:00.000Z"
  },
  {
    id: "33",
    title: "Anders Holm, Our Close Friend",
    pubDate: "Mon, 19 May 2014 10:00:00 GMT",
    description: `This week on Hollywood Handbook, Hayes and Sean start off with a segment called "I Gotta Raise" where they talk about their kids and their own upbringings: Sean on a farm and Hayes in a fire station. Then, friend ANDERS HOLM stops by to talk to the guys about the truth about Mimby, his salesman dad, living on the Eastside, and business cards. Also, Anders reveals the sweet story of how he lost his virginity. Then, the guys do "Pitch Stop",  a segment where they do a fake pitch to Anders and they end the show with the world's shortest Popcorn Gallery. \xA0 `,
    isoDate: "2014-05-19T10:00:00.000Z"
  },
  {
    id: "34",
    title: "David Wain, Our Close Friend",
    pubDate: "Mon, 26 May 2014 10:00:00 GMT",
    description: "Hayes and Sean defend celebrity voice actors by creating their own vocal characters in the segment Voice Choice. Then DAVID WAIN, director and lovemaking mentor, arrives to tell the story of how he got to be director, pitch his take for the reboot of Million Dollar Arm, address what is perhaps Engineer Cody's greatest error yet, and answer questions from listeners about prom and his friendship with the rapper Jay-Z.\xA0 ",
    isoDate: "2014-05-26T10:00:00.000Z"
  },
  {
    id: "35",
    title: "Mikal Cronin, Our Close Friend",
    pubDate: "Mon, 02 Jun 2014 10:00:00 GMT",
    description: "Hayes and Sean start off the show talking about their love of French films with a French documentary crew in-studio and do a segment where they explore how different music can change the tone of a movie scene. Then, the guys bring in the first person signed to their record label, Mikal Cronin,  for a special musical episode where they talk about Neil Young and Leonardo Da Vinci's adventures. Also, is Engineer Cody stealing cable from the Earwolf studio? Tune in to find out. ",
    isoDate: "2014-06-02T10:00:00.000Z"
  },
  {
    id: "36",
    title: "John Cochran, Our Close Friend",
    pubDate: "Mon, 09 Jun 2014 10:00:00 GMT",
    description: `Hayes starts off the show discussing the special surgery he had to get on his arm for a part, and he and Sean discuss the most important thing that's been left out of the #YesAllWomen movement. Then an all-new Teaser Freezer breaks down the new Jersey Boys movie. Then, very famous guest JOHN COCHRAN from Survivorman joins the guys to talk about how he went from contestant on a reality show to a TV writer for "We're the Millers", his Twitter following, flying into the Statue of Liberty, and judge salaries and the Popcorn Gallery is back to ask questions about hair parts, cut scenes, and The Americans. Finally, John gets called out for bailing on an airport meeting with a listener. `,
    isoDate: "2014-06-09T10:00:00.000Z"
  },
  {
    id: "37",
    title: "Jessica St. Clair and Lennon Parham, Our Close Friends",
    pubDate: "Mon, 16 Jun 2014 10:00:00 GMT",
    description: `Sean and Hayes start off the show with "Rumer Millis", where they break the news of a new Star Wars movie and explore some insider info about plot predictions and characters. Then, the very funny JESSICA ST. CLAIR and LENNON PARHAM from "Playing House" come by to talk about the Maleficent premiere and chicken fingering/pigeon holing at Chik-fil-A headquarters, and then the guys mediate the official dissolution of their partnership. Finally, the Popcorn Gallery is back to ask about playing "House", getting peed on by Bruce Springsteen, and Tom Lennon's biopic.  `,
    isoDate: "2014-06-16T10:00:00.000Z"
  },
  {
    id: "38",
    title: "Matt Gourley, Our Close Friend",
    pubDate: "Mon, 23 Jun 2014 10:00:00 GMT",
    description: `Hayes and Sean start with "Late Night Snack", where they discuss Jimmy Fallon's greatest moments and play a game of laugh vs. yawn with Engineer Sam. Then, college comedy professor and podcast pro Matt Gourley is on to talk guns, robots, his classroom process, and lead the guys in a classic mirror exercise. Finally, the Popcorn Gallery is back to bring up topics like weird experiences with women, mummies, Cabo St. Lucas,  and then Matt tells a bonus story about bully vengeance. `,
    isoDate: "2014-06-23T10:00:00.000Z"
  },
  {
    id: "39",
    title: "Sean O'Connor, Our Close Friend",
    pubDate: "Mon, 30 Jun 2014 10:00:00 GMT",
    description: `Sean and Hayes discuss good apologies and give out awards to the most choice critics in a segment called "Choice Critics Critic's Choice Awards". Then, hilarious stand-up comic Sean O'Connor is in the studio to talk to the guys about ruling @midnight and the guys break down the specifics of Sean's album. Finally, the Popcorn Gallery is back to ask about paradoxes and Ben Hoffman and everyone gets a new name.\xA0This episode is sponsored by Cards Against Humanity . Spark Box Toys . Use the offer code HOLLYWOOD for 50% off the first month of your subscription of some sweet toys. `,
    isoDate: "2014-06-30T10:00:00.000Z"
  },
  {
    id: "40",
    title: "Aubrey Plaza, Our Close Friend",
    pubDate: "Mon, 07 Jul 2014 10:00:00 GMT",
    description: "Hayes and Sean invite their newest intern, Rob Reiner's son Andy, to tell them the plot of Edge of Tomorrow so they can be ready for meetings before Engineer Sam derails the conversation with a disturbance. Then AUBREY PLAZA joins the show to help Sean tell a funny chip story and speak on foodie culture, the Latina Revolucion, scary witches, and even more than that!\xA0This episode is sponsored by Cards Against Humanity . ",
    isoDate: "2014-07-07T10:00:00.000Z"
  },
  {
    id: "41",
    title: "Jason Nash, Our Close Friend",
    pubDate: "Mon, 14 Jul 2014 10:00:00 GMT",
    description: 'Sean and Hayes are happy to finally relax after their newsworthy week. Following an installment of "Ehh? Wrong," JASON NASH appears to talk how difficult the cast members of his movie "Jason Nash Is Being Married" were, speak on how filmmaking is really just like cooking a fine meal, and walk the guys through one of his famous "Mirror Movies."\xA0 ',
    isoDate: "2014-07-14T10:00:00.000Z"
  },
  {
    id: "42",
    title: "Sinbad, Our Close Friend",
    pubDate: "Mon, 21 Jul 2014 10:00:00 GMT",
    description: 'Hayes and Sean are pissed about how the new movie Boyhood ripped off their long-time project "Engineer Cody Boy" and they assist a fan that wrote in asking for relationship help. Then, SINBAD is in the studio with his daughter and dog to discuss being taken by aliens, his feelings on selfies, what it was like to invent comedy, and he takes us behind the scenes of "Jingle All the Way". Finally, the guys talk about their beef with Kel and the Popcorn Gallery asks Sinbad about mustaches, handshakes, death, and more!\xA0This episode is sponsored by Cards Against Humanity, Sparkbox, & Star Shower. ',
    isoDate: "2014-07-21T10:00:00.000Z"
  },
  {
    id: "43",
    title: "Alex Borstein, Our Close Friend",
    pubDate: "Mon, 28 Jul 2014 17:02:00 GMT",
    description: `Sean and Hayes start off the show with a segment called\xA0"You're doing it wrong: By Grove I've got it!" where they discuss how\xA0tickets work and what a mall is.\xA0Then, ALEX BORSTEIN is in the studio for\xA0"Brick by Brick Tamland", where she speaks about her iconic roles as Dillary Clinton and\xA0Ms. Dogwoman.\xA0Finally, the Popcorn Gallery asks Ms. Borstein about her fear of commercials, what made MadTV so angry, and Seth MacFarlane's in-office antics. `,
    isoDate: "2014-07-28T17:02:00.000Z"
  },
  {
    id: "44",
    title: "Nick Wiger, Our Close Friend",
    pubDate: "Mon, 04 Aug 2014 10:00:00 GMT",
    description: 'Hayes and Sean start with "Welcome to Welcome to Sweden, etc", where they talk about their favorite new television shows. Then, viral sensation NICK WIGER is in the studio to make some controversial statements about the internet being the future and talk about viral content, Vine, Funny or Die, and monetizing Twitter. Finally, the Popcorn Gallery theme song asks Nick about nothing.\xA0 ',
    isoDate: "2014-08-04T10:00:00.000Z"
  },
  {
    id: "45",
    title: "Johnny Pemberton, Our Close Friend",
    pubDate: "Mon, 11 Aug 2014 10:00:00 GMT",
    description: "Sean and Hayes are extremely pissed about having to do so many Ice Bucket Challenges all week. On the bright side, they talk about some very exciting development opportunities involving newspaper comic strip properties. Then guest JOHNNY PEMBERTON arrives to speak on his famous charity stunts and eat a whole pack of gum for Engineer Sam. Finally, the Popcorn Gallery returns, and Johnny explains points on the back end and the dangers of baseball tricks. \u200B\xA0 ",
    isoDate: "2014-08-11T10:00:00.000Z"
  },
  {
    id: "46",
    title: "Jessica Williams, Our Close Friend",
    pubDate: "Mon, 18 Aug 2014 10:00:00 GMT",
    description: `Sean and Hayes memorialize their friend Robin with a good story and have some bones to pick with how people online are expressing themselves. Then they talk about the controversial Let's Be Cops and some of Sean's own experiences with cops. Finally, JESSICA WILLIAMS is around to discuss the big stories from the news and answer Popcorn Gallery questions about the word "news," being Native American, and her large arms.\xA0 `,
    isoDate: "2014-08-18T10:00:00.000Z"
  },
  {
    id: "47",
    title: "Zoe Jarman, Our Close Friend",
    pubDate: "Mon, 25 Aug 2014 10:00:00 GMT",
    description: 'Hayes and Sean are completely steamed about how a certain Internet company is putting them in too many lists. Then ZOE JARMAN from Mimby Show is in the studio to discuss Hollywood Zoes, the rights of women, Castle School, and to act out a new play with "the dudes."\xA0 ',
    isoDate: "2014-08-25T10:00:00.000Z"
  },
  {
    id: "48",
    title: "Pete Holmes, Our LIVE Friend",
    pubDate: "Mon, 01 Sep 2014 10:00:00 GMT",
    description: `In this first ever live Hollywood Handbook episode recorded at Molly Malone's in LA, Sean and Hayes bring a lucky fan up on stage to do a live version of "Pitch Perfectly" with "The Wedding Singer". Then, PETE HOLMES joins the guys to talk about suing TBS, search for love, and make fun of Hayes' face. Finally, the first real-life Popcorn Gallery asks about Conan and Marvel. `,
    isoDate: "2014-09-01T10:00:00.000Z"
  },
  {
    id: "49",
    title: "Brett, Sam, and Cody, Our Engineers",
    pubDate: "Mon, 08 Sep 2014 10:00:00 GMT",
    description: `Hayes and Sean play a game of "That's Wheely Interesting" where they describe their first encounters with celebrities and Sean talks about BBQ festival etiquette. Then, BRETT, SAM, and CODY are on the other side of the table for an exclusive engineer-only episode where they get really personal and tackle some confusing games from other podcasts. Finally, during the Popcorn Gallery, Brett finally finds out what Sam does when he's not in the studio. `,
    isoDate: "2014-09-08T10:00:00.000Z"
  },
  {
    id: "50",
    title: "BriTANicK, Our Close Friends",
    pubDate: "Mon, 15 Sep 2014 10:00:00 GMT",
    description: "Sean and Hayes talk video games and reveal their gamer tags. Then, the world's only sketch comedy duo BRITANICK is in the studio to talk about their computer closet, the secrets behind being a good wingman, dragons, and how to sit on a barstool. Then, the Popcorn Gallery is back to ask about getting half the doughsef, kissing each other, and juggling priorities. ",
    isoDate: "2014-09-15T10:00:00.000Z"
  },
  {
    id: "51",
    title: "Gil Ozeri, Our Close Friend",
    pubDate: "Mon, 22 Sep 2014 10:00:00 GMT",
    description: 'Sean and Hayes basically shred the whole Apple company for certain failures in their products, then open up the Teaser Freezer once more to do a close reading of "The Equalizer" where Engineer Brett makes a surprising move. Then GIL OZERI arrives to dish on his role in various police killings, perform characters from his one-man shows, and answer questions from the Popcorn Gallery gang.\xA0 ',
    isoDate: "2014-09-22T10:00:00.000Z"
  },
  {
    id: "52",
    title: "Lauren Greenberg, Our Close Friend",
    pubDate: "Mon, 29 Sep 2014 10:00:00 GMT",
    description: 'Hayes and Sean start off with a round of Gmail Roulette where they tackle current topics like the NFL controversy and leaked nudes. Then, LAUREN GREENBERG is in the studio to talk about writing for the MTV Movie Awards, the winner of the "scared as shit" performance, and her job on Twitter.\xA0\xA0 ',
    isoDate: "2014-09-29T10:00:00.000Z"
  },
  {
    id: "53",
    title: "Two Birthday Boys, Our Close Friends",
    pubDate: "Mon, 06 Oct 2014 10:00:00 GMT",
    description: "Hayes and Sean have a discussion with Engineer Cody about refreshments before addressing an interesting new cultural phenomenon they're getting into. Then the guys issue a challenge to their listeners to help them become the second-least popular podcast on Earwolf. Finally, MIKE HANFORD and DAVE FERGUSON show up to discuss Alfred E. Neuman books, the history of the lo mein sketch, and answer questions about names from the Chip Gallery.\u200B ",
    isoDate: "2014-10-06T10:00:00.000Z"
  },
  {
    id: "54",
    title: "Clark Duke, Our Close Friend",
    pubDate: "Mon, 13 Oct 2014 10:00:00 GMT",
    description: `Hayes and Sean start the show by weighing in on the announcement of the new all-female Ghostbusters cast. Then, CLARK DUKE is in the studio to take us on a tour of his career and talk about where he went to college, Weezer,  and golf. After, the boys play a game of "That's Wheely Interesting" and the Popcorn Gallery is back to ask Clark about being a party teenager, cheating, and sharing the spotlight. `,
    isoDate: "2014-10-13T10:00:00.000Z"
  },
  {
    id: "55",
    title: "Lauren Lapkus, Our Close Friend",
    pubDate: "Mon, 20 Oct 2014 10:00:00 GMT",
    description: "Sean and Hayes start the show with a discussion on about the book Freakingnomics and how the concepts translate to the world of moviemaking. Then, LAUREN LAPKUS is in the studio to talk about scary dinosaurs, Jurassic spoilers, Ernest, and the difference between books and movie adaptations. Finally, Intern Andy is back to ask some inappropriate Popcorn Gallery questions. ",
    isoDate: "2014-10-20T10:00:00.000Z"
  },
  {
    id: "56",
    title: "Iliza Shlesinger, Our Close Friend",
    pubDate: "Mon, 27 Oct 2014 10:00:00 GMT",
    description: "The guys begin with another installment of The Right Stuff, where they explain the four types of conflict in detail. Then ILIZA SHLESINGER appears to talk funny business cards, explore a career in ventriloquy, and answer Popcorn Gallery questions about being a Jewish comedian and her ten catchphrases. ",
    isoDate: "2014-10-27T10:00:00.000Z"
  },
  {
    id: "57",
    title: "Sean And Hayes, Our Closest Friends",
    pubDate: "Mon, 03 Nov 2014 08:00:00 GMT",
    description: "The guys obey the most powerful wishes of their listeners and do a show without a guest where they interview each other, then take a barrage of questions from the Popcorn Gallery (no song).\xA0 ",
    isoDate: "2014-11-03T08:00:00.000Z"
  },
  {
    id: "58",
    title: "Dave King, Steve Hely, and Kevin Etten, Our Close Friends",
    pubDate: "Mon, 10 Nov 2014 08:00:00 GMT",
    description: "Hayes and Sean start the show by critiquing segment theme song submissions from fans. Then, on the first Hollywood Handbook writer's panel, DAVE KING, STEVE HELY, and KEVIN ETTEN join the boys to talk about TV writing, real writing, the creative process, conflict, and alt and main jokes. Then, the Popcorn Gallery is back to ask the panel about their A/V Club GPAs, cams, and the writer's room boys club. ",
    isoDate: "2014-11-10T08:00:00.000Z"
  },
  {
    id: "59",
    title: "Paul Scheer, Our Close Friend",
    pubDate: "Mon, 17 Nov 2014 08:00:00 GMT",
    description: 'This week, Hayes and Sean are pissed about a certain "magazine" cover and they explain why. Then, PAUL SCHEER is in the studio to workshop a spooky script with the boys and talk about the process behind his podcast "How did this get made?" and MeowTV. ',
    isoDate: "2014-11-17T08:00:00.000Z"
  },
  {
    id: "60",
    title: "Tracey Wigfield, Our Close Friend",
    pubDate: "Mon, 24 Nov 2014 08:00:00 GMT",
    description: "Sean and Hayes get in a very heated discussion about a phenomenon called anti-comedy. Then, close friend TRACEY WIGFIELD is in the studio to talk about being a female writer, what happened behind the scenes at 30 Rock with Judah's hat,  and full mouth kissing her boyfriend. Finally, the Popcorn Gallery is back to ask Tracey about being popular, winning an Emmy, and her joke victory dance.\xA0 ",
    isoDate: "2014-11-24T08:00:00.000Z"
  },
  {
    id: "61",
    title: "Pauly Shore, Our Close Friend",
    pubDate: "Mon, 01 Dec 2014 08:00:00 GMT",
    description: "Are you addicted to Serial like the rest of the country? Hayes and Sean are finally talking about the wildly popular phenomenon, throwing their own spoilers and theories into the pot. Then, close personal friend Pauly Shore is in the studio to talk about all the famous people he's seen naked and the Popcorn Gallery is back to ask about Son in Law and whether Tia Carrere is still hot. ",
    isoDate: "2014-12-01T08:00:00.000Z"
  },
  {
    id: "62",
    title: "Jarrad Paul, Our Close Friend",
    pubDate: "Mon, 08 Dec 2014 08:00:00 GMT",
    description: 'Hayes and Sean start the show by addressing some of the criticism for the last episode with Pauly Shore in an edition of "Ehh... Wrong!", where intern Andy is back to help the guys fight the online storm. Then, actor, director, screenwriter, and friend JARRAD PAUL is in the studio to share the 6 rules of filmmaking. Finally, the Popcorn Gallery is back with a special twist! ',
    isoDate: "2014-12-08T08:00:00.000Z"
  },
  {
    id: "63",
    title: "Thomas Middleditch, Our Close Friend",
    pubDate: "Mon, 15 Dec 2014 08:00:00 GMT",
    description: `Sean and Hayes discuss the holidays in L.A. with a new version of a classic segment: "You're Doing It Wrong: By Ho Ho Hove I Think Eggnog It". Then, TV star THOMAS MIDDLEDITCH is in the studio to talk about Mike Judge, the nerd takeover of comedy, working with Martin Scorcese, and what happened behind the scenes on Splinterheads. Also, Gmail Roulette brings a sneak peak into Thomas' celebrity life. \xA0 `,
    isoDate: "2014-12-15T08:00:00.000Z"
  },
  {
    id: "64",
    title: "Listeners, Our Close Friends",
    pubDate: "Mon, 22 Dec 2014 08:00:00 GMT",
    description: "Sean and Hayes give a generous Christmas gift to all of their listeners by accepting calls from some of them. Topics include the cities where all of them live, the missed opportunity of 12/13/14, the punk legacy of Louis Reed, and Chanson. ",
    isoDate: "2014-12-22T08:00:00.000Z"
  },
  {
    id: "65",
    title: "Dan Klein, Our Close Friend",
    pubDate: "Mon, 29 Dec 2014 08:00:00 GMT",
    description: "Sean and Hayes finally weigh in on the Cosby situation and explain why Bill has yet to respond to recent allegations. Then, hot stand-up comedian DAN KLEIN is in the studio to talk about his pay to watch model of his self released comedy special \u201CDan Klein: This Is Comedy,\u201D how comedians can get sad, what kind of SNL characters he has in his arsenal, how LA is different from New York, and being inspired by Seinfeld. Plus, Dan gives us an exclusive look behind his infamous Starbucks joke. ",
    isoDate: "2014-12-29T08:00:00.000Z"
  },
  {
    id: "66",
    title: "Paul F. Tompkins Again, Our Close Friend",
    pubDate: "Mon, 12 Jan 2015 08:00:00 GMT",
    description: 'After a week hiatus, Sean and Hayes are back to discuss what they did with their time off and examine the top fails of last year. Then, podcast legend PAUL F. TOMPKINS stops by as the first ever repeat guest  to analyze the highlights of 2014, explain the rules of "Riddle Me This", and talk about the perks of being a nerd. ',
    isoDate: "2015-01-12T08:00:00.000Z"
  },
  {
    id: "67",
    title: "Jes Macallan, Our Close Friend",
    pubDate: "Mon, 19 Jan 2015 08:00:00 GMT",
    description: "Hayes and Sean start with an analysis of this year's Oscar nominations and reactions, then open up the Teaser Freezer to talk Mortdecai. Then, JES MACALLAN from Mistresses stops by to talk about her favorite movies and make political statements. Then, the Popcorn Gallery is finally back to ask about flooring, nerd culture, and  the rules of business.\xA0 ",
    isoDate: "2015-01-19T08:00:00.000Z"
  },
  {
    id: "68",
    title: "Erin Gibson, Our Close Friend",
    pubDate: "Mon, 26 Jan 2015 08:00:00 GMT",
    description: `Hayes and Sean start off by covering what's trending for pilot season. Then, ERIN GIBSON from Throwing Shade is in the studio to talk about being a feminist, play "Is That Bad?", take sides on the Bruce Jenner issue, and illuminate gender issues in the entertainment industry.\xA0 `,
    isoDate: "2015-01-26T08:00:00.000Z"
  },
  {
    id: "69",
    title: "Betsy Sodaro, Our Close Friend",
    pubDate: "Mon, 02 Feb 2015 08:00:00 GMT",
    description: `After exploring why the media is scared of using terms related to the show, the boys dig into another installment of "The Write Stuff," reading a scene from a movie Casablanca. Then Betsy Sodaro, a fellow member of LA Weekly's Best People of LA Class of 2014, arrives to share stories from the ceremony and issue hot takes on Deflategate and offensive awards show routines. There is a Popcorn Gallery as well. `,
    isoDate: "2015-02-02T08:00:00.000Z"
  },
  {
    id: "70",
    title: "Seth Morris, Our Close Employee",
    pubDate: "Mon, 09 Feb 2015 08:00:00 GMT",
    description: `The guys dig through their large backlog of negative feedback for an installment of "Eh, Wrong!", open up some listener mail, then choose a good name for the mail segment. Then SETH MORRIS arrives to help launch "Talkin' Turkey," the first podcast from Hayes and Sean's Wolfcool Network.\xA0 `,
    isoDate: "2015-02-09T08:00:00.000Z"
  },
  {
    id: "71",
    title: "Nicole Byer, Our Close Friend",
    pubDate: "Mon, 16 Feb 2015 08:00:00 GMT",
    description: "Hayes and Sean talk about their favorite moments from the Daily Show and speculate as to who Jon Stewart's replacement will be. Then NICOLE BYER of MTV's Girl Code drops in to sample Engineer Cody's Homemade Water and answer some questions Girl Code-style. ",
    isoDate: "2015-02-16T08:00:00.000Z"
  },
  {
    id: "72",
    title: "Ben Rodgers, DC Pierson, Dominic Dierkes, Eric Appel, Our Potential LIVE Employees",
    pubDate: "Mon, 23 Feb 2015 08:00:00 GMT",
    description: "Hayes and Sean are coming to you LIVE from UCB-Sunset in Los Angeles with house band MIKAL CRONIN. The guys chat about their time at the #SNL40 celebration and help audience members make the movie of their dreams. Then, they welcome young actors BEN RODGERS, DC PIERSON, DOMINIC DIERKES, and ERIC APPEL to audition for the new voice of Hollywood Handbook ads sometimes. ",
    isoDate: "2015-02-23T08:00:00.000Z"
  },
  {
    id: "73",
    title: "The Gilmore Guys, Our Close Friends",
    pubDate: "Mon, 02 Mar 2015 08:00:00 GMT",
    description: "Sean and Hayes punish America for discussing a dress picture when there are real problems in the world. Then it's time for a high-tech new segment, Riff'rent Strokes for Different Jokes: Academy Burn-Wards Edition where the guys play a recording of their live Oscar riffing. Finally, Demi Adejuyigbe and Kevin Porter, THE GILMORE GUYS, enter the studio to explain why they copied Hayes and Sean and listen to some clips from Wolfcool's many new TV episode review podcasts. ",
    isoDate: "2015-03-02T08:00:00.000Z"
  },
  {
    id: "74",
    title: "Kumail Nanjiani, Our Close Friend",
    pubDate: "Mon, 09 Mar 2015 10:00:00 GMT",
    description: "Sean and Hayes describe what pilot season is and describe the new show they've been working on. Then, KUMAIL NANJIANI stops by to talk to the guys about their company, their favorite super heroes, and their upcoming video game. Finally, the Popcorn Gallery asks about @midnight, Pakingstan, and the best computers.\xA0 ",
    isoDate: "2015-03-09T10:00:00.000Z"
  },
  {
    id: "75",
    title: "Shelby Fero Again, Our Close Friend",
    pubDate: "Mon, 16 Mar 2015 10:00:00 GMT",
    description: "Sean and Hayes open the show with a breakdown of how a table read works and update us on the status of the pilot from the last episode. Then, SHELBY FERO comes back to the show to talk about writing on Robot Chicken and the space show, reminisce on skateboarding with Sean, and make a shocking confession. Then, the guys bring out some cigarettes to share with Shelby and a modified Popcorn Gallery makes an appearance.\xA0 ",
    isoDate: "2015-03-16T10:00:00.000Z"
  },
  {
    id: "76",
    title: "Hal Rudnick, Our Close Friend",
    pubDate: "Sun, 22 Mar 2015 10:00:00 GMT",
    description: "Sean and Hayes talk more about the ups and downs of filming their pilot and Engineer Codyboy gets caught red-handed. Then, screen junkie HAL RUDNICK drops by the studio to talk movies, spoiler alerts, and Good Will Hunting. Hayes reveals a personal issue he's having with the honeypot and the boys play a quick round of of fuck/marry/kill. Finally, the Popcorn Gallery is back to ask Hal some questions.\xA0\xA0 ",
    isoDate: "2015-03-22T10:00:00.000Z"
  },
  {
    id: "77",
    title: "The ScuzzMan, Dom's Close Friend",
    pubDate: "Mon, 30 Mar 2015 10:00:00 GMT",
    description: "With Hayes gone, Sean brings in his assistant Dom to fill the void and showers him with apologies in exchange for the exciting golden-haired guest he booked. Then, Dom's friend The ScuzzMan joins them to discuss Volleyball: A Real Underdog Story. Finally, the Popcorn Gallery is back to ask some Goldie Hawn-themed questions.\xA0\xA0 ",
    isoDate: "2015-03-30T10:00:00.000Z"
  },
  {
    id: "78",
    title: "Listeners Again, Our Close Friends",
    pubDate: "Mon, 06 Apr 2015 10:00:00 GMT",
    description: "Hayes and Sean are back with another totally planned, not spontaneous call-in episode. Listeners call in to talk about Lance Bass going to the moon, Air Bud, boats, Guardians of the Galaxy, San Francisco, and brotherly love and then the boys close out the show with a chat with a new mystery female fan. ",
    isoDate: "2015-04-06T10:00:00.000Z"
  },
  {
    id: "79",
    title: "Mary Holland, Our Close Friend",
    pubDate: "Mon, 13 Apr 2015 10:00:00 GMT",
    description: 'Hayes and Sean give another update about their pilot and address a couple of super fans. Then, funny lady MARY HOLLAND comes by to talk about hot sauce and getting arrested, and then play a game of "Queue and A". Finally, Hayes and "Sean" bring out the Popcorn Gallery to ask Mary about being sweaty, movies, and tattoos.\xA0 ',
    isoDate: "2015-04-13T10:00:00.000Z"
  },
  {
    id: "80",
    title: "Jon Gabrus Again, Our Close Friend",
    pubDate: "Mon, 20 Apr 2015 19:10:00 GMT",
    description: "Hayes and Sean make an important phone call to tackle a wrong review.\xA0Then, JON GABRUS is back to talk to the boys about hot topical news, his fan interactions, and Guy Code. Finally, the Popcorn Gallery is back to ask about the presidential election and the California drought. ",
    isoDate: "2015-04-20T19:10:00.000Z"
  },
  {
    id: "81",
    title: "Alex Anfanger and Jon Bass, Our Close Friends",
    pubDate: "Mon, 27 Apr 2015 10:00:00 GMT",
    description: `Sean finally sets the record straight on offensive changes that were made to his original script of Adam Sandler's Native American movie "The Ridiculous Six." Then ALEX ANFANGER and JON BASS of The Comedy Center's "Big Time in Hollywood, FL" join the show to exchange notes with Sean and Hayes, come up with great new twists on Jon's character's name, and reveal the secret of Alex's vertical hair in the Popcorn Gallery. `,
    isoDate: "2015-04-27T10:00:00.000Z"
  },
  {
    id: "82",
    title: "Neil Casey, Our Close Friend",
    pubDate: "Mon, 04 May 2015 10:00:00 GMT",
    description: "Sean and Hayes have to catch up on a backlog of ads this week, so they subtly add them in throughout this week's chat with the very funny TV writer Neil Casey of Outer Space. Neil opens up to the boys about Paul Feig, The Joker, SNL memories, working at Amy Schumer, his upcoming work, and his best celebrity encounter. ",
    isoDate: "2015-05-04T10:00:00.000Z"
  },
  {
    id: "83",
    title: "Nick Kroll, Our Close Friend",
    pubDate: "Mon, 11 May 2015 10:00:00 GMT",
    description: "After the guys voluntarily decide not to do an intro segment due to circumstances under their control, NICK KROLL shows up to discuss what a big fan he is of the show, talk about why his movie Adult Beginners is a nice movie, and play some clips from his favorite pilots of this season.\xA0 ",
    isoDate: "2015-05-11T10:00:00.000Z"
  },
  {
    id: "84",
    title: "Moments of Greatness, Our Constant Companions",
    pubDate: "Mon, 18 May 2015 10:00:00 GMT",
    description: "After their triumph over Comedy Bang Bang, the guys present a series of the best clips from the show in hopes of being poached by a new podcast network. Hayes and a very hungry Sean introduce each clip from New York with help from Engineer Rashid.\xA0 ",
    isoDate: "2015-05-18T10:00:00.000Z"
  },
  {
    id: "85",
    title: "David Letterman, Our Close Friend",
    pubDate: "Mon, 25 May 2015 10:00:00 GMT",
    description: "The guys have several apologies to make concerning their recent Comedy Bang Bang appearance and Best Of episode. Then it's the premiere of the first episode of the new Rotten Tomatoes Podcast presented by Wolf Cool, followed by an appearance from rogue comedian WILL HINES to discuss the sad event of the past week and the influence of Dave. ",
    isoDate: "2015-05-25T10:00:00.000Z"
  },
  {
    id: "86",
    title: "Ross Mathews, Our Close Friend",
    pubDate: "Mon, 01 Jun 2015 10:00:00 GMT",
    description: "Sean and Hayes encounter a new Earwolf engineer and talk about the hot new movies Aloha and San Andreas. Then, ROSS MATHEWS comes by the studio to talk about bagel class with Sean, give Intern Andy advice about interning, and answer Popcorn Gallery questions about working for Jay Lego and an ancient fable. ",
    isoDate: "2015-06-01T10:00:00.000Z"
  },
  {
    id: "87",
    title: "Whitmer Thomas and Clay Tatum, Our Close Friends",
    pubDate: "Mon, 08 Jun 2015 10:00:00 GMT",
    description: `Hayes and Sean discuss something they've gotten sick of in the news recently, then read a letter they got from some podcast lawyers, followed by a text-based installment of "Eh, Wrong!" Then underground comedians WHITMER THOMAS and CLAY TATUM arrive to discuss their discoveries by Hayes and Sean and make a skate video. `,
    isoDate: "2015-06-08T10:00:00.000Z"
  },
  {
    id: "88",
    title: "Neil Campbell, Our Close Employee",
    pubDate: "Mon, 15 Jun 2015 10:00:00 GMT",
    description: "The boys have a visitor fan from England and talk about smart British comedy with him. Then NEIL CAMPBELL joins the discussion to play clips from his new Tedd Talks podcast on WolfCool and share stories about his stepdad. ",
    isoDate: "2015-06-15T10:00:00.000Z"
  },
  {
    id: "89",
    title: "Erin Whitehead, Our Close Friend",
    pubDate: "Mon, 22 Jun 2015 10:00:00 GMT",
    description: "The boys talk about their favorite toys, fancy cars, and the dangers of not being careful with car shopping. Then ERIN WHITEHEAD arrives to talk about the film documentary she made in collaboration with WolfCool productions, answer two questions from the Popcorn Gallery, and tell a secret story about her last appearance on the show. ",
    isoDate: "2015-06-22T10:00:00.000Z"
  },
  {
    id: "90",
    title: "Brian Huskey, Our Live Friend",
    pubDate: "Mon, 29 Jun 2015 10:00:00 GMT",
    description: 'Hayes and Sean are back for another live episode where they kick off the show with "The Brand That Rocks the Cable", a segment where they help out audience members with their brand. Then, fan favorite Brian Huskey teams back up with the boys for "Teen Pope 2", a sequel to the biggest movie of all time. Finally, a live popcorn gallery asks questions from die-hard fans. ',
    isoDate: "2015-06-29T10:00:00.000Z"
  },
  {
    id: "91",
    title: "Tom Scharpling, Our Close Friend",
    pubDate: "Mon, 06 Jul 2015 10:00:00 GMT",
    description: "Sean and Hayes are back with another episode of the best show, Hollywood Handbook where they talk about politics and Hollywood. Then, good friend TOM SCHARPLING from The Best Show comes by to get some advice from the guys, who kindly offer Tom tips on the best ways to restructure his show to achieve success. \xA0 ",
    isoDate: "2015-07-06T10:00:00.000Z"
  },
  {
    id: "92",
    title: "Fans, Our Close Fans",
    pubDate: "Mon, 13 Jul 2015 10:00:00 GMT",
    description: 'Hayes and Sean are forced to skip their great intro bit because they spent too long serving their fans at a Hudson News book signing for their new similar memoirs, "My Podcast Life." Fans Tim, Anastasia, Adam, Valerie, and Joe appear on the show to have Hayes and Sean sign their books and discuss their favorite parts. ',
    isoDate: "2015-07-13T10:00:00.000Z"
  },
  {
    id: "93",
    title: "Patrick Walsh, Our Close Friend",
    pubDate: "Mon, 20 Jul 2015 10:00:00 GMT",
    description: `Hayes and Sean are back today with a segment called "Trend Nottingham", where they track things that aren't trending. Then, PATRICK WALSH stops by to talk to the guys to talk about his past relationship with Sean and play a couple rounds of "That's Wheely Interesting". Plus, another installment of Hayes catching Engineer Cody slacking off! \xA0 `,
    isoDate: "2015-07-20T10:00:00.000Z"
  },
  {
    id: "94",
    title: "Hayley Huntley, Hayes' Daughter",
    pubDate: "Mon, 27 Jul 2015 10:00:00 GMT",
    description: "Sean and Hayes start today's show by laying out their favorite places to escape to for summer vacation and scroll through Engineer Cody's Twitter feed. Then, Hayes' daughter HAYLEY HUNTLEY comes on the show to read some scripts, including Smirnoff Isis, H.R. K-cups, and more! \xA0 ",
    isoDate: "2015-07-27T10:00:00.000Z"
  },
  {
    id: "95",
    title: "Mike Still, Our Close Friend",
    pubDate: "Mon, 03 Aug 2015 10:00:00 GMT",
    description: "Sean and Hayes weigh in on the Cecil the lion controversy. Then, MIKE STILL, featured in Fast Company Magazine, stops by the studio to talk to the guys about sex positivity with his son, becoming the next Lorne Michaels, and the first time they all saw Princess Leia. ",
    isoDate: "2015-08-03T10:00:00.000Z"
  },
  {
    id: "96",
    title: "Tom Scharpling Again, Our Close Friend",
    pubDate: "Mon, 10 Aug 2015 10:00:00 GMT",
    description: "Hayes and Sean applaud the Suicide Squad movie for a brave choice. Then TOM SCHARPLING returns to correct the mistakes of his infamous first appearance on the show, speak on Monk, do the Popcorn Gallery, and debut a potential new podcast with a hot new co-host. ",
    isoDate: "2015-08-10T10:00:00.000Z"
  },
  {
    id: "97",
    title: "Julie Klausner, Our Close Friend",
    pubDate: "Mon, 17 Aug 2015 10:00:00 GMT",
    description: `It's scorching hot outside so Sean and Hayes are blessing their fans with a trip back to the Teaser Freezer with a breakdown of the new film "We Are Your Friends". Then, JULIE KLAUSNER from Hulu's Difficult People stops by to talk to the guys about saying goodbye to Jon Stewart, their "to-do list", and help them out with ideas for a musical. `,
    isoDate: "2015-08-17T10:00:00.000Z"
  },
  {
    id: "98",
    title: "John Cochran Again, Our Close Friend",
    pubDate: "Mon, 24 Aug 2015 10:00:00 GMT",
    description: "The boys spill some secrets from your favorite Hollywood celebs.  Then, JOHN COCHRAN is back on the show to set the record straight about exactly what's going with his mom, his time on Survivor, what he did with that sweet prize money, his canceled sitcom, and the development of his new pilot. ",
    isoDate: "2015-08-24T10:00:00.000Z"
  },
  {
    id: "99",
    title: "Paul Rust Again, Our Close Friend",
    pubDate: "Mon, 31 Aug 2015 10:00:00 GMT",
    description: `Hayes and Sean had a tragic mishap with their phones so they're using this week's episode to reach out with some critical messages. Then, Paul Rust, the head editor of lifestyle magazine "Grauman's" is on the show again to go deeper into the contents of the issue, including Fashion Passion and dad bods,  talk about his new Netflix show Love, and give Engineer Sam some advice about buying his new motorcycle. `,
    isoDate: "2015-08-31T10:00:00.000Z"
  },
  {
    id: "100",
    title: "Aasif Mandvi, Our Big Get / Scott Ankerman, Our Business Rival",
    pubDate: "Mon, 07 Sep 2015 10:00:00 GMT",
    description: "Hayes and Sean have to basically skip the whole intro because their contract has lapsed. Instead of celebrating their 100th episode, they negotiate a new contract with Scott Aukerman and AASIF MANDVI, who couldn't do the show any other time. ",
    isoDate: "2015-09-07T10:00:00.000Z"
  },
  {
    id: "101",
    title: "The Grease Knows Eggs Show with Jesse Thorn",
    pubDate: "Mon, 14 Sep 2015 10:00:00 GMT",
    description: 'Tom "Eggs" Scharpling and Engineer "Greasenose" Cody debut the pilot of their new podcast to potential buyer Jesse Thorn. ',
    isoDate: "2015-09-14T10:00:00.000Z"
  },
  {
    id: "102",
    title: "Joe Wengert Again, Our Close Friend",
    pubDate: "Mon, 21 Sep 2015 10:00:00 GMT",
    description: "Hayes and Sean have finally produced a quiz to determine whether fans are a Hayes or a Sean, and Engineer Brett is the first quiz-taker. Then JOE WENGERT returns to the show to promote his old appearance on the show and introduce himself as the new Head of Branded Content at WolfCool Industries. ",
    isoDate: "2015-09-21T10:00:00.000Z"
  },
  {
    id: "103",
    title: "Allan McLeod, Our Close Friend",
    pubDate: "Mon, 28 Sep 2015 10:00:00 GMT",
    description: `Hayes and Sean start off with a discussion about the totally badass new show Bastard Executioner. Then, Allan McLeod joins the guys to talk about his successful showbiz career, including the FXX show "You're the Worst" and "Master Robot" and his audition for SNL. Then, the Popcorn Gallery asks about cars and bullying. `,
    isoDate: "2015-09-28T10:00:00.000Z"
  },
  {
    id: "104",
    title: "Nip/Tuck Commentary Episode 408",
    pubDate: "Mon, 05 Oct 2015 10:00:00 GMT",
    description: "There's no guest today as Sean and Hayes address some issues that have come up including plagiarism and cemetery screenings. Then, they delve simultaneously into watching and reviewing an episode of Nip/Tuck from Season 4. ",
    isoDate: "2015-10-05T10:00:00.000Z"
  },
  {
    id: "105",
    title: "John Gemberling, Our LIVE Friend",
    pubDate: "Mon, 12 Oct 2015 10:00:00 GMT",
    description: "Hayes and Sean are coming at you live from LA Podfest to chat with the very funny JOHN GEMBERLING about their plans for the upcoming WolfCool Fest, including some new show ideas and bestiality. Then, the live Popcorn Gallery asks about branding and making movies on computers. ",
    isoDate: "2015-10-12T10:00:00.000Z"
  },
  {
    id: "106",
    title: "Stephanie Allynne, Our Close Friend",
    pubDate: "Mon, 19 Oct 2015 10:00:00 GMT",
    description: "Sean and Hayes have taken a stand and decided to do the Hollywood Reporter Most Powerful Showrunner Questionnaire on the show instead of in the magazine. Then STEPHANIE ALLYNNE appears to dish on her wedding plans and answer questions for the Popcorn Gallery about strange food.? ",
    isoDate: "2015-10-19T10:00:00.000Z"
  },
  {
    id: "107",
    title: "Paul F. Tompkins and Joe Wengert Present Brandon Content, A WolfCool Exclusive Character",
    pubDate: "Mon, 26 Oct 2015 10:00:00 GMT",
    description: 'On a very spoOoOky Halloween episode of Hollywood Handbook, Sean and Hayes tear away the cobwebs off the Teaser Freezer as they breakdown the new film "Burnt." Then JOE WENGERT, Head of Branded Content at WolfCool Industries returns to introduce a brand new PAUL F. TOMPKINS character by the name of BRANDON CONTENT. ',
    isoDate: "2015-10-26T10:00:00.000Z"
  },
  {
    id: "108",
    title: "The We Don't Need Hayes Show with Jeff Dunham",
    pubDate: "Mon, 02 Nov 2015 08:00:00 GMT",
    description: "With Hayes gone, Sean explains how he no longer has boundaries and can finally tell all his opinions uninterrupted. Then, guest Jeff Dunham can't make it to the show due to sabotage, so Sean makes do with just his puppets. Finally, The Question Zone makes an appearance and Sean goes through Hayes' secret Earwolf drawer. ",
    isoDate: "2015-11-02T08:00:00.000Z"
  },
  {
    id: "109",
    title: "The ScuzzMan Returns",
    pubDate: "Mon, 09 Nov 2015 08:00:00 GMT",
    description: 'Sean, Dom Dierkes, and the ScuzzMan are reunited in the studio to catch up on their lives and discuss their script "Volleyball: A Real Underdog Story". Also, the Popcorn Gallery return to ask the ScuzzMan some hard-hitting questions. \xA0 ',
    isoDate: "2015-11-09T08:00:00.000Z"
  },
  {
    id: "110",
    title: "Handbook East with Tom Scharpling",
    pubDate: "Mon, 16 Nov 2015 08:00:00 GMT",
    description: "Hayes and Tom Scharpling are checking in this week from The Big Apple itself -- New York City! They talk about potential New Yorkers to recruit to the east coast branch of the network, discuss the mega-hit Hamilton, and bond over their favorite NY memories on the phone with Sean. ",
    isoDate: "2015-11-16T08:00:00.000Z"
  },
  {
    id: "111",
    title: "Mike O'Brien, Our Close Friend",
    pubDate: "Mon, 23 Nov 2015 08:00:00 GMT",
    description: `Hayes and Sean bust into the Teaser Freezer for a hilarious look at the "By the Sea" trailer. Then MIKE O'BRIEN turns up to dish on SNL gossip and play some clips of the best sketches that didn't make his new comedy album. `,
    isoDate: "2015-11-23T08:00:00.000Z"
  },
  {
    id: "112",
    title: "Agata, Gabe, July, Our Close Employees",
    pubDate: "Mon, 30 Nov 2015 08:00:00 GMT",
    description: "Hayes and Sean start off with a timely chat about Thanksgiving, including some common misconceptions about the holiday. Then, Agata Monica, Gabe Danon, and July Diaz from Trends with Benefits are on the show to pitch shows for the launch of the new network WolfCool Jr., shows for babies. ",
    isoDate: "2015-11-30T08:00:00.000Z"
  },
  {
    id: "113",
    title: "Listeners, Our Close Friends 3",
    pubDate: "Mon, 07 Dec 2015 08:00:00 GMT",
    description: "Sean and Hayes introduce a new call-in segment called the Phonecorn Gallery where they take calls about the news, with topics like the Chris Evert Celebrity Tennis Tournament, Gwen Stefani, the queen, people building walls, the movie Spectre, and new bugs. ",
    isoDate: "2015-12-07T08:00:00.000Z"
  },
  {
    id: "114",
    title: "The Secret Story of the Missing Episode",
    pubDate: "Mon, 21 Dec 2015 08:00:00 GMT",
    description: "Hayes is joined by Tom Scharpling in Tom's railyard studio to acknowledge the many awards their shows have gotten lately and to tell the entire true story of the technical difficulties that got last week's episode canceled. ",
    isoDate: "2015-12-21T08:00:00.000Z"
  },
  {
    id: "115",
    title: "Improving Brett's House with DC Pierson",
    pubDate: "Mon, 04 Jan 2016 08:00:00 GMT",
    description: "Sean and the Earwolf studio are unavailable so Hayes and DC Pierson are forced to record from Engineer Brett's home and take drastic measures to make it not as bad. \xA0 ",
    isoDate: "2016-01-04T08:00:00.000Z"
  },
  {
    id: "116",
    title: "Cartoons, Our Close Friends",
    pubDate: "Mon, 11 Jan 2016 08:00:00 GMT",
    description: "Sean is joined by ghostsmasher NEIL CASEY, acclaimed voice actor BEN RODGERS, and good drawer DOMINIC DIERKES to workshop scenes from a new animated movie and address topics such as capital punishment and processed food. ",
    isoDate: "2016-01-11T08:00:00.000Z"
  },
  {
    id: "117",
    title: "Devin Field, Our Pet Project",
    pubDate: "Mon, 18 Jan 2016 08:00:00 GMT",
    description: "Sean helps straight up loser DEVIN FIELD get on the right path to become successful by throwing him into Teaser Freezer and see if he can handle the cold. Then Sean uses his character chameleon ability to become Maria Menounos and interview Devin about his real life. ",
    isoDate: "2016-01-18T08:00:00.000Z"
  },
  {
    id: "118",
    title: "Chris Gethard, Our Close Friend",
    pubDate: "Mon, 25 Jan 2016 08:00:00 GMT",
    description: "CHRIS GETHARD joins Hayes in New York for a surprise retrospective on Big Lake, the Comedy Central show Chris starred in and Hayes wrote for, to dispel the rumors and reveal the true story once and for all. ",
    isoDate: "2016-01-25T08:00:00.000Z"
  },
  {
    id: "119",
    title: "Friends, Our Close Friends",
    pubDate: "Mon, 01 Feb 2016 08:00:00 GMT",
    description: "Hayes is still in New York. Sean does the show alone with Brett. ",
    isoDate: "2016-02-01T08:00:00.000Z"
  },
  {
    id: "120",
    title: "Brandon Gardner, Our Close Friend",
    pubDate: "Mon, 08 Feb 2016 08:00:00 GMT",
    description: `Hayes and Sean are talkin' sports this week as they dish out some hot takes about their feelings on "a very large event". Then, they chat with Brandon Gardner about his career in advertising and he lets them peak behind the curtain a little bit. `,
    isoDate: "2016-02-08T08:00:00.000Z"
  },
  {
    id: "121",
    title: "Maria Thayer, Our Close Friend",
    pubDate: "Mon, 15 Feb 2016 08:00:00 GMT",
    description: "Hayes and Sean immediately start having a conversation with MARIA THAYER where they offer romantic advice to the listeners and get some of their own as well. ",
    isoDate: "2016-02-15T08:00:00.000Z"
  },
  {
    id: "122",
    title: "Deadpool, Our Close Fiend",
    pubDate: "Mon, 22 Feb 2016 08:00:00 GMT",
    description: "Sean and Hayes start with their political roundup, then welcome guest KARAN SONI to discuss all things Deadpool, including funny things Deadpool did to him on set, Deadpools lunch, and possible new humor techniques for Deadpool. ",
    isoDate: "2016-02-22T08:00:00.000Z"
  },
  {
    id: "123",
    title: "Kulap Vilaysack, Our Close Friend",
    pubDate: "Mon, 29 Feb 2016 08:00:00 GMT",
    description: 'Sean and Hayes open up the Teaser Freezer to discuss the hot new teaser for "Criminal." Then KULAP VILAYSACK from "Who Charted" appears to help the guys do a chart of their own. ',
    isoDate: "2016-02-29T08:00:00.000Z"
  },
  {
    id: "124",
    title: "Big Apple Bible, Episode 1",
    pubDate: "Mon, 07 Mar 2016 08:00:00 GMT",
    description: "Hayes and Sean are called into a high-stakes business meeting. \xA0 ",
    isoDate: "2016-03-07T08:00:00.000Z"
  },
  {
    id: "125",
    title: "LIVE FROM SXSW: The Future of Comedy",
    pubDate: "Mon, 14 Mar 2016 10:00:00 GMT",
    description: "The boys appear LIVE at an SXSW panel hosted by a major star and take questions about podcasting and technology, then fly home to do a guest segment with college basketball expert BRANDON GARDNER. ",
    isoDate: "2016-03-14T10:00:00.000Z"
  },
  {
    id: "126",
    title: "Julie Klausner Again, Our Close Friend",
    pubDate: "Mon, 21 Mar 2016 10:00:00 GMT",
    description: "Hayes and Sean speculate as to some other interesting superheroes who could be fighting each other in a movie. Then JULIE KLAUSNER joins the team to redo her celebrated musical episode of the show except not with Dave Matthews this time. ",
    isoDate: "2016-03-21T10:00:00.000Z"
  },
  {
    id: "127",
    title: "UNTITLED CLEMENTS-DAVENPORT PROJECT, Pt. 1",
    pubDate: "Mon, 28 Mar 2016 10:00:00 GMT",
    description: "Sean and Hayes are taking their listeners inside the process of crafting a network pilot by recording every step of the process. This week: Brainstorming and Outlining. ",
    isoDate: "2016-03-28T10:00:00.000Z"
  },
  {
    id: "128",
    title: "Adam Sachs, Our Cool Bossfriend",
    pubDate: "Mon, 04 Apr 2016 10:00:00 GMT",
    description: "Sean and Hayes take a Twitter request to discuss the teaser for Hardcore Henry and arrive at some big questions. Then they invite Earwolf/Midroll CEO ADAM SACHS to join them just to hang out as friends and not because they're worried about being cancelled. ",
    isoDate: "2016-04-04T10:00:00.000Z"
  },
  {
    id: "129",
    title: "Engineer Cody's Engineer Training Boot Camp and School LIVE",
    pubDate: "Mon, 11 Apr 2016 10:00:00 GMT",
    description: "Sean and Hayes appear in front of a live audience to offer tips on personal health and how to eat, then welcome Engineer Cody and special guest TOM SCHARPLING for an inside look at Engineer Cody's Engineer Training Boot Camp and School. ",
    isoDate: "2016-04-11T10:00:00.000Z"
  },
  {
    id: "130",
    title: "Mike Lawrence, Our Close Friend",
    pubDate: "Mon, 18 Apr 2016 10:00:00 GMT",
    description: "Sean and Hayes reveal themselves to be sneakerheads and discuss the newest sneakers they've bought. Then MIKE LAWRENCE joins in for a quick trip to the Popcorn Gallery. ",
    isoDate: "2016-04-18T10:00:00.000Z"
  },
  {
    id: "131",
    title: "Jake and Amir, Our Close Friends",
    pubDate: "Mon, 25 Apr 2016 10:00:00 GMT",
    description: "Sean and Hayes have to make one of the most difficult decisions in the history of the show: decide on what to order for lunch. Then, JAKE HURWITZ and AMIR BLUMENFELD arrive for an unedited episode to speak on their growing podcast network HeadGum and what we can expect to see from them in the future. ",
    isoDate: "2016-04-25T10:00:00.000Z"
  },
  {
    id: "132",
    title: "Annaliese, Our Song Singer",
    pubDate: "Mon, 02 May 2016 10:00:00 GMT",
    description: 'Sean and Hayes do another segment about "Ehh! Wrong" about their Comedy Bang Bang appearance and movie criticism. Then musician and theme song performer ANNALIESE joins the guys to help them create a fresh theme with the help of Producer Engineer Brett. ',
    isoDate: "2016-05-02T10:00:00.000Z"
  },
  {
    id: "133",
    title: "Alison Rich, Our Close Friend",
    pubDate: "Mon, 09 May 2016 10:00:00 GMT",
    description: "Sean and Hayes give each other their annual physical exam. Then ALISON RICH comes in to explain Party Over Here and discuss favorite influences and some interesting science and history. ",
    isoDate: "2016-05-09T10:00:00.000Z"
  },
  {
    id: "134",
    title: "Far East Movement, Our Favorite Band",
    pubDate: "Mon, 16 May 2016 10:00:00 GMT",
    description: "Hayes and Sean are brought to the studio against their will for an unscheduled record. This episode is sponsored by Nudist Colony Clothing. ",
    isoDate: "2016-05-16T10:00:00.000Z"
  },
  {
    id: "135",
    title: "Jon Daly, Our Close Friend",
    pubDate: "Mon, 23 May 2016 10:00:00 GMT",
    description: "Hayes and Sean give tips on a fun hobby of theirs which is gardening. Then JON DALY joins the discussion to write a children's book with the boys. ",
    isoDate: "2016-05-23T10:00:00.000Z"
  },
  {
    id: "136",
    title: "Alex Blumberg, Our Live Helper at Being the Best Podcast at the Live Show",
    pubDate: "Mon, 30 May 2016 10:00:00 GMT",
    description: "The boys do a live show at VultureFest in New York City's historic Casper Podcast Lounge, and execute their plan to become the number-one podcast on iTunes with the help of podcast guru ALEX BLUMBERG. ",
    isoDate: "2016-05-30T10:00:00.000Z"
  },
  {
    id: "137",
    title: "SECRET PHONE CALL RELEASED BY BRETT",
    pubDate: "Mon, 06 Jun 2016 10:00:00 GMT",
    description: "This is a secret phone call Hayes and Sean did at my house, Brett. This is Brett writing this. It happened at my house and then, I recorded it. ",
    isoDate: "2016-06-06T10:00:00.000Z"
  },
  {
    id: "138",
    title: "Chris Gethard, Sean's Close Friend",
    pubDate: "Mon, 13 Jun 2016 10:00:00 GMT",
    description: "Sean sits down with Chris Gethard to do an episode with him as good as the one Hayes did or even more. ",
    isoDate: "2016-06-13T10:00:00.000Z"
  },
  {
    id: "139",
    title: "Matt Besser, Our Crossovered Friend",
    pubDate: "Mon, 20 Jun 2016 10:00:00 GMT",
    description: "Hayes and Sean sit down with UCB founder and improv4humans host MATT BESSER for a forced crossover episode and compare emails with notes they've received from Earwolf brass. ",
    isoDate: "2016-06-20T10:00:00.000Z"
  },
  {
    id: "140",
    title: "Sharon Horgan, Our Close Friend",
    pubDate: "Mon, 27 Jun 2016 10:00:00 GMT",
    description: "Hayes and Tom invite SHARON HORGAN to stop by the Handbook East studio to do community service by workshopping some jokes from past episodes while Sean calls in. \xA0 ",
    isoDate: "2016-06-27T10:00:00.000Z"
  },
  {
    id: "141",
    title: "Karen Kilgariff, Our Close Friend",
    pubDate: "Mon, 04 Jul 2016 10:00:00 GMT",
    description: 'Sean and Hayes demand that Intern Andy tell them how he lost all the donor shout-outs and then got lost himself. Then KAREN KILGARIFF joins the show to discuss her podcast "My Favorite Murder" and help administer a psychopath test for the boys and Engineer Cody. This episode is sponsored by Blue Apron and Casper Mattresses. ',
    isoDate: "2016-07-04T10:00:00.000Z"
  },
  {
    id: "142",
    title: "The Great Debates, Our Close Friends",
    pubDate: "Mon, 11 Jul 2016 10:00:00 GMT",
    description: "Hayes and Sean invite the three Great Debates, Dave King, Steve Hely and Dan Medina, into the studio to engage in some of their famous debates from their podcast and tell Hollywood stories. ",
    isoDate: "2016-07-11T10:00:00.000Z"
  },
  {
    id: "143",
    title: "Showrunners Panel, Our Major Event",
    pubDate: "Mon, 18 Jul 2016 10:00:00 GMT",
    description: "Hayes and Sean team up with fellow showrunners PATRICK WALSH and KEVIN ETTEN to convene a panel on the job of running a writers room where they hold a draft to create the strongest possible room using anyone from history. \xA0 ",
    isoDate: "2016-07-18T10:00:00.000Z"
  },
  {
    id: "144",
    title: "Howard Kremer, Our Close Friend",
    pubDate: "Mon, 25 Jul 2016 10:00:00 GMT",
    description: "Hayes and Sean have to reprimand a crazed fan. Then HOWARD KREMER joins the guys to organically discuss a service they all love. This episode is sponsored by Five Four Group. ",
    isoDate: "2016-07-25T10:00:00.000Z"
  },
  {
    id: "145",
    title: "Whitmer Thomas and Clay Tatum, Our Friends From School",
    pubDate: "Mon, 01 Aug 2016 10:00:00 GMT",
    description: "Hayes and Sean welcome Whit and Clay into the studio to discuss one of their favorite new games before a drama arises. ",
    isoDate: "2016-08-01T10:00:00.000Z"
  },
  {
    id: "146",
    title: "Gabe Delahaye, Our Close Friend",
    pubDate: "Mon, 08 Aug 2016 10:00:00 GMT",
    description: "Hayes and Sean discuss which guys they like to root for in the Olympics. Then GABE DELAHAYE arrives to plug the website Videogum and help Sean and Hayes understand some of Internet technology. ",
    isoDate: "2016-08-08T10:00:00.000Z"
  },
  {
    id: "147",
    title: "Julie Klausner, Back Again",
    pubDate: "Mon, 15 Aug 2016 10:00:00 GMT",
    description: "Julie Klausner joins the boys again to reminisce on her past episodes and get a little political. Then, Sean does some of his classic impressions and the gang picks their Mt. Crushmore. ",
    isoDate: "2016-08-15T10:00:00.000Z"
  },
  {
    id: "148",
    title: "Andre Vermeulen, Our Close Friend",
    pubDate: "Mon, 22 Aug 2016 10:00:00 GMT",
    description: "Hayes and Sean are joined by Angie Tribeca's Andr\xE9e Vermeulen for a freewheeling discussion of her showbiz journey that's barely interrupted by stuff going on in Hayes and Sean's personal lives. ",
    isoDate: "2016-08-22T10:00:00.000Z"
  },
  {
    id: "149",
    title: "Just Sean and Hayes",
    pubDate: "Mon, 29 Aug 2016 10:00:00 GMT",
    description: 'The boys are back with a guestless episode where they play a game of "Stank or Dank", followed by a round of a special board game. Come see us at the Now Hear This podcast festival: nowhearthisfest.com ',
    isoDate: "2016-08-29T10:00:00.000Z"
  },
  {
    id: "150",
    title: "Brett Marcus, Our Engineer Friend from Germany",
    pubDate: "Mon, 05 Sep 2016 10:00:00 GMT",
    description: "Hayes is late to the studio so Sean and Brett have some time to catch up. ALYSSA MILANO is the guest. Come see us at the Now Hear This podcast festival: nowhearthisfest.com This episode Five Four Group and Casper Mattresses. ",
    isoDate: "2016-09-05T10:00:00.000Z"
  },
  {
    id: "151",
    title: "Beck Bennett, Our Once Friend",
    pubDate: "Mon, 12 Sep 2016 10:00:00 GMT",
    description: "Sean and Hayes get Weekend Live's BECK BENNETT to come to the studio and discuss the controversy that drove them apart many years ago. ",
    isoDate: "2016-09-12T10:00:00.000Z"
  },
  {
    id: "152",
    title: "Mike And Dave, Our Wedding Dates Not Needers",
    pubDate: "Mon, 19 Sep 2016 10:00:00 GMT",
    description: `Sean and Hayes invite MIKE HANFORD and DAVE FERGUSON from the Birthday Boys on the show but they have been busy so they're not sure what they're going to do yet. Listen to Mike's show "Questions for Lennon" on Howl. `,
    isoDate: "2016-09-19T10:00:00.000Z"
  },
  {
    id: "153",
    title: "Jen D'Angelo, Our Close Friend",
    pubDate: "Mon, 26 Sep 2016 10:00:00 GMT",
    description: "Sean and Hayes make a major politics announcement. Then JEN D'ANGELO of MTV's Loosely Exactly Nicole makes the scene for a nice return to the traditional episodes that the boys used to do before. This episode is brought to you by Harry's and Blue Apron. ",
    isoDate: "2016-09-26T10:00:00.000Z"
  },
  {
    id: "154",
    title: "Brandon Wardell, Our Close Friend",
    pubDate: "Mon, 03 Oct 2016 10:00:00 GMT",
    description: "Hayes is in the studio with famous young comedian BRANDON WARDELL to talk about computers and doing Tough Mudder while Sean calls in from abroad. ",
    isoDate: "2016-10-03T10:00:00.000Z"
  },
  {
    id: "155",
    title: "Keith and Jesse, Our Food Explorers",
    pubDate: "Mon, 10 Oct 2016 10:00:00 GMT",
    description: "Sean and Hayes have a secret surprise for Engineer Sam. Then new clients KEITH KINGBAY and JESSE NEIL come to an exotic restaurant with the boys to sample interesting foods. ",
    isoDate: "2016-10-10T10:00:00.000Z"
  },
  {
    id: "156",
    title: "Jensen Karp, Our Close Friend",
    pubDate: "Mon, 17 Oct 2016 10:00:00 GMT",
    description: "Sean and Hayes invite JENSEN KARP, host of Get Up On This, to come on the show and all do their own Get Up On This after Sean and Hayes did it so well two weeks ago. ",
    isoDate: "2016-10-17T10:00:00.000Z"
  },
  {
    id: "157",
    title: "Adam Pally, Our Bumper Recorder",
    pubDate: "Mon, 24 Oct 2016 10:00:00 GMT",
    description: "Adam Pally joins the boys to record some promotional bumpers for the show. This episode is sponsored by Now Hear This, ZipRecruiter, and Harry's. ",
    isoDate: "2016-10-24T10:00:00.000Z"
  },
  {
    id: "158",
    title: "Cody and Kevin, Our Facebook Friends",
    pubDate: "Mon, 31 Oct 2016 10:00:00 GMT",
    description: "Hayes and Sean share a disturbing story from Cody online and help Cody and Kevin make a good Facebook. ",
    isoDate: "2016-10-31T10:00:00.000Z"
  },
  {
    id: "159",
    title: "Jessica McKenna, Our Vote Video Person",
    pubDate: "Mon, 07 Nov 2016 08:00:00 GMT",
    description: "The boys are joined by Jessica McKenna to help them make a good funny video encouraging people to vote at the election. This episode is brought to you by Harry's. ",
    isoDate: "2016-11-07T08:00:00.000Z"
  },
  {
    id: "160",
    title: "Beth Newell and Sarah Pappalardo, Our Good Friends",
    pubDate: "Mon, 14 Nov 2016 08:00:00 GMT",
    description: 'Hayes and Sean have a discussion with BETH NEWELL and SARAH PAPPALARDO from Reductress about their new book "How to Win at Feminism" in a show that is not changed at all by the results of the election. \xA0 This episode is sponsored by ZipRecruiter. ',
    isoDate: "2016-11-14T08:00:00.000Z"
  },
  {
    id: "161",
    title: "Ryan Stanger, Our Close Friend",
    pubDate: "Mon, 21 Nov 2016 08:00:00 GMT",
    description: "Hayes and Sean welcome their trainer RYAN STANGER of the Dumbbells podcast to teach them about being strong. \xA0 This episode is brought to you by Harry's. \xA0 \xA0 ",
    isoDate: "2016-11-21T08:00:00.000Z"
  },
  {
    id: "162",
    title: "D'Arcy Carden, Our Close Friend",
    pubDate: "Mon, 28 Nov 2016 08:00:00 GMT",
    description: "The boys are joined by D'ARCY CARDEN from The Good Place to talk about who gets to go there and other big questions. \xA0 This episode is sponsored by SockFancy. \xA0 \xA0 ",
    isoDate: "2016-11-28T08:00:00.000Z"
  },
  {
    id: "163",
    title: "Yassir Lester, Our Close Friend",
    pubDate: "Mon, 05 Dec 2016 08:00:00 GMT",
    description: "Sean and Hayes are joined by standup/model YASSIR LESTER for a conversation about the arts of standup comedy and modeling. This episode is brought to you by SockFancy (www.sockfancy.com/handbook), Harry's (www.harrys.com code: HANDBOOK), and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2016-12-05T08:00:00.000Z"
  },
  {
    id: "164",
    title: "Tom Scharpling, Our Christmas Show Architect",
    pubDate: "Mon, 12 Dec 2016 08:00:00 GMT",
    description: "Hayes travels to New York to hear Tom's pitch for the big annual Christmas show in person. This episode is sponsored by Harry's (www.harrys.com code: HANDBOOK). ",
    isoDate: "2016-12-12T08:00:00.000Z"
  },
  {
    id: "165",
    title: "Max Silvestri, Our Close Friend",
    pubDate: "Mon, 19 Dec 2016 08:00:00 GMT",
    description: "The HH boys allow comedian MAX SILVESTRI into the studio to talk about doing TV recaps and do some for us. This episode is sponsored by Harry's (www.harrys.com code: HANDBOOK) ",
    isoDate: "2016-12-19T08:00:00.000Z"
  },
  {
    id: "166",
    title: "Normal People, Our Close Friends LIVE",
    pubDate: "Mon, 26 Dec 2016 08:00:00 GMT",
    description: "Hayes and Sean do the Now Hear This Festival in Anaheim and they're sick of celebrity culture so they talk to everyday people from the crowd for once about being nerds. ",
    isoDate: "2016-12-26T08:00:00.000Z"
  },
  {
    id: "167",
    title: "Ben Rodgers, Our Boo 2016 Friend",
    pubDate: "Mon, 02 Jan 2017 08:00:00 GMT",
    description: "Ben Rodgers helps the gentlemen you love say goodbye to the evil 2016 with a memorial of someone they lost. \xA0 This episode is brought to you by Blue Apron (www.blueapron.com/handbook) and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-01-02T08:00:00.000Z"
  },
  {
    id: "168",
    title: "Will Greenberg, Our Close Friend",
    pubDate: "Mon, 09 Jan 2017 08:00:00 GMT",
    description: `The boys Hayes and Sean open the Teaser Freezer and discover the teaser for "The Comedian" in there. Then WILL GREENBERG of TBS's "Wrecked" arrives to pick his desert island discs because Wrecked is on a desert island. \xA0 This episode is brought to you by MVMT Watches (www.mvmtwatches.com/hollywood) and Casper Mattresses (www.casper.com/handbook). `,
    isoDate: "2017-01-09T08:00:00.000Z"
  },
  {
    id: "169",
    title: "Higher And Mightier With Joe Wengert",
    pubDate: "Mon, 16 Jan 2017 08:00:00 GMT",
    description: "Sean gets dropped off at Brett's house to record a secret episode. \xA0 This episode is brought to you by Harold Ramis Film School, Blue Apron (www.blueapron.com/handbook), and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-01-16T08:00:00.000Z"
  },
  {
    id: "170",
    title: "The Wendigabrus, Our Close Friend",
    pubDate: "Mon, 23 Jan 2017 08:00:00 GMT",
    description: "Sean and JON GABRUS help Hayes resolve an issue that has arisen from last week's episode. \xA0 This episode is sponsored by The Harold Ramis Film School, ZipRecruiter (www.ziprecruiter.com/first), and Harry's (www.harrys.com code: HANDBOOK). ",
    isoDate: "2017-01-23T08:00:00.000Z"
  },
  {
    id: "171",
    title: "Chris Bannon, Our Close Boss",
    pubDate: "Mon, 30 Jan 2017 08:00:00 GMT",
    description: "Hayes and Sean return from a visit to Washington to begin a negotiation with Earwolf boss CHRIS BANNON. This episode is sponsored by Blue Apron (www.blueapron.com/handbook) and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-01-30T08:00:00.000Z"
  },
  {
    id: "172",
    title: "Julie Klausner, Our Close Friend Once Again",
    pubDate: "Mon, 06 Feb 2017 08:00:00 GMT",
    description: "The boys do another insane challenge they learned about on the computer, then JULIE KLAUSNER joins the show to help them with a new project. \xA0 This episode is sponsored by Shari's Berries(www.berries.com code: HOLLYWOODHANDBOOK) and MVMT Watches (www.mvmtwatches.com/hollywood). ",
    isoDate: "2017-02-06T08:00:00.000Z"
  },
  {
    id: "173",
    title: "Mike Mitchell, Our Close Friend",
    pubDate: "Mon, 13 Feb 2017 08:00:00 GMT",
    description: "Sean and Hayes provide a tutorial on a difficult subject they've studied. Then MIKE MITCHELL of the famous Doughboys joins the discussion to reveal whether he eats the food. This episode is sponsored by Casper Mattresses (www.casper.com/handbook code: HANDBOOK) and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-02-13T08:00:00.000Z"
  },
  {
    id: "174",
    title: "Stephanie and Elizabeth, Our Spiritual Advisors",
    pubDate: "Mon, 20 Feb 2017 08:00:00 GMT",
    description: "Hayes and Sean give a brief tutorial on trees art, then STEPHANIE SIMBARI and ELIZABETH KOTT from the That's So Retrograde podcast do the show to teach about crystals and the stars. \xA0 This episode is sponsored by Blue Apron (www.blueapron.com/handbook) and Stamps.com (www.stamps.com code: HANDBOOK). ",
    isoDate: "2017-02-20T08:00:00.000Z"
  },
  {
    id: "175",
    title: "Dan Lippert, Our Oscars Friend",
    pubDate: "Mon, 27 Feb 2017 08:00:00 GMT",
    description: "With the Oscars coming up, DAN LIPPERT from Big Grande's The Teachers' Lounge helps Sean and Hayes make their predictions for the big show. \xA0 This episode is sponsored by Harry's (www.harrys.com/hollywoodhandbook) and Blue Apron (www.blueapron.com/handbook). ",
    isoDate: "2017-02-27T08:00:00.000Z"
  },
  {
    id: "176",
    title: "Ike Barinholtz, Our Close Friend",
    pubDate: "Mon, 06 Mar 2017 08:00:00 GMT",
    description: "Sean and Hayes discuss the big snafu. Then IKE BARINHOLTZ comes in to talk about the major spoof movies hes done and to read one written by the hosts. This episode is brought to you by ZipRecruiter (www.ziprecruiter.com/first) and MVMT Watches (www.mvmtwatches.com/hollywood). ",
    isoDate: "2017-03-06T08:00:00.000Z"
  },
  {
    id: "177",
    title: "Wild Horses, Our Close Friends",
    pubDate: "Mon, 13 Mar 2017 10:00:00 GMT",
    description: "Hayes and Sean are joined by MARY HOLLAND, LAUREN LAPKUS, and ERIN WHITEHEAD to talk about doing comedy as a group. This episode is sponsored by Casper Mattresses (www.casper.com/handbook) and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-03-13T10:00:00.000Z"
  },
  {
    id: "178",
    title: "Kulap Vilaysack, Our Close Friend Again",
    pubDate: "Mon, 20 Mar 2017 10:00:00 GMT",
    description: "Sean and Hayes introduce a strategy for online. Then KULAP VILAYSACK joins them in studio to help debut a new chart. This episode is sponsored by Blue Apron (www.blueapron.com/handbook) and Stamps.com (www.stamps.com code: HANDBOOK). ",
    isoDate: "2017-03-20T10:00:00.000Z"
  },
  {
    id: "179",
    title: "Alison Rich, Our Close Friend Again",
    pubDate: "Mon, 27 Mar 2017 10:00:00 GMT",
    description: "The boys Sean and Hayes are rejoined by Alison Rich to talk about possible jobs. \xA0 This episode is sponsored by Blue Apron (www.blueapron.com/handbook) and Harry's (www.harrys.com/hollywoodhandbook). ",
    isoDate: "2017-03-27T10:00:00.000Z"
  },
  {
    id: "180",
    title: "Mikal Cronin, Our Close Music",
    pubDate: "Mon, 03 Apr 2017 10:00:00 GMT",
    description: "Big business has intervened in Sean and Hayes being able to do the show the way they want to so they get MIKAL CRONIN to join them and fight corporations with music. This episode is sponsored by MVMT Watches (www.mvmtwatches.com/hollywood) and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-04-03T10:00:00.000Z"
  },
  {
    id: "181",
    title: "Carl Tart, Our Close Friend",
    pubDate: "Mon, 10 Apr 2017 10:00:00 GMT",
    description: "Sean and Hayes discuss helpful tricks. Then CARL TART joins them in studio to talk about some other famous jokers and to help teach the boys. \xA0 This episode is brought to you by Blue Apron (www.blueapron.com/handbook) and Casper Mattresses (www.casper.com/handbook) ",
    isoDate: "2017-04-10T10:00:00.000Z"
  },
  {
    id: "182",
    title: "Doing Spont, Our Close Friend",
    pubDate: "Mon, 17 Apr 2017 10:00:00 GMT",
    description: "Sean and Hayes host the show you love with their guest, Paul F. Tompkins. This episode is brought to you by Stamps.com (www.stamps.com code: HANDBOOK) and ZipRecruiter (www.ziprecruiter.com/first). ",
    isoDate: "2017-04-17T10:00:00.000Z"
  },
  {
    id: "183",
    title: "Employee Reviews, Our Useful Tool",
    pubDate: "Tue, 25 Apr 2017 10:00:00 GMT",
    description: "A shocking revelation forces Sean and Hayes to have discussions with the staff. \xA0 \xA0 This episode is sponsored by ZipRecruiter (www.ziprecruiter.com/first) and Harry's (www.harrys.com/HOLLYWOODHANDBOOK). ",
    isoDate: "2017-04-25T10:00:00.000Z"
  },
  {
    id: "184",
    title: "Drew Tarver, Our Close Friend",
    pubDate: "Tue, 02 May 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by DREW TARVER of Big Grande and Bajillion Dollar Properties to help them and Intern Andy do a new kind of show. This episode is sponsored by Generation Tux (www.generationtux.com code: HANDBOOK), MVMT Watches (www.mvmtwatches.com/hollywood), and Shari's Berries (www.berries.com code: HOLLYWOODHANDBOOK). ",
    isoDate: "2017-05-02T10:00:00.000Z"
  },
  {
    id: "185",
    title: "Zeke Nicholson, Our Close Friend",
    pubDate: "Tue, 09 May 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by ZEKE NICHOLSON of Lopez for a discussion of how to get so much work done. This episode is brought to you by Casper Mattresses (www.casper.com/handbook) and Blue Apron (www.blueapron.com/handbook). ",
    isoDate: "2017-05-09T10:00:00.000Z"
  },
  {
    id: "186",
    title: "New Card Business, Our Close Friend",
    pubDate: "Tue, 16 May 2017 10:00:00 GMT",
    description: "Sean and Hayes execute a business plan. \xA0 This episode is brought to you by Stamps.com (www.stamps.com code: HANDBOOK) and ZipRecruiter (www.ziprecrutier.com/first). ",
    isoDate: "2017-05-16T10:00:00.000Z"
  },
  {
    id: "187",
    title: "Tom Scharpling, Our Vulture Fest Friend",
    pubDate: "Mon, 22 May 2017 10:00:00 GMT",
    description: "The boys welcome back TOM SCHARPLING to help them with their podcast panel.\xA0\xA0This episode is brought to you by ZipRecruiter (www.ziprecruiter.com/first) and Harry's (www.harrys.com/HOLLYWOODHANDBOOK). ",
    isoDate: "2017-05-22T10:00:00.000Z"
  },
  {
    id: "188",
    title: "Tawny Newsome, Our Close Friend",
    pubDate: "Tue, 30 May 2017 10:00:00 GMT",
    description: "Sean and Hayes bring in TAWNY NEWSOME from Bajillion Dollar Properties for a real estate venture. \xA0 \xA0 This episode is brought to you by Casper Mattresses (www.casper.com/handbook code: HANDBOOK). ",
    isoDate: "2017-05-30T10:00:00.000Z"
  },
  {
    id: "189",
    title: "Mookie Blaiklock, Our Evergreen Friend",
    pubDate: "Tue, 06 Jun 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by MOOKIE BLAIKLOCK to record a normal episode of the show in the present day. \xA0 \xA0 This episode is sponsored by Happy Socks (www.happysocks.com/handbook code: HANDBOOK) and Blue Apron (www.blueapron.com/handbook). ",
    isoDate: "2017-06-06T10:00:00.000Z"
  },
  {
    id: "190",
    title: "Bang Rodgeman, Our Spinoff Friend",
    pubDate: "Tue, 13 Jun 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by aspiring actor Bang Rodgeman for a sneak peek sample of Hollywood Masterclass, his spinoff show with just Sean and not Hayes. \xA0 This episode is sponsored by ZipRecruiter (www.ziprecruiter.com/first) and Casper Mattresses (www.casper.com/HANDBOOK). ",
    isoDate: "2017-06-13T10:00:00.000Z"
  },
  {
    id: "191",
    title: "Eugene Cordero, Our Close Friend",
    pubDate: "Tue, 20 Jun 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by monster expert EUGENE CORDERO to help them plot out the Dark Universe franchise that they bought recently. \xA0 This episode is sponsored by Stamps.com (www.stamp.com code:HANDBOOK) and Happy Socks (www.happysocks.com/handbook code: HANDBOOK). ",
    isoDate: "2017-06-20T10:00:00.000Z"
  },
  {
    id: "192",
    title: "Julie Klausner, Our Tonys Friend",
    pubDate: "Tue, 27 Jun 2017 10:00:00 GMT",
    description: "Sean and Hayes are once again joined by JULIE KLAUSNER to help them prepare a show that will win the upcoming Tony Awards. This episode is sponsored by Harry's (www.harrys.com/hollywoodhandbook) and Chapman University (www.chapman.edu/grad). ",
    isoDate: "2017-06-27T10:00:00.000Z"
  },
  {
    id: "193",
    title: "Holly Prazoff, Our Close Friend",
    pubDate: "Tue, 04 Jul 2017 10:00:00 GMT",
    description: "Sean and Hayes sit down with HOLLY PRAZOFF to learn about Canada and to help Kevin with something. \xA0 This episode is sponsored by Blue Apron (www.blueapron.com/handbook) and Chapman University (www.chapman.edu/grad). ",
    isoDate: "2017-07-04T10:00:00.000Z"
  },
  {
    id: "194",
    title: "The I Was There Me Too Show",
    pubDate: "Tue, 11 Jul 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by MATT GOURLEY to help him do his show I Was There Me Too from now on. \xA0 \xA0 This episode is sponsored by The Big Sick, Casper Mattresses (www.casper.com/HANDBOOK code: HANDBOOK), and Chapman University (www.chapman.edu/grad). ",
    isoDate: "2017-07-11T10:00:00.000Z"
  },
  {
    id: "195",
    title: "Spencer Crittenden, Our Close Friend",
    pubDate: "Tue, 18 Jul 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by SPENCER CRITTENDEN of Harmontown and they play a game. \xA0 \xA0 This episode is sponsored by Chapman University (www.chapman.edu/grad) and Harry's (www.harrys.com/HOLLYWOODHANDBOOK). ",
    isoDate: "2017-07-18T10:00:00.000Z"
  },
  {
    id: "195.5",
    title: "Everybody's Gotta Eat! (w/ Hayes Davenport)",
    pubDate: "Tue, 25 Jul 2017 10:00:00 GMT",
    description: "Truth is, ya gotta pay the bills, and having a little \u201Cfuck you money\u201D don\u2019t hurt neither.\xA0For more Hollywood Masterclass, subscribe to Stitcher Premium (www.howl.fm/hollywood).\xA0\xA0This episode is brought to you by ZipRecruiter (www.ziprecruiter.com/FIRST), Stamps.com (www.stamps.com code: HANDBOOK), and Audible's Hold On with Eugene Mirman. ",
    isoDate: "2017-07-25T10:00:00.000Z"
  },
  {
    id: "196",
    title: "Dom, The Scuzzman, and the Commenter Hunt",
    pubDate: "Tue, 01 Aug 2017 10:00:00 GMT",
    description: "Sean catches up with his former writing partner DOMINIC DIERKES and Dom's new partner THE SCUZZMAN. Then Hayes calls in from out of town. This episode is sponsored by Blue Apron (www.blueapron.com/handbook) and Chapman University (www.chapman.edu/grad). ",
    isoDate: "2017-08-01T10:00:00.000Z"
  },
  {
    id: "197",
    title: "Nicole Byer, Our Close Friend Again",
    pubDate: "Tue, 08 Aug 2017 10:00:00 GMT",
    description: "Welcome to NICOLE BYER from Loosely Exactly Nicole to talk about the game show Family Feud she did and to do other funny shows. \xA0 This episode is sponsored by Casper Mattresses (www.casper.com/HANDBOOK code: HANDBOOK) and Chapman University (www.chapman.edu/GRAD). ",
    isoDate: "2017-08-08T10:00:00.000Z"
  },
  {
    id: "198",
    title: "Nick Wiger, Our Segment Advisor",
    pubDate: "Tue, 15 Aug 2017 10:00:00 GMT",
    description: "NICK WIGER from the Doughboys has come to visit the boys and help them come up with some new segments for their show. \xA0 This episode is brought to you by Chapman University (www.chapman.edu/grad). ",
    isoDate: "2017-08-15T10:00:00.000Z"
  },
  {
    id: "199",
    title: "Scott Aukerman, Our 199th Episode Guest",
    pubDate: "Tue, 22 Aug 2017 10:00:00 GMT",
    description: "Sean and Hayes welcome SCOTT AUKERMAN into the studio to help him with a huge problem he has. \xA0 This episode is sponsored by Wohven (www.wohven.com code: theboys), Stamps.com (www.stamps.com code: HANDBOOK) and ZipRecruiter (www.ziprecruiter.com/THEBOYS). ",
    isoDate: "2017-08-22T10:00:00.000Z"
  },
  {
    id: "200",
    title: "Episode 200, Our Unbelievable Achievement",
    pubDate: "Tue, 29 Aug 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by some very special friends of the show to celebrate their 200th and send it off once and for all. \xA0 This episode is sponsored by Wohven (www.wohven.com code: theboys), Harry's (www.harrys.com/HOLLYWOODHANDBOOK), and Blue Apron (www.blueapron.com/HANDBOOK). \xA0 You can grab the exclusive Hollywood Handbook 200th episode poster at PodSwag: https://www.podswag.com/collections/new-arrivals/products/hollywood-handbook-200th-episode-poster ",
    isoDate: "2017-08-29T10:00:00.000Z"
  },
  {
    id: "201",
    title: "Live at UCB Sunset w/ Kumail Nanjiani",
    pubDate: "Thu, 31 Aug 2017 10:00:00 GMT",
    description: "Sean and Hayes welcome Kumail Nanjiani on to the program to have a good talk about sex and body positivity. ",
    isoDate: "2017-08-31T10:00:00.000Z"
  },
  {
    id: "202",
    title: "Maria Blasucci and Amanda Lund, Our Close Friends",
    pubDate: "Tue, 05 Sep 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by MARIA BLASUCCI and AMANDA LUND from Stitcher Premium to discuss something. \xA0 \xA0 This episode is sponsored by Wohven (www.wohven.com code: theboys), Chapman University (www.chapman.edu/grad), and Harry's (www.harrys.com/HOLLYWOODHANDBOOK). ",
    isoDate: "2017-09-05T10:00:00.000Z"
  },
  {
    id: "203",
    title: "Lamar Woods, Our Close Friend",
    pubDate: "Tue, 12 Sep 2017 10:00:00 GMT",
    description: "Lamar Woods has an interesting conversation with Sean while Hayes is on his way. \xA0 This episode is sponsored by the Second City Training Center (www.secondcity.com\\TC  3126643959), Casper Mattresses (www.casper.com/HANDBOOK code: HANDBOOK) and ZipRecruiter (www.ziprecruiter.com/THEBOYS). ",
    isoDate: "2017-09-12T10:00:00.000Z"
  },
  {
    id: "204",
    title: "Rob Huebel, Our Close Friend",
    pubDate: "Tue, 19 Sep 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by ROB HUEBEL to review some of his most famous roles. \xA0 \xA0 This episode is sponsored by ZipRecruiter (www.ziprecruiter.com/THEBOYS) and the Second City Training Center (www.secondcity.com/TC) ",
    isoDate: "2017-09-19T10:00:00.000Z"
  },
  {
    id: "205",
    title: "Jessica Chaffin, Our Close Friend",
    pubDate: "Tue, 26 Sep 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by JESSICA CHAFFIN to shoot a pilot. This episode is sponsored by the Second City Training Center (www.secondcity.com/tc), ZipRecruiter (www.ziprecruiter.com/THEBOYS) and Blue Apron (www.blueapron.com/HANDBOOK). ",
    isoDate: "2017-09-26T10:00:00.000Z"
  },
  {
    id: "206",
    title: "Jason Mantzoukas, Our School Friend",
    pubDate: "Tue, 03 Oct 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by Jason Mantzoukas to tell puberty stories and promote Big Mouth on Netflix. This episode is sponsored by Chapman University (www.chapman.edu/GRAD) and The Second City Training Center (www.secondcity.com/tc). ",
    isoDate: "2017-10-03T10:00:00.000Z"
  },
  {
    id: "207",
    title: "DC Pierson, Our Saturday Night Friend",
    pubDate: "Tue, 10 Oct 2017 10:00:00 GMT",
    description: "Sean and Hayes welcome DC PIERSON into the studio to share characters from their SNL audition tapes. \xA0 \xA0 This episode is sponsored by the Second City Training Center, Casper Mattresses (code: HANDBOOK), and ZipRecruiter. ",
    isoDate: "2017-10-10T10:00:00.000Z"
  },
  {
    id: "208",
    title: "Lou Wilson, Our Close Friend",
    pubDate: "Tue, 17 Oct 2017 10:00:00 GMT",
    description: "Sean and Hayes bring LOU WILSON onto the show to hear about working on Netflix's American Vandal and also for something else. This episode is sponsored by The Second City Training Center. ",
    isoDate: "2017-10-17T10:00:00.000Z"
  },
  {
    id: "209",
    title: "Bryan Safi, Our Close Friend",
    pubDate: "Tue, 24 Oct 2017 10:00:00 GMT",
    description: "Sean and Hayes are so mad about something in the news that they got BRYAN SAFI from Throwing Shade to come on the show and help them out about it. \xA0 This episode is sponsored by The Second City Training Center and Blue Apron. ",
    isoDate: "2017-10-24T10:00:00.000Z"
  },
  {
    id: "210",
    title: "Erin Gibson, Our Close Friend Again",
    pubDate: "Tue, 31 Oct 2017 10:00:00 GMT",
    description: "Sean and Hayes are joined by ERIN GIBSON of Throwing Shade who is doing the show as a form of twisted revenge. \xA0 This episode is sponsored by Harry's and ZipRecruiter. ",
    isoDate: "2017-10-31T10:00:00.000Z"
  },
  {
    id: "211",
    title: "Jon Bass, Our Close Friend",
    pubDate: "Tue, 07 Nov 2017 08:00:00 GMT",
    description: "Jon Bass returns to the show to talk to Sean and Hayes about a big mistake he did. This episode is sponsored by ZipRecruiter and Blue Apron. ",
    isoDate: "2017-11-07T08:00:00.000Z"
  },
  {
    id: "212",
    title: "Lauren Lapkus, Our Close Friend Again",
    pubDate: "Tue, 14 Nov 2017 08:00:00 GMT",
    description: "LAUREN LAPKUS is with Sean and Hayes to promote her new show Raised by the TV. This episode is sponsored by Casper (code: HANDBOOK) and Harry's. ",
    isoDate: "2017-11-14T08:00:00.000Z"
  },
  {
    id: "213",
    title: "Jimmy Pardo, Our Close Friend",
    pubDate: "Tue, 21 Nov 2017 08:00:00 GMT",
    description: "Sean and Hayes have JIMMY PARDO as a guest to play games like on his new show, Playing Games with Jimmy Pardo. ",
    isoDate: "2017-11-21T08:00:00.000Z"
  },
  {
    id: "214",
    title: "Jess McKenna and Zach Reino, Our Good Collaborators",
    pubDate: "Tue, 28 Nov 2017 08:00:00 GMT",
    description: "Sean and Hayes partner with JESS MCKENNA and ZACH REINO from Off Book to do one of their famous songs but actually do a good job. ",
    isoDate: "2017-11-28T08:00:00.000Z"
  },
  {
    id: "215",
    title: "Kate Berlant and John Early, Our Close Friends",
    pubDate: "Tue, 05 Dec 2017 08:00:00 GMT",
    description: "Sean and Hayes say hello to KATE BERLANT and JOHN EARLY and talk to them about being duos and the business of Hollywood. This episode is sponsored by Simple Contacts (code: THEBOYS) and Harry's. ",
    isoDate: "2017-12-05T08:00:00.000Z"
  },
  {
    id: "216",
    title: "Meredith Hagner, Our Close Friend",
    pubDate: "Tue, 12 Dec 2017 08:00:00 GMT",
    description: "Sean and Hayes welcome MEREDITH HAGNER to Earwolf studios to share stories and get her help on a financial project they've been working on. This episode is sponsored by Casper Mattresses (code: HANDBOOK). ",
    isoDate: "2017-12-12T08:00:00.000Z"
  },
  {
    id: "217",
    title: "Listeners, Our Close Friends 4",
    pubDate: "Tue, 19 Dec 2017 08:00:00 GMT",
    description: "Sean and Hayes do another episode where the listeners call them and talk about their Best of 2017. ",
    isoDate: "2017-12-19T08:00:00.000Z"
  },
  {
    id: "218",
    title: "The Big Holiday Party",
    pubDate: "Tue, 26 Dec 2017 08:00:00 GMT",
    description: 'JAKE AND AMIR from the "If I Were You" podcast are in the studio along with many other guests to celebrate at the big Hollywood Handbook party for the holidays. ',
    isoDate: "2017-12-26T08:00:00.000Z"
  },
  {
    id: "219",
    title: "Matt Ingebretson and Jake Weisman, Our Close Friends",
    pubDate: "Tue, 02 Jan 2018 08:00:00 GMT",
    description: "Sean and Hayes are joined by MATT INGEBRETSON and JAKE WEISMAN from their new show Corporate on Comedy Central to tell stories. \xA0 This episode is sponsored by Casper Mattresses (code: HANDBOOK) and Blue Apron. ",
    isoDate: "2018-01-02T08:00:00.000Z"
  },
  {
    id: "220",
    title: "Mary Sasson, Our Close Friend",
    pubDate: "Tue, 09 Jan 2018 08:00:00 GMT",
    description: "Sean and Hayes have MARY SASSON come into the studio and it's about hair. \xA0 This episode is sponsored by Squarespace (code: THEBOYS). ",
    isoDate: "2018-01-09T08:00:00.000Z"
  },
  {
    id: "221",
    title: "Jen Statsky, Our Close Friend",
    pubDate: "Tue, 16 Jan 2018 08:00:00 GMT",
    description: "Sean and Hayes welcome JEN STATSKY into the studio to walk them through a day at her famous job. \xA0 This episode is sponsored by Casper Mattresses (code: HANDBOOK) and Blue Apron. ",
    isoDate: "2018-01-16T08:00:00.000Z"
  },
  {
    id: "222",
    title: "Shaun Diston, Our Globes Prediction Friend",
    pubDate: "Tue, 23 Jan 2018 08:00:00 GMT",
    description: "Sean and Hayes have SHAUN DISTON into the studio to record an episode from before the Golden Globes where they predict them. This episode is sponsored by Harry's. ",
    isoDate: "2018-01-23T08:00:00.000Z"
  },
  {
    id: "223",
    title: "Tawny Newsome and Her Friends, Our Close Friends",
    pubDate: "Tue, 30 Jan 2018 08:00:00 GMT",
    description: "TAWNY NEWSOME from Bajillion Dollar Properties returns to help the boys be a different kind of agent now. This episode is sponsored by Squarespace (code: THEBOYS), Simple Contacts (code: THEBOYS), and Blue Apron. ",
    isoDate: "2018-01-30T08:00:00.000Z"
  },
  {
    id: "224",
    title: "Nick Wiger, Our Corny Friend",
    pubDate: "Tue, 06 Feb 2018 08:00:00 GMT",
    description: "The Boys try to be helpful to Nick but he doesnt wanna listen. This episode is sponsored by Wargaming (www.commandwarships.com code: HOLLYWOOD18) and Casper Mattresses (code: HANDBOOK). ",
    isoDate: "2018-02-06T08:00:00.000Z"
  },
  {
    id: "225",
    title: "Ryan Gaul, Our Close Friend",
    pubDate: "Tue, 13 Feb 2018 08:00:00 GMT",
    description: "Ku-Ku and the Clem Dawg welcome RYAN GAUL from Berjerllion into the studio to do some of their famous segments. This episode is sponsored by Squarespace (code: THEBOYS), Wargaming (code: HOLLYWOOD18), and Blue Apron. ",
    isoDate: "2018-02-13T08:00:00.000Z"
  },
  {
    id: "226",
    title: "Tom Scharpling, Our Close Friend",
    pubDate: "Tue, 20 Feb 2018 08:00:00 GMT",
    description: "The boys are joined by TOM SCHARPLING in his big return to the studio and he meets someone new.\xA0This episode is sponsored by NBC's A.P. Bio and  Wargaming  (code: HOLLYWOOD18). ",
    isoDate: "2018-02-20T08:00:00.000Z"
  },
  {
    id: "227",
    title: "Claudia O'Doherty, Our Close Friend",
    pubDate: "Mon, 26 Feb 2018 08:00:00 GMT",
    description: `Sean and Hayes are joined by CLAUDIA O'DOHERTY from "Love" to help them read their new surf movie written by their friend.This episode is sponsored by  Squarespace  (code: THEBOYS), NBC's A.P. Bio, and  Wargaming  (code: HOLLYWOOD18). `,
    isoDate: "2018-02-26T08:00:00.000Z"
  },
  {
    id: "228",
    title: "Peter Serafinowicz and Griffin Newman, Our Junket Friends",
    pubDate: "Tue, 06 Mar 2018 08:00:00 GMT",
    description: "Sean and Hayes have a new way to get good guests with PETER SERAFINOWICZ and GRIFFIN NEWMAN from The Tick.This episode is sponsored by  Blue Apron  and  Hims . ",
    isoDate: "2018-03-06T08:00:00.000Z"
  },
  {
    id: "229",
    title: "Anders Holm, Our Close Friend Again",
    pubDate: "Tue, 13 Mar 2018 10:00:00 GMT",
    description: "Sean and Hayes welcome ANDERS HOLM from the new show Champions on NBC into the studio to talk about a certain kind of script that is interesting.\xA0This episode is sponsored by  Squarespace  (code: THEBOYS) and  Simple Contacts  (code: THEBOYS). ",
    isoDate: "2018-03-13T10:00:00.000Z"
  },
  {
    id: "230",
    title: "Julie Klausner, Our Goodbye Cody Friend",
    pubDate: "Tue, 20 Mar 2018 10:00:00 GMT",
    description: "Sean and Hayes are joined by JULIE KLAUSNER to do a tribute with music.This episode is sponsored by  Casper Mattresses  (code: THEBOYS) and  Harry's . ",
    isoDate: "2018-03-20T10:00:00.000Z"
  },
  {
    id: "231",
    title: "Ego Nwodim, Our Close Friend",
    pubDate: "Tue, 27 Mar 2018 10:00:00 GMT",
    description: "Sean and Hayes welcome EGO NWODIM from comedy into the studio to update a certain important list they all have.This episode is sponsored by  Squarespace  (code: THEBOYS),  Mack Weldon  (code: THE BOYS), and Audible ( www.audible.com/THEBOYS ). ",
    isoDate: "2018-03-27T10:00:00.000Z"
  },
  {
    id: "232",
    title: "Arden Myrin, Our #MovieRank Friend",
    pubDate: "Tue, 03 Apr 2018 10:00:00 GMT",
    description: "Sean and Hayes invite ARDEN MYRIN to help them finally rank all the movies and do #MovieRank.This episode is sponsored by LaRue Entertainment ( www.apocalypsesoonish.com ), Blue Apron ( www.blueapron.com/HANDBOOK) , hims ( www.forhims.com/HANDBOOK ), and Rehabs.com (888-893-3052). ",
    isoDate: "2018-04-03T10:00:00.000Z"
  },
  {
    id: "233",
    title: "Nicole Parker, Our Close Popcorn",
    pubDate: "Tue, 10 Apr 2018 10:00:00 GMT",
    description: "Sean and Hayes are joined by NICOLE PARKER for Hollywood Handbook presented by Popcornopolis.This episode is sponsored by Rehabs.com (888-893-3052), Casper Mattresses ( www.casper.com/THEBOYS  code: THEBOYS) and Simple Contacts ( www.simplecontacts.com/theboys  code: THEBOYS). ",
    isoDate: "2018-04-10T10:00:00.000Z"
  },
  {
    id: "234",
    title: "Joe Wengert, Our Contest Maker Friend",
    pubDate: "Mon, 16 Apr 2018 10:00:00 GMT",
    description: "The boys Sean and Hayes need JOE WENGERT to help them do a contest to beat another show.This episode is sponsored by Rehabs.com (888-893-3052). ",
    isoDate: "2018-04-16T10:00:00.000Z"
  },
  {
    id: "235",
    title: "Natalie Morales, Our Live Friend",
    pubDate: "Tue, 24 Apr 2018 10:00:00 GMT",
    description: "Sean and Hayes do a show at the Dynasty Typewriter and they're doing a movie about NATALIE MORALES from acting. ",
    isoDate: "2018-04-24T10:00:00.000Z"
  },
  {
    id: "236",
    title: "The Magic Tavern Guys, Our Close Friends",
    pubDate: "Tue, 01 May 2018 10:00:00 GMT",
    description: "Sean and Hayes have an idea to get more listeners and it's with ARNIE NIEKAMP, MATT YOUNG, and ADAL RIFAI from Hello From the Magic Tavern, the show and Offices and Bosses. Season 2 out now on Stitcher Premium.This episode is sponsored by Blue Apron ( www.blueapron.com/HANDBOOK ) and hims ( www.forhims.com/THEBOYS ). ",
    isoDate: "2018-05-01T10:00:00.000Z"
  },
  {
    id: "237",
    title: "Kate Micucci, Our Close Friend",
    pubDate: "Tue, 08 May 2018 10:00:00 GMT",
    description: "Sean and Hayes are accompanied by KATE MICUCCI from Garfunkel and Oates to do a festival again.This episode is brought to you by Simple Contacts ( www.simplecontacts.com/theboys  code: THEBOYS) and Uncharted Supply Co. ( www.unchartedsupplyco.com  code: THEBOYS). ",
    isoDate: "2018-05-08T10:00:00.000Z"
  },
  {
    id: "238",
    title: "Joe Mande, Our Close Friend",
    pubDate: "Mon, 14 May 2018 10:00:00 GMT",
    description: "Comedian Joe Mande joins The Boys to explain the jokes from his stand-up special.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS). ",
    isoDate: "2018-05-14T10:00:00.000Z"
  },
  {
    id: "239",
    title: "Dave Holmes, Our Close Friend Again",
    pubDate: "Tue, 22 May 2018 10:00:00 GMT",
    description: "Once again the two boys Sean and Hayes are joined by DAVE HOLMES but this time to learn how to do a book like he did.This episode is sponsored by Harry's ( www.harrys.com/HANDBOOK ) and Casper Mattresses ( www.casper.com/savings ). ",
    isoDate: "2018-05-22T10:00:00.000Z"
  },
  {
    id: "240",
    title: "Adam Lustick, Our Sad Friend",
    pubDate: "Mon, 28 May 2018 10:00:00 GMT",
    description: "Sean is joined by ADAM LUSTICK from Corporate for a call-in show during a tragedy.This episode is sponsored by Blue Apron ( www.blueapron.com/HANDBOOK ), hims ( www.forhims.com/THEBOYS ), and Uncharted Supply Co ( www.unchartedsupplyco.com/THEBOYS ). ",
    isoDate: "2018-05-28T10:00:00.000Z"
  },
  {
    id: "241",
    title: "Live from Onionfest",
    pubDate: "Tue, 05 Jun 2018 10:00:00 GMT",
    description: "The Boys have a little fun doing a live show in Chicago City.This episode is sponsored by Mack Weldon ( www.mackweldon.com code: THEBOYS ), Harry's ( www.harrys.com/HANDBOOK ), and Casper Mattresses ( www.casper.com/THEBOYS  code: THEBOYS). ",
    isoDate: "2018-06-05T10:00:00.000Z"
  },
  {
    id: "242",
    title: "Julie Klausner, Our Pilot Season Friend",
    pubDate: "Mon, 11 Jun 2018 10:00:00 GMT",
    description: "Sean and Hayes are joined by JULIE KLAUSNER once again for a big scoop.This episode is sponsored by Simple Contacts ( www.simplecontacts.com/theboys  code: THEBOYS). ",
    isoDate: "2018-06-11T10:00:00.000Z"
  },
  {
    id: "243",
    title: "Jordan Morris, Our Sci-Fi Friend",
    pubDate: "Mon, 18 Jun 2018 10:00:00 GMT",
    description: `Sean and Hayes are joined by return guest JORDAN MORRIS who's doing the "Bubble" sci-fi podcast and now he's doing another one on this show. `,
    isoDate: "2018-06-18T10:00:00.000Z"
  },
  {
    id: "244",
    title: "Joel Kim Booster, Our Close Friend",
    pubDate: "Mon, 25 Jun 2018 10:00:00 GMT",
    description: "Sean and Hayes talk to standup comedian JOEL KIM BOOSTER about a booking opportunity.This episode is sponsored by Blue Apron ( www.blueapron.com/HANDBOOK ) and hims ( www.forhims.com/THEBOYS ). ",
    isoDate: "2018-06-25T10:00:00.000Z"
  },
  {
    id: "245",
    title: "Riki Lindhome, Our Close Friend",
    pubDate: "Mon, 02 Jul 2018 10:00:00 GMT",
    description: "Sean and Hayes are joined by RIKI LINDHOME from Garfunkel and Oates and Another Period for another big performance they're doing.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS) and Harry's ( www.harrys.com code: HANDBOOK). ",
    isoDate: "2018-07-02T10:00:00.000Z"
  },
  {
    id: "246",
    title: "Aparna Nancherla, Our Close Friend",
    pubDate: "Mon, 09 Jul 2018 14:00:01 GMT",
    description: "The boys are joined by APARNA NANCHERLA to do a huge crime.This episode is sponsored by Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20) ",
    isoDate: "2018-07-09T14:00:01.000Z"
  },
  {
    id: "247",
    title: "Patton Oswalt, Our Close Friend",
    pubDate: "Mon, 16 Jul 2018 10:00:00 GMT",
    description: "The famous PATTON OSWALT finally joins the conversation to discuss an upcoming event with the boys.This episode is sponsored by hims ( www.forhims.com/THEBOYS ). ",
    isoDate: "2018-07-16T10:00:00.000Z"
  },
  {
    id: "248",
    title: "Triumph At Comic-Con",
    pubDate: "Mon, 23 Jul 2018 14:11:28 GMT",
    description: "Sean and Hayes do a commentary to celebrate their live show at Comic-Con with guest MOSHE KASHER.This episode is sponsored by Harrys ( www.harrys.com  code: HANDBOOK) and Blue Apron ( www.blueapron.com/HANDBOOK ). ",
    isoDate: "2018-07-23T14:11:28.000Z"
  },
  {
    id: "249",
    title: "Guy Branum, Our Close Friend",
    pubDate: "Mon, 30 Jul 2018 14:00:02 GMT",
    description: 'Sean and Hayes do a show with GUY BRANUM, author of his book "My Life as a Goddess," to help Chef Kevin with something. ',
    isoDate: "2018-07-30T14:00:02.000Z"
  },
  {
    id: "250",
    title: "The Doughboys, Our Shrimp-off Friends",
    pubDate: "Mon, 06 Aug 2018 15:06:14 GMT",
    description: "The Doughboys finally both come to the studio to do another Shrimp-Off with The Boys without the chewing sounds.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS), Harry's ( www.harrys.com  code: HANDBOOK), Casper Mattresses ( www.casper.com/theboys  code: THEBOYS), and Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20). ",
    isoDate: "2018-08-06T15:06:14.000Z"
  },
  {
    id: "251",
    title: "Tim Baltz, Our Close Friend",
    pubDate: "Mon, 13 Aug 2018 14:00:42 GMT",
    description: "TIM BALTZ joins Hayes to have a Shrink session.This episode is sponsored by Audible ( www.audible.com/THEBOYS  or text THEBOYS to 500-500). ",
    isoDate: "2018-08-13T14:00:42.000Z"
  },
  {
    id: "252",
    title: "Joe Mande, Our Southern Fried Friend",
    pubDate: "Mon, 20 Aug 2018 14:43:04 GMT",
    description: "Comedian Joe Mande joins The Boys again to talk about his new stand-up style.This episode is sponsored the National Highway Traffic Safety Administration ( www.NHTSA.gov ), hims ( www.forhims.com/THEBOYS ), Blue Apron ( www.blueapron.com/HANDBOOK ), and Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2018-08-20T14:43:04.000Z"
  },
  {
    id: "253",
    title: "Little Esther, Our Brand Ambassador",
    pubDate: "Mon, 27 Aug 2018 15:07:39 GMT",
    description: "LITTLE ESTHER joins The Boys again to become the show\u2019s brand ambassador.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THE BOYS) and the National Highway Traffic Safety Administration ( www.NHTSA.gov ). ",
    isoDate: "2018-08-27T15:07:39.000Z"
  },
  {
    id: "253.5",
    title: "Hollywood Masterclass: Grip it and Rip it!",
    pubDate: "Wed, 29 Aug 2018 15:00:24 GMT",
    description: "Melcome back! What your intention? Learning to write good. What\u2019s your obstacle? You haven\u2019t pressed play yet! ",
    isoDate: "2018-08-29T15:00:24.000Z"
  },
  {
    id: "254",
    title: "Erin Gibson, Our Close Friend Part 3",
    pubDate: "Mon, 03 Sep 2018 15:15:20 GMT",
    description: "Sean and Hayes are joined by ERIN GIBSON, author of the new book Feminasty, to play a new variation on a favorite game.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS) and Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20). ",
    isoDate: "2018-09-03T15:15:20.000Z"
  },
  {
    id: "255",
    title: "Stefani Robinson, Our Close Friend",
    pubDate: "Mon, 10 Sep 2018 14:00:46 GMT",
    description: "The Boys help STEFANI ROBINSON fix her TV show. ",
    isoDate: "2018-09-10T14:00:46.000Z"
  },
  {
    id: "256",
    title: "Tom Scharpling, Our New Host",
    pubDate: "Mon, 17 Sep 2018 14:00:48 GMT",
    description: "TOM SCHARPLING returns to make a big change to the show.\xA0This episode is sponsored by hims ( www.forhims.com/THEBOYSCARE ) and Blue Apron ( www.blueapron.com/HANDBOOK ). ",
    isoDate: "2018-09-17T14:00:48.000Z"
  },
  {
    id: "257",
    title: "Max Silvestri, Our Dessert Friend",
    pubDate: "Mon, 24 Sep 2018 14:00:16 GMT",
    description: "MAX SILVESTRI joins The Boys again to discuss desserts for when you\u2019re being bad.This episode is sponsored by Audible ( www.audible.com/THEBOYS  or text theboys to 500500), Harry's ( www.harrys.com/HANDBOOK ), and Robinhood ( HANDBOOK.robinhood.com ). ",
    isoDate: "2018-09-24T14:00:16.000Z"
  },
  {
    id: "258",
    title: "Lennon Parham, Our Goals Friend",
    pubDate: "Mon, 01 Oct 2018 14:00:46 GMT",
    description: "Live from the Dynasty Typewriter Theatre, LENNON PARHAM joins The Boys to help out Chef Kevin.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS). ",
    isoDate: "2018-10-01T14:00:46.000Z"
  },
  {
    id: "259",
    title: "Cedric Yarbrough, Our Close Friend",
    pubDate: "Mon, 08 Oct 2018 14:00:12 GMT",
    description: "The Boys talk to CEDRIC YARBROUGH about his career and try to do a show with him.This episode is sponsored by Casper Mattresses ( www.casper.com/theboys  code: THEBOYS), Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20), and Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2018-10-08T14:00:12.000Z"
  },
  {
    id: "260",
    title: "Jo Firestone, Our Gameshow Friend",
    pubDate: "Mon, 15 Oct 2018 14:19:56 GMT",
    description: "The Boys have a little fun making a gameshow with JO FIRESTONE live from The Bell House.This episode is sponsored by Superduperstitious podcast, Blue Apron ( www.blueapron.com/HANDBOOK ), hims ( www.forhims.com/THEBOYS ), and RXBAR ( www.RXBAR.com/THEBOYS  code: THEBOYS). ",
    isoDate: "2018-10-15T14:19:56.000Z"
  },
  {
    id: "261",
    title: "Jameela Jamil, Our Close Friend",
    pubDate: "Mon, 22 Oct 2018 14:00:36 GMT",
    description: "The Boys and JAMEELA JAMIL from The Good Place fix the TV rankings.This episode is sponsored by Audible ( www.audible.com/THEBOYS  or text THEBOYS to 500500) and Robinhood ( www.Handbook.robinhood.com ). ",
    isoDate: "2018-10-22T14:00:36.000Z"
  },
  {
    id: "262",
    title: "Brett Gelman, Our Close Friend",
    pubDate: "Mon, 29 Oct 2018 14:00:57 GMT",
    description: "The Boys and BRETT GELMAN have a little fun making a podcast festival.\xA0This episode is sponsored by LinkedIn ( www.linkedin.com/THEBOYS ) and Quip ( www.getquip.com/THEBOYS ). ",
    isoDate: "2018-10-29T14:00:57.000Z"
  },
  {
    id: "263",
    title: "John Levenstein, Our Showbiz Friend",
    pubDate: "Mon, 05 Nov 2018 14:30:33 GMT",
    description: "JOHN LEVENSTEIN joins The Boys to recap the new TV pilots.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS) and Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2018-11-05T14:30:33.000Z"
  },
  {
    id: "264",
    title: "Flula Borg, Our Format Friend",
    pubDate: "Mon, 12 Nov 2018 13:00:23 GMT",
    description: "FLULA BORG joins The Boys to make some new shows.This episode is sponsored by Blue Apron ( www.blueapron.com/HANDBOOK ), hims ( www.forhims.com/THEBOYS ), and Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20). ",
    isoDate: "2018-11-12T13:00:23.000Z"
  },
  {
    id: "265",
    title: "Reggie Watts, Our Spooky Friend",
    pubDate: "Mon, 19 Nov 2018 13:00:04 GMT",
    description: "REGGIE WATTS joins The Boys to prepare for the Hollywood Handbook Haunted House.This episode is sponsored by Harry's ( www.harrys.com/HOLLYWOODHANDBOOK ), Robinhood ( www.HANDBOOK.robinhood.com ), and Quip ( www.getquip.com/THEBOYS ). ",
    isoDate: "2018-11-19T13:00:04.000Z"
  },
  {
    id: "266",
    title: "Tom and Julie, Our Talkshow Friends",
    pubDate: "Mon, 26 Nov 2018 14:03:51 GMT",
    description: "Sean and Hayes have a little fun doing a talkshow with JULIE KLAUSNER and TOM SCHARPLING live at The Bell House.\xA0This episode is sponsored by Casper Mattresses ( www.casper.com/savings ) and LinkedIn ( www.linkedin.com/THEBOYS ). ",
    isoDate: "2018-11-26T14:03:51.000Z"
  },
  {
    id: "267",
    title: "PFTi, Our Close Friends",
    pubDate: "Mon, 03 Dec 2018 13:25:00 GMT",
    description: "Paul F. Tompkins and Andrew Ti join The Boys to discuss if it's racist.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS), hims ( www.forhims.com/THEBOYS ), Quip ( www.getquip.com/THEBOYS ), and Harry's ( www.harrys.com/HOLLYWOODHANDBOOK ). ",
    isoDate: "2018-12-03T13:25:00.000Z"
  },
  {
    id: "267.5",
    title: "An Ad for Peecast with Scott and Wiger",
    pubDate: "Thu, 06 Dec 2018 13:00:42 GMT",
    description: "The Boys do an ad with Scott and Wiger about some sneaky Peecast news. ",
    isoDate: "2018-12-06T13:00:42.000Z"
  },
  {
    id: "268",
    title: "Adam Conover, Our Close Friend",
    pubDate: "Mon, 10 Dec 2018 13:01:00 GMT",
    description: "Sean and Hayes talk to ADAM CONOVER about ruinsing everything.\xA0This episode is sponsored by Blue Apron ( www.blueapron.com/HANDBOOK ) and Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20). ",
    isoDate: "2018-12-10T13:01:00.000Z"
  },
  {
    id: "269",
    title: "Sam Richardson, Our Close Friend",
    pubDate: "Mon, 17 Dec 2018 13:00:47 GMT",
    description: "The Boys help SAM RICHARDSON #SaveVeep.\xA0This episode is sponsored by NHTSA, Harry's ( www.harrys.com/HANDBOOK ), Quip ( www.getquip.com/THEBOYS ), and Robinhood ( www.HANDBOOK.robinhood.com ). ",
    isoDate: "2018-12-17T13:00:47.000Z"
  },
  {
    id: "270",
    title: "Adam Pally, Our Bumper Recorder Part 2",
    pubDate: "Mon, 24 Dec 2018 13:00:59 GMT",
    description: "ADAM PALLY joins The Boys again to record some promotional bumpers for his show Champaign ILL.This episode is sponsored by NHTSA. ",
    isoDate: "2018-12-24T13:00:59.000Z"
  },
  {
    id: "271",
    title: "Bang Rodgman, Our Choose Your Own Adventure Friend",
    pubDate: "Mon, 31 Dec 2018 16:00:46 GMT",
    description: "The Boys and BANG RODGMAN have a little fun making a Choose Your Own Adventure episode.\xA0This episode is sponsored by Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2018-12-31T16:00:46.000Z"
  },
  {
    id: "272",
    title: "Sean\u2019s Leaked Saturday Night Live Audition",
    pubDate: "Mon, 07 Jan 2019 13:31:27 GMT",
    description: 'Chef Kevin "accidentally" leaks Sean\u2019s audition to join the cast of Saturday Night Live.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS) and Quip ( www.getquip.com/THEBOYS ). ',
    isoDate: "2019-01-07T13:31:27.000Z"
  },
  {
    id: "273",
    title: "Matt Ingebretson and Jake Weisman, Our Globes Prediction Friends",
    pubDate: "Mon, 14 Jan 2019 13:27:14 GMT",
    description: "MATT INGEBRESTON and JAKE WEISMAN join the The Boys to record an episode from WAY before the Golden Globes and predict them.This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS), Simple Contacts ( www.simplecontacts.com/THEBOYS20  code: THEBOYS20), and hims ( www.forhims.com/THEBOYS ). ",
    isoDate: "2019-01-14T13:27:14.000Z"
  },
  {
    id: "274",
    title: "The Masked Engineer, Our Masked Friend",
    pubDate: "Mon, 21 Jan 2019 13:00:28 GMT",
    description: "SHAUN DISTON is loving it when The Boys have some fun with the masked engineer.\xA0This episode is sponsored by Harry's ( www.harrys.com/HANDBOOK ) and Robinhood ( www.HANDBOOK.robinhood.com ). ",
    isoDate: "2019-01-21T13:00:28.000Z"
  },
  {
    id: "275",
    title: "Tom and The Doughboys, Our Close Friends",
    pubDate: "Mon, 28 Jan 2019 13:00:49 GMT",
    description: "TOM SCHARPLING and THE DOUGHBOYS come to the studio and get tricked by The Boys.This episode is sponsored by Indochino ( www.indochino.com  code: HANDBOOK) and Quip ( www.getquip.com/THEBOYS ). ",
    isoDate: "2019-01-28T13:00:49.000Z"
  },
  {
    id: "276",
    title: "Mitra Jouhari, Our Rant Friend",
    pubDate: "Mon, 04 Feb 2019 13:00:43 GMT",
    description: "MITRA JOUHARI joins The Boys to do a Rant Wheel.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS), Away ( www.awaytravel.com/THEBOYS20  code: THEBOYS20), and Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2019-02-04T13:00:43.000Z"
  },
  {
    id: "277",
    title: "D'Arcy Carden, Our Close Friend Again",
    pubDate: "Mon, 11 Feb 2019 13:36:09 GMT",
    description: "D'ARCY CARDEN returns to the show to let The Boys fix The Good Place.This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS) and hims ( www.forhims.com/THEBOYS ). ",
    isoDate: "2019-02-11T13:36:09.000Z"
  },
  {
    id: "278",
    title: "Sasheer Zamata, Our Fyre Fest Friend",
    pubDate: "Mon, 18 Feb 2019 14:45:52 GMT",
    description: "The Boys and SASHEER ZAMATA premiere their own Fyre Fest documentary.This episode is sponsored by Robinhood ( www.handbook.robinhood.com ), Harry's ( www.harrys.com/HANDBOOK ), and Quip ( www.getquip.com/THEBOYS ). ",
    isoDate: "2019-02-18T14:45:52.000Z"
  },
  {
    id: "279",
    title: "Heather Anne Campbell, Our Gamer Friend",
    pubDate: "Mon, 25 Feb 2019 13:00:33 GMT",
    description: "HEATHER ANNE CAMPBELL helps The Boys make a video game.This episode is sponsored by The Harold Ramis Film School ( www.ramisfilmschool.com  or call 312-883-1241), Away ( www.awaytravel.com/BOYS20  code: BOYS20) and Indochino ( www.indochino.com  code: HANDBOOK). ",
    isoDate: "2019-02-25T13:00:33.000Z"
  },
  {
    id: "280",
    title: "Weird Al, Our Close Friend",
    pubDate: "Mon, 04 Mar 2019 13:53:40 GMT",
    description: "The Boys give WEIRD AL a taste of his own medicine for making fun of songs.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS) and Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2019-03-04T13:53:40.000Z"
  },
  {
    id: "281",
    title: "Thomas Middleditch, Our Big Movie Friend",
    pubDate: "Mon, 11 Mar 2019 14:00:02 GMT",
    description: "THOMAS MIDDLEDITCH returns to make a big movie with The Boys.This episode is sponsored by CBS The Good Fight ( www.cbs.com/HANDBOOK ), hims ( www.forhims.com/HANDBOOK ), Quip ( www.getquip.com/THEBOYS ), and Away ( www.awaytravel.com/BOYS20  code: BOYS20). ",
    isoDate: "2019-03-11T14:00:02.000Z"
  },
  {
    id: "282",
    title: "282. Kaitlin Olson, Our Close Friend",
    pubDate: "Mon, 18 Mar 2019 14:00:20 GMT",
    description: "The Boys help KAITLIN OLSON figure out what she's doing next.This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS), Brilliant Earth ( www.brilliantearth.com/THEBOYS ), Harry's ( www.harrys.com/HANDBOOK ), and Robinhood ( www.HANDBOOK.robinhood.com ). ",
    isoDate: "2019-03-18T14:00:20.000Z"
  },
  {
    id: "283",
    title: "The Masked Guest",
    pubDate: "Mon, 25 Mar 2019 14:00:56 GMT",
    description: "DEMI ADEJUYIGBE joins The Boys for The Masked Guest.\xA0This episode is sponsored by Control Center by Caavo ( www.caavo.com  code: THEBOYS), Brilliant Earth ( www.brilliantearth.com/THEBOYS ), and CBS - The Good Fight ( www.cbs.com/HANDBOOK ). ",
    isoDate: "2019-03-25T14:00:56.000Z"
  },
  {
    id: "284",
    title: "284. Tim Heidecker, Our Close Friend",
    pubDate: "Mon, 01 Apr 2019 14:00:10 GMT",
    description: "Hayes talks to TIM HEIDECKER about getting replaced in a comedy duo. Also, Sean calls in from the hospital (he's okay).This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS), Brilliant Earth ( www.brilliantearth.com/THEBOYS ), Harry's ( www.harrys.com/HANDBOOK ), Quip ( www.getquip.com/THEBOYS ), and Indochino ( www.indochino.com  code: HANDBOOK). ",
    isoDate: "2019-04-01T14:00:10.000Z"
  },
  {
    id: "285",
    title: "Martha Kelly, Our Close Friend",
    pubDate: "Mon, 08 Apr 2019 14:00:37 GMT",
    description: "The Boys try to make MARTHA KELLY famous enough to be a Try Month guest.This episode is sponsored by Blackout Podcast, Brilliant Earth ( www.brilliantearth.com/THEBOYS ), hims ( www.forhims.com/HANDBOOK ), and Philo ( www.philo.tv/theboys ). ",
    isoDate: "2019-04-08T14:00:37.000Z"
  },
  {
    id: "286",
    title: "Showrunners Panel, Our Major Discussion",
    pubDate: "Mon, 15 Apr 2019 15:47:49 GMT",
    description: "The Boys team up with fellow showrunners JARRAD PAUL and JULIUS \u201CGOLDY\u201D SHARPE for a panel about becoming each other\u2019s agents.\xA0This episode is sponsored by Brilliant Earth ( www.brilliantearth.com/THEBOYS ), NHTSA, Harry's ( www.harrys.com/HANDBOOK ), Robinhood ( www.handbook.robinhood.com ), and Philo ( www.philo.tv/THEBOYS ). ",
    isoDate: "2019-04-15T15:47:49.000Z"
  },
  {
    id: "287",
    title: "287. Andy Daly, Our Cookbook Friend",
    pubDate: "Mon, 22 Apr 2019 14:00:34 GMT",
    description: "ANDY DALY joins The Boys to help finish the Earwolf cookbook.This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS), NHTSA, Quip ( www.getquip.com/THEBOYS ), and Philo ( www.philo.tv/theboys ). ",
    isoDate: "2019-04-22T14:00:34.000Z"
  },
  {
    id: "288",
    title: "288. Tony Hale, Our Close Friend",
    pubDate: "Mon, 29 Apr 2019 14:54:56 GMT",
    description: "Tony Hale stops by the studio to record some punch up The Boys wrote for Toy Story 4.This episode is sponsored by Philo ( www.philo.tv/theboys ), Harry's ( www.harrys.com/HANDBOOK ), Indochino ( www.indochino.com  code: HANDBOOK), and the National Highway Traffic Safety Administration. ",
    isoDate: "2019-04-29T14:54:56.000Z"
  },
  {
    id: "289",
    title: "289. Doug Benson, Our Movies Friend",
    pubDate: "Mon, 06 May 2019 14:00:16 GMT",
    description: "Doug Benson joins The Boys to play a famous movies game.This episode is sponsored by Mack Weldon ( www.mackweldon.com/THEBOYS ), hims ( www.forhims.com/THEBOYS ), and Away ( www.awaytravel.com/THEBOYS20  code: THEBOYS20). ",
    isoDate: "2019-05-06T14:00:16.000Z"
  },
  {
    id: "290",
    title: "290. James Adomian, Our Close Friend",
    pubDate: "Mon, 13 May 2019 14:00:57 GMT",
    description: "The Boys welcome JAMES ADOMIAN to say farewell to Jims.This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS), Harry's ( www.harrys.com/HANDBOOK ), and Quip ( www.getquip.com/THEBOYS ). ",
    isoDate: "2019-05-13T14:00:57.000Z"
  },
  {
    id: "291",
    title: "291. Desi Lydic, Our Daily Show Friend",
    pubDate: "Mon, 20 May 2019 14:00:44 GMT",
    description: "DESI LYDIC helps The Boys make their new TV show.This episode is sponsored by Quip ( www.getquip.com/THEBOYS ) and National Highway Traffic Safety Administration. ",
    isoDate: "2019-05-20T14:00:44.000Z"
  },
  {
    id: "292",
    title: "292. Kulap Vilaysack, Our Origin Story Friend",
    pubDate: "Mon, 27 May 2019 14:00:04 GMT",
    description: "KULAP VILAYSACK returns to help Sean and Hayes make their origin story documentaries.This episode is sponsored by NHTSA and Indochino ( www.indochino.com  code: HANDBOOK). ",
    isoDate: "2019-05-27T14:00:04.000Z"
  },
  {
    id: "292.5",
    title: "Introducing: Factually! with Adam Conover",
    pubDate: "Tue, 28 May 2019 14:00:48 GMT",
    description: "The Boys listen to the trailer for Adam Conover's new Earwolf podcast. The first episode is out now. Find Factually! in your podcast app and subscribe to hear more every Wednesday.Factually! in Apple Podcasts:  https://apple.co/2WXPonH or Stitcher:  https://www.stitcher.com/s?fid=404109 ",
    isoDate: "2019-05-28T14:00:48.000Z"
  },
  {
    id: "293",
    title: "293. Alyssa Limperis, Our Moms Friend",
    pubDate: "Mon, 03 Jun 2019 14:55:46 GMT",
    description: "ALYSSA LIMPERIS comes to the studio to become The Boys' moms.\xA0This episode is sponsored by hims ( www.forhims.com/THEBOYS ), Harry's ( www.harrys.com/handbook ), and Quip ( www.getquip.com/theboys ). ",
    isoDate: "2019-06-03T14:55:46.000Z"
  },
  {
    id: "294",
    title: "294. Stephen Malkmus, Our Pavement Friend",
    pubDate: "Mon, 10 Jun 2019 14:25:27 GMT",
    description: "The Boys and Engineer Brett pitch STEPHEN MALKMUS new songs for the show Flaked.To buy Hollywood Handbook merch on Amazon, go to Amazon.com and search PODSWAG.\xA0This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS), Mack Weldon ( www.mackweldon.com  code: THEBOYS), Away ( www.awaytravel.com/theboys20  code: THEBOYS20), and Robinhood ( www.HANDBOOK.robinhood.com ). ",
    isoDate: "2019-06-10T14:25:27.000Z"
  },
  {
    id: "295",
    title: "295. Mina Kimes, Our Close Friend",
    pubDate: "Mon, 17 Jun 2019 14:00:11 GMT",
    description: "The Boys and MINA KIMES host an episode of the Big Little Lies After Show.This episode is sponsored by Harry's ( www.harrys.com/handbook ) and Honey( www.joinhoney.com/theboys ). ",
    isoDate: "2019-06-17T14:00:11.000Z"
  },
  {
    id: "295.5",
    title: "Introducing: How Did This Get Played?",
    pubDate: "Sun, 23 Jun 2019 16:17:03 GMT",
    description: "The Boys listen to the trailer for Nick Wiger and Heather Anne Campbell\u2019s new Earwolf podcast. The first episode is out now. Find How Did This Get Played? in your podcast app and subscribe to hear more every Monday at https://h.earwolf.com/hdtgp ",
    isoDate: "2019-06-23T16:17:03.000Z"
  },
  {
    id: "296",
    title: "296. Ron Funches, Our Introductory Friend",
    pubDate: "Mon, 24 Jun 2019 14:00:28 GMT",
    description: "The Boys help RON FUNCHES host an Intro to Hollywood Handbook episode.This episode is sponsored by Audible ( www.audible.com/THEBOYS  or text THEBOYS to 500-500), Quip ( www.getquip.com/THEBOYS ), and Honey ( www.joinhoney.com/theboys ). ",
    isoDate: "2019-06-24T14:00:28.000Z"
  },
  {
    id: "297",
    title: "297. Tom Scharpling, Our Returning Friend",
    pubDate: "Mon, 01 Jul 2019 14:00:50 GMT",
    description: "TOM SCHARPLING makes his grand return to the show.\xA0\xA0This episode is sponsored by hims ( www.forhims.com/handbook ), Harry's ( www.harrys.com/handbook ), and Indochino ( www.indochino.com  code: HANDBOOK). ",
    isoDate: "2019-07-01T14:00:50.000Z"
  },
  {
    id: "298",
    title: "Julie Klausner, Our Co-Host Friend",
    pubDate: "Mon, 08 Jul 2019 14:04:13 GMT",
    description: "JULIE KLAUSNER fills in as co-host after The Boys get into a big fightThis episode is brought to you by Mack Weldon ( www.mackweldon.com code: THEBOYS), My Sheets Rock ( www.mysheetsrock.com/THEBOYS ), and Away ( www.awaytravel.com/theboys20 ). ",
    isoDate: "2019-07-08T14:04:13.000Z"
  },
  {
    id: "299",
    title: "299. Natalie Morales, Our Storytelling Friend",
    pubDate: "Mon, 15 Jul 2019 14:00:00 GMT",
    description: "NATALIE MORALES returns to the show after telling an exclusive Hollywood Handbook story on Late Night.\xA0This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS  code: THEBOYS) and Harry's ( www.harrys.com/HANDBOOK ). ",
    isoDate: "2019-07-15T14:00:00.000Z"
  },
  {
    id: "300",
    title: "300. Moshe Kasher, Our Comic-Con Friend",
    pubDate: "Mon, 22 Jul 2019 14:00:41 GMT",
    description: "MOSHE KASHER returns to the show to do a very special commentary episode with The Boys.This episode is sponsored by Raycon ( www.buyraycon.com/theboys ) and Honey ( www.joinhoney.com/theboys ) ",
    isoDate: "2019-07-22T14:00:41.000Z"
  },
  {
    id: "301",
    title: "301. The Magic Tavern Guys, Our Euphoria Friends",
    pubDate: "Mon, 29 Jul 2019 14:00:55 GMT",
    description: "With Game of Thrones over, The Boys help the Magic Tavern hosts rebrand their show.This episode is sponsored by hims ( www.forhims.com/HANDBOOK ), Harry's ( www.harrys.com/HANDBOOK ), and Indochino ( www.indochino.com  code: HANDBOOK). ",
    isoDate: "2019-07-29T14:00:55.000Z"
  },
  {
    id: "302",
    title: "302. Jesse Farrar, Our Close Friend",
    pubDate: "Mon, 05 Aug 2019 14:00:28 GMT",
    description: "JESSE FARRAR asks The Boys for advice on how to get his big break.This episode is sponsored by Mack Weldon ( www.mackweldon.com  code: THEBOYS), My Sheets Rock ( mysheetsrock.com/THEBOYS ), Quip ( www.getquip.com/theboys ), Audible ( www.audible.com/theboys  or text THEBOYS to 500-500), and Raycon ( www.buyraycon.com/theboys ). ",
    isoDate: "2019-08-05T14:00:28.000Z"
  },
  {
    id: "303",
    title: "Jackie Johnson, Our Makeup Friend",
    pubDate: "Mon, 12 Aug 2019 14:00:33 GMT",
    description: "The Boys give JACKIE JOHNSON from the podcast Natch Beaut a makeover challenge.This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS code: THEBOYS) and Harry's ( www.harrys.com/handbook ) ",
    isoDate: "2019-08-12T14:00:33.000Z"
  },
  {
    id: "304",
    title: "Tom Scharpling and Will Hines, Our Third Host Audition",
    pubDate: "Mon, 19 Aug 2019 14:00:03 GMT",
    description: "TOM SCHARPLING returns for another attempt to become the third host with guest WILL HINES.\xA0\xA0This episode is sponsored by Honey ( www.joinhoney.com/theboys ), NHTSA, and Raycon ( www.buyraycon.com/theboys ). ",
    isoDate: "2019-08-19T14:00:03.000Z"
  },
  {
    id: "305",
    title: "Margaret Cho, Our Tattoo Friend",
    pubDate: "Mon, 26 Aug 2019 14:00:59 GMT",
    description: "MARGARET CHO joins The Boys to discuss all their tattoo.\xA0\xA0This episode is sponsored by hims ( www.forhims.com/theboys ), Quip ( www.getquip.com/theboys ), and Indochino ( www.indochino.com code: HANDBOOK). ",
    isoDate: "2019-08-26T14:00:59.000Z"
  },
  {
    id: "306",
    title: "Sona Movsesian, Our Conan Friend",
    pubDate: "Mon, 02 Sep 2019 14:41:54 GMT",
    description: "The Boys have SONA MOVSESIAN on the show to learn how to trick Conan.\xA0This episode is sponsored by Mack Weldon ( www.mackweldon.com code: THEBOYS), Tool, and Harry's ( www.harrys.com/HANDBOOK ).\xA0\xA0To buy a new Hollywood Handbook CamelBak water bottle, go to  podswag.com/theboys . ",
    isoDate: "2019-09-02T14:41:54.000Z"
  },
  {
    id: "307",
    title: "Ayo Edebiri, Our Expert Youth Friend",
    pubDate: "Mon, 09 Sep 2019 14:00:45 GMT",
    description: "AYO EDEBIRI comes on the show to give The Boys some youth culture tips.\xA0\xA0This episode is sponsored by My Sheets Rock ( www.mysheetsrock/THEBOYS code: THEBOYS), Away ( www.awaytravel.com/theboys20 code: THEBOYS20), and Kettlebell Kitchen ( www.kettlebellkitchen.com code: THEBOYS) ",
    isoDate: "2019-09-09T14:00:45.000Z"
  },
  {
    id: "308",
    title: "Julie Klausner, Our Freaky Flix Friend",
    pubDate: "Mon, 16 Sep 2019 14:00:23 GMT",
    description: "QUEENIE and The Boys make a horror anthology series.\xA0This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS code: THEBOYS), Harry's ( www.harrys.com/handbook ), and Quip ( www.getquip.com/theboys) . ",
    isoDate: "2019-09-16T14:00:23.000Z"
  },
  {
    id: "309",
    title: "Andy Daly, Our Podcast Pilot Friend",
    pubDate: "Mon, 23 Sep 2019 14:00:26 GMT",
    description: "Live from the Dynasty Typewriter, The Boys help ANDY DALY make an entire new season of Andy Daly Podcast Pilot Project.\xA0\xA0This episode is sponsored by hims ( www.forhims.com/theboys ) and ButcherBox ( www.butcherbox.com/theboys code: THEBOYS) ",
    isoDate: "2019-09-23T14:00:26.000Z"
  },
  {
    id: "310",
    title: "Dewayne Perkins, Our Close Friend",
    pubDate: "Mon, 30 Sep 2019 14:00:06 GMT",
    description: "The Boys help DEWAYNE PERKINS make sure he has the best jokes.\xA0This episode is sponsored by My Sheets Rock ( www.mysheetsrock.com/THEBOYS  code: THEBOYS), Harry's ( www.harrys.com/handbook ) and Indochino ( www.indochino.com code: HANDBOOK) ",
    isoDate: "2019-09-30T14:00:06.000Z"
  },
  {
    id: "311",
    title: "Laci Mosley, Our Scams Friends",
    pubDate: "Mon, 07 Oct 2019 14:00:22 GMT",
    description: "LACI MOSLEY (host of Scam Goddess) helps The Boys with their own scams.\xA0\xA0This episode is sponsored by Mack Weldon ( www.mackweldon.com code: THEBOYS), Untuckit ( www.untuckit.com code: THEBOYS), Quip ( www.getquip.com/theboys ), and Kettlebell Kitchen ( www.kettlebellkitchen.com code: THEBOYS). ",
    isoDate: "2019-10-07T14:00:22.000Z"
  },
  {
    id: "312",
    title: "Mikal Cronin, Our Music Friend",
    pubDate: "Mon, 14 Oct 2019 14:00:00 GMT",
    description: "The Boys welcome MIKAL CRONIN back to replace their expired songs. ",
    isoDate: "2019-10-14T14:00:00.000Z"
  },
  {
    id: "313",
    title: "Mitra Jouhari and Joel Kim Booster, Our Urgent Care Friends",
    pubDate: "Mon, 21 Oct 2019 14:00:00 GMT",
    description: "The Boys welcome back MITRA JOUHARI and JOEL KIM BOOSTER to audit their new podcast. ",
    isoDate: "2019-10-21T14:00:00.000Z"
  },
  {
    id: "314",
    title: "Matt Besser, Our Cannabedian Friend",
    pubDate: "Mon, 28 Oct 2019 17:33:00 GMT",
    description: "The Boys welcome MATT BESSER back to the show to promote his new special Pot Humor and hopefully confess his crimes. ",
    isoDate: "2019-10-28T17:33:00.000Z"
  },
  {
    id: "315",
    title: "Janet Varney, Our Voyage Friend",
    pubDate: "Mon, 04 Nov 2019 13:00:00 GMT",
    description: "The Boys and JANET VARNEY do a special episode of Voyage of the Stars. ",
    isoDate: "2019-11-04T13:00:00.000Z"
  },
  {
    id: "316",
    title: "Tom Scharpling and Martha Kelly, Our New Comic-Con Friends",
    pubDate: "Mon, 11 Nov 2019 13:00:25 GMT",
    description: "TOM SCHARPLING and MARTHA KELLY return to take the Triumph at Comic-Con episode on tour.\xA0\xA0This episode is sponsored by Squarespace ( www.squarespace.com/THEBOYS code: THEBOYS), Harry's ( www.harrys.com/handbook ), and Away ( www.awaytravel.com/handbook  code: HANDBOOK). ",
    isoDate: "2019-11-11T13:00:25.000Z"
  },
  {
    id: "317",
    title: "Tim Baltz, Our Close Friend",
    pubDate: "Mon, 18 Nov 2019 13:00:00 GMT",
    description: "TIM BALTZ returns to talk about the Chicago jazz scene and more.\xA0\xA0This episode is sponsored by hims ( www.forhims.com/HANDBOOK ), Trtl Travel Pillows ( www.trtltravel.com  code: THEBOYS) and Quip ( www.getquip.com/theboys ). ",
    isoDate: "2019-11-18T13:00:00.000Z"
  },
  {
    id: "318",
    title: "Ify Nwadiwe and Matt Apodaca, Our Gamer Friends",
    pubDate: "Mon, 25 Nov 2019 13:00:00 GMT",
    description: "The Boys welcome IFY NWADIWE and MATT APODACA to teach them how to be the most famous gamers. ",
    isoDate: "2019-11-25T13:00:00.000Z"
  },
  {
    id: "319",
    title: "Our Spanish Aqui Presents Friends",
    pubDate: "Mon, 02 Dec 2019 13:00:00 GMT",
    description: "The Boys have a little fun welcoming the hosts of Spanish Aqui Presents (Raiza Licea, Carlos Santos,\xA0Oscar Montoya and\xA0Tony Rodr\xEDguez) to Earwolf. ",
    isoDate: "2019-12-02T13:00:00.000Z"
  },
  {
    id: "320",
    title: "Felicia Day, Our Close Friend",
    pubDate: "Mon, 09 Dec 2019 13:00:00 GMT",
    description: "FELICIA DAY joins The Boys to make nerds show. ",
    isoDate: "2019-12-09T13:00:00.000Z"
  },
  {
    id: "321",
    title: "Tatiana Maslany, Our Close Friend",
    pubDate: "Mon, 16 Dec 2019 13:00:00 GMT",
    description: "TATIANA MASLANY joins The Boys to perform some dramatic scenes. ",
    isoDate: "2019-12-16T13:00:00.000Z"
  },
  {
    id: "322",
    title: "Shaun Diston, Our Christmas Album Friend",
    pubDate: "Mon, 23 Dec 2019 13:00:00 GMT",
    description: "SHAUN DISTON returns to help The Boys make a Christmas album. ",
    isoDate: "2019-12-23T13:00:00.000Z"
  },
  {
    id: "323",
    title: "Edgar Momplaisir and Jacquis Neal, Our Culture Kings Friends",
    pubDate: "Mon, 30 Dec 2019 13:00:00 GMT",
    description: "The Boys welcome Culture Kings hosts EDGAR MOMPLAISIR and JACQUIS NEAL to the Earwolf family. ",
    isoDate: "2019-12-30T13:00:00.000Z"
  },
  {
    id: "324",
    title: "Jon Gabrus, Our Power Hour Friend",
    pubDate: "Mon, 06 Jan 2020 13:00:00 GMT",
    description: "The Boys welcome back JON GABRUS to do a different kind of power hour. ",
    isoDate: "2020-01-06T13:00:00.000Z"
  },
  {
    id: "325",
    title: "Paul F. Tompkins and Matt Gourley, Our Superego Friends",
    pubDate: "Mon, 13 Jan 2020 13:00:00 GMT",
    description: "The Boys welcome back PAUL F. TOMPKINS and MATT GOURLEY to do a Superego. ",
    isoDate: "2020-01-13T13:00:00.000Z"
  },
  {
    id: "326",
    title: "Atsuko Okatsuka, Our Close Friend",
    pubDate: "Mon, 20 Jan 2020 13:00:00 GMT",
    description: "ATSUKO OKATSUKA joins The Boys to play some new games for her game show. ",
    isoDate: "2020-01-20T13:00:00.000Z"
  },
  {
    id: "327",
    title: "Rob Huebel, Our Medical Police Friend",
    pubDate: "Mon, 27 Jan 2020 13:06:00 GMT",
    description: "The Boys welcome ROB HUEBEL back to audition for the new Medical Police class. ",
    isoDate: "2020-01-27T13:06:00.000Z"
  },
  {
    id: "328",
    title: "Jamie Loftus, Our Mensa Friend",
    pubDate: "Mon, 03 Feb 2020 13:00:00 GMT",
    description: "Jamie Loftus joins The Boys to give them the Mensa test. ",
    isoDate: "2020-02-03T13:00:00.000Z"
  },
  {
    id: "329",
    title: "Rory Scovel, Our Close Friend",
    pubDate: "Mon, 10 Feb 2020 13:00:00 GMT",
    description: "RORY SCOVEL joins The Boys to give The Bachelor an important upgrade. ",
    isoDate: "2020-02-10T13:00:00.000Z"
  },
  {
    id: "330",
    title: "Whitmer Thomas, Our Close Friend",
    pubDate: "Mon, 17 Feb 2020 13:00:00 GMT",
    description: "WHITMER THOMAS returns to help The Boys make their HBO comedy special. ",
    isoDate: "2020-02-17T13:00:00.000Z"
  },
  {
    id: "331",
    title: "Meg Stalter, Our Close Friend",
    pubDate: "Mon, 24 Feb 2020 13:00:00 GMT",
    description: "MEG STALTER teaches The Boys how to do comedy videos. ",
    isoDate: "2020-02-24T13:00:00.000Z"
  },
  {
    id: "332",
    title: "David Sedaris, Our Storytelling Friend",
    pubDate: "Mon, 02 Mar 2020 13:00:00 GMT",
    description: "DAVID SEDARIS teaches The Boys how to tell a good story and fixes the show.Check out David's MasterClass at MasterClass.com/Sedaris and pre-order The Boys' new vinyl at NewburyComics.com/HollywoodHandbook.\xA0 ",
    isoDate: "2020-03-02T13:00:00.000Z"
  },
  {
    id: "333",
    title: "The Pro Version: Hollywood Handbook: The Movie (with Ben Rodgers)",
    pubDate: "Thu, 05 Mar 2020 13:00:00 GMT",
    description: "The Boys are releasing one Pro Version episode from behind the paywall every Friday in Try Month. In this episode, Sean and Hayes help BEN RODGERS (the actor who portrays Bang Rodgman) write Hollywood Handbook: The Movie. ",
    isoDate: "2020-03-05T13:00:00.000Z"
  },
  {
    id: "334",
    title: "Jon Hamm, Our Close Friend",
    pubDate: "Mon, 09 Mar 2020 14:00:00 GMT",
    description: "The Boys help JON HAMM book his next big role. ",
    isoDate: "2020-03-09T14:00:00.000Z"
  },
  {
    id: "335",
    title: "Sinbad, Our In Studio Friend",
    pubDate: "Thu, 12 Mar 2020 04:02:00 GMT",
    description: "SINBAD returns to the studio with The Boys defeat the Coronavirus. ",
    isoDate: "2020-03-12T04:02:00.000Z"
  },
  {
    id: "336",
    title: "The Pro Version: Teaser Freezer: 21 Bridges",
    pubDate: "Thu, 12 Mar 2020 14:00:00 GMT",
    description: "The Boys are releasing one Pro Version episode from behind the paywall every Friday in Try Month. In this episode, Sean and Hayes\xA0have a little fun talking about Mr. Kevin's big trip and do a Teaser Freezer for 21 Bridges.\xA0 ",
    isoDate: "2020-03-12T14:00:00.000Z"
  },
  {
    id: "337",
    title: "Julie Klausner and Ayo Edebiri, Our Close Friends",
    pubDate: "Mon, 16 Mar 2020 14:00:00 GMT",
    description: "JULIE KLAUSNER and AYO EDEBIRI join forces to help Sean with a very special audition.\xA0 ",
    isoDate: "2020-03-16T14:00:00.000Z"
  },
  {
    id: "338",
    title: "The Pro Version: Listener Questions (with Ayo Edebiri)",
    pubDate: "Thu, 19 Mar 2020 17:10:00 GMT",
    description: "The Boys are releasing one Pro Version episode from behind the paywall every Friday in Try Month. In this episode, Sean and Hayes have a little fun answering some listener questions with AYO EDEBIRI. ",
    isoDate: "2020-03-19T17:10:00.000Z"
  },
  {
    id: "339",
    title: "Will Forte, Our Close Friend",
    pubDate: "Mon, 23 Mar 2020 14:00:00 GMT",
    description: "WILL FORTE auditions for The Boys to be a guest on the show. ",
    isoDate: "2020-03-23T14:00:00.000Z"
  },
  {
    id: "340",
    title: "The Pro Version: Super Bowl Party Snacks",
    pubDate: "Thu, 26 Mar 2020 14:00:00 GMT",
    description: "The Boys are releasing one Pro Version episode from behind the paywall every Friday in Try Month.\xA0In this episode,\xA0The Boys help you make the perfect Super Bowl party snacks. ",
    isoDate: "2020-03-26T14:00:00.000Z"
  },
  {
    id: "341",
    title: "Tony Hawk, Our Skateboarder Friend",
    pubDate: "Mon, 30 Mar 2020 14:00:00 GMT",
    description: "The Boys help TONY HAWK make the next Tony Hawk's Pro Skater video game. ",
    isoDate: "2020-03-30T14:00:00.000Z"
  },
  {
    id: "342",
    title: "Bess Kalb, Our Zoom Show Friend",
    pubDate: "Mon, 06 Apr 2020 14:00:00 GMT",
    description: "BESS KALB helps The Boys make Zoom versions of TV shows.\xA0 ",
    isoDate: "2020-04-06T14:00:00.000Z"
  },
  {
    id: "343",
    title: "Jason Mantzoukas, Our Movie Podcast Friend",
    pubDate: "Mon, 13 Apr 2020 14:00:00 GMT",
    description: "JASON MANTZOUKAS returns to answer How Did This Gets Made? ",
    isoDate: "2020-04-13T14:00:00.000Z"
  },
  {
    id: "344",
    title: "Jeremy Levick and Rajat Suresh, Our Close Friends",
    pubDate: "Mon, 20 Apr 2020 14:00:00 GMT",
    description: "The Boys welcome JEREMY LEVICK and RAJAT SURESH to the first episode of their new podcast Why Did This Get Made? ",
    isoDate: "2020-04-20T14:00:00.000Z"
  },
  {
    id: "345",
    title: "Shea Serrano, Our Quiz Friend",
    pubDate: "Mon, 27 Apr 2020 14:00:00 GMT",
    description: "The Boys welcome SHEA SERRANO to participate in The Ultimate Sports and Movies Quiz and Rap.\xA0 ",
    isoDate: "2020-04-27T14:00:00.000Z"
  },
  {
    id: "346",
    title: "Maria Bamford, Our Nice Friend",
    pubDate: "Mon, 04 May 2020 14:00:00 GMT",
    description: "MARIA BAMFORD teaches The Boys how to be pleasant. ",
    isoDate: "2020-05-04T14:00:00.000Z"
  },
  {
    id: "347",
    title: "Alan Yang, Our Close Friend",
    pubDate: "Mon, 11 May 2020 14:00:00 GMT",
    description: "The Boys welcome ALAN YANG to discuss how he really made Tigertail. ",
    isoDate: "2020-05-11T14:00:00.000Z"
  },
  {
    id: "348",
    title: "Open Mike Eagle, Our Close Friend",
    pubDate: "Mon, 18 May 2020 14:00:00 GMT",
    description: "The Boys and OPEN MIKE EAGLE make a writers room for their freestyle rap. ",
    isoDate: "2020-05-18T14:00:00.000Z"
  },
  {
    id: "349",
    title: "Tawny Newsome and Her Friends, Our Close Friends Again",
    pubDate: "Mon, 25 May 2020 14:00:00 GMT",
    description: "The Boys ask TAWNY NEWSOME to call some of her famous friends again to hear the pitch of a lifetime.\xA0 ",
    isoDate: "2020-05-25T14:00:00.000Z"
  },
  {
    id: "350",
    title: "Dom and The Scuzzman, Our Close Friends Return",
    pubDate: "Wed, 03 Jun 2020 01:38:00 GMT",
    description: "DOMINIC DIERKES and THE SCUZZMAN make their much awaited return to tell The Boys about their new movie. ",
    isoDate: "2020-06-03T01:38:00.000Z"
  },
  {
    id: "351",
    title: "Joe Wengert, Our Clean Comedy Friend",
    pubDate: "Mon, 08 Jun 2020 14:00:00 GMT",
    description: "JOE WENGERT returns to help The Boys make a PG version of the podcast. ",
    isoDate: "2020-06-08T14:00:00.000Z"
  },
  {
    id: "352",
    title: "The Scoop Troop, Our Fundraising Friends",
    pubDate: "Mon, 15 Jun 2020 14:00:00 GMT",
    description: "The Boys do a call in episode with listeners who donated to The Scoop Troop's GoFundMe for\xA0Black Lives Matter, Reclaim the Block, NAACP Legal Defense and Education Fund, Color of Change, and The Okra Project. ",
    isoDate: "2020-06-15T14:00:00.000Z"
  },
  {
    id: "353",
    title: "Zach Reino and Jessica McKenna, Our Halftime Show Friends",
    pubDate: "Mon, 22 Jun 2020 14:00:00 GMT",
    description: "The Boys welcome back ZACH REINO and JESSICA MCKENNA to help with the Super Bowl halftime show. ",
    isoDate: "2020-06-22T14:00:00.000Z"
  },
  {
    id: "354",
    title: "Harvey Guill\xE9n, Our Movies Friend",
    pubDate: "Mon, 29 Jun 2020 14:00:15 GMT",
    description: "The Boys welcome HARVEY GUILL\xC9N to the show to help him make What We Do In The Shadows back into a movie. ",
    isoDate: "2020-06-29T14:00:15.000Z"
  },
  {
    id: "355",
    title: "Carl Tart, Our VR Family Guy Friend",
    pubDate: "Mon, 06 Jul 2020 14:47:00 GMT",
    description: "CARL TART returns to help The Boys write their VR Family Guy episode.\xA0 ",
    isoDate: "2020-07-06T14:47:00.000Z"
  },
  {
    id: "356",
    title: 'Kenny "The Jet" Smith, Our Basketball Friend',
    pubDate: "Tue, 14 Jul 2020 02:00:00 GMT",
    description: 'The Boys welcome KENNY "THE JET" SMITH to discuss JetAcademyCamp.com \xA0and help him land a role in the next big movie.\xA0 ',
    isoDate: "2020-07-14T02:00:00.000Z"
  },
  {
    id: "357",
    title: "Little Esther and Dave King, Our Couples Goals Friends",
    pubDate: "Mon, 20 Jul 2020 07:00:00 GMT",
    description: "LITTLE ESTHER and DAVE KING return to share the true meaning of love. ",
    isoDate: "2020-07-20T07:00:00.000Z"
  },
  {
    id: "358",
    title: "Chris Gethard, Our Sirius Mixer Friend",
    pubDate: "Mon, 27 Jul 2020 07:00:00 GMT",
    description: "CHRIS GETHARD returns to help The Boys prepare for the Earwolf-Sirius XM mixer.\xA0 ",
    isoDate: "2020-07-27T07:00:00.000Z"
  },
  {
    id: "359",
    title: "Lily Sullivan, Our Close Friend",
    pubDate: "Mon, 03 Aug 2020 07:00:00 GMT",
    description: "The Boys welcome LILY SULLIVAN to debut her new album.\xA0 ",
    isoDate: "2020-08-03T07:00:00.000Z"
  },
  {
    id: "360",
    title: "Timothy Simons, Our Character Study Friend",
    pubDate: "Mon, 10 Aug 2020 07:00:00 GMT",
    description: "The Boys welcome TIMOTHY SIMONS to do a character study of all his famous roles.\xA0 ",
    isoDate: "2020-08-10T07:00:00.000Z"
  },
  {
    id: "361",
    title: "Beth Stelling, Our Close Friend",
    pubDate: "Mon, 17 Aug 2020 07:00:00 GMT",
    description: "BETH STELLING joins The Boys to help create The Comedy Bubble.\xA0 ",
    isoDate: "2020-08-17T07:00:00.000Z"
  },
  {
    id: "362",
    title: "Langston Kerman, Our Podcast University Friend",
    pubDate: "Mon, 24 Aug 2020 07:00:00 GMT",
    description: "The Boys give LANGSTON KERMAN a crash course at the brand new Podcast University.\xA0 ",
    isoDate: "2020-08-24T07:00:00.000Z"
  },
  {
    id: "363",
    title: "Jack Quaid, Our Butt-Kicking Friend",
    pubDate: "Mon, 31 Aug 2020 19:00:00 GMT",
    description: "The Boys welcome JACK QUAID to the show to learn how to kick some butt. ",
    isoDate: "2020-08-31T19:00:00.000Z"
  },
  {
    id: "364",
    title: "Yassir Lester, Our Emmys Friend",
    pubDate: "Mon, 07 Sep 2020 07:00:00 GMT",
    description: "YASSIR LESTER returns to help The Boys produce the Emmys. ",
    isoDate: "2020-09-07T07:00:00.000Z"
  },
  {
    id: "365",
    title: "Paul F. Tompkins, Our Birthday Party Friend",
    pubDate: "Mon, 14 Sep 2020 07:00:00 GMT",
    description: "The Boys host a surprise birthday party for PAUL F. TOMPKINS with some help from a few close friends. ",
    isoDate: "2020-09-14T07:00:00.000Z"
  },
  {
    id: "366",
    title: "Chris Fleming, Our YouTube Friend",
    pubDate: "Mon, 21 Sep 2020 07:00:00 GMT",
    description: "The Boys welcome CHRIS FLEMING to the show to share some YouTube advice. ",
    isoDate: "2020-09-21T07:00:00.000Z"
  },
  {
    id: "367",
    title: "Ayo Edebiri, Our Interesting Topics Friend",
    pubDate: "Mon, 28 Sep 2020 07:00:00 GMT",
    description: "The Boys welcome back AYO EDEBIRI to discuss some interesting topics. ",
    isoDate: "2020-09-28T07:00:00.000Z"
  },
  {
    id: "368",
    title: "Jamie Loftus, Our Smart Podcast Friend",
    pubDate: "Mon, 05 Oct 2020 07:00:00 GMT",
    description: "JAMIE LOFTUS returns to help The Boys make a\xA0podcast but smart. ",
    isoDate: "2020-10-05T07:00:00.000Z"
  },
  {
    id: "369",
    title: "Haley Joel Osment, Our New Business Partner",
    pubDate: "Mon, 12 Oct 2020 07:00:00 GMT",
    description: "HALEY JOEL OSMENT joins The Boys in creating an exciting new business venture. ",
    isoDate: "2020-10-12T07:00:00.000Z"
  },
  {
    id: "370",
    title: "Alex Goldman, Our Reply All Friend",
    pubDate: "Mon, 19 Oct 2020 07:00:00 GMT",
    description: "The Boys welcome Alex Goldman to the show to buy Reply All's assets and do a viral episode. ",
    isoDate: "2020-10-19T07:00:00.000Z"
  },
  {
    id: "371",
    title: "Tim Heidecker, Our TimXM Friend",
    pubDate: "Mon, 26 Oct 2020 07:00:00 GMT",
    description: "TIM HEIDECKER returns to make a special new channel with The Boys. ",
    isoDate: "2020-10-26T07:00:00.000Z"
  },
  {
    id: "372",
    title: "Sona Movsesian, Our Freak Show Friday Friend",
    pubDate: "Mon, 02 Nov 2020 08:00:00 GMT",
    description: "SONA MOVSESIAN returns to fully chill on Freak Show Friday.\xA0 ",
    isoDate: "2020-11-02T08:00:00.000Z"
  },
  {
    id: "373",
    title: "Will Hines, Our Election Friend",
    pubDate: "Mon, 09 Nov 2020 05:00:00 GMT",
    description: "The Boys welcome back WILL HINES to explain what the heck even happened. ",
    isoDate: "2020-11-09T05:00:00.000Z"
  },
  {
    id: "374",
    title: "Aunty Donna, Our Close Friends",
    pubDate: "Mon, 16 Nov 2020 05:00:00 GMT",
    description: "BRODEN KELLY, ZACHARY RUANE, AND MARK BONANNO of the Australian sketch group Aunty Donna teach The Boys how one hypothetically gets their own Netflix show. ",
    isoDate: "2020-11-16T05:00:00.000Z"
  },
  {
    id: "375",
    title: "Atsuko Okatsuka, Our Game Show Friend",
    pubDate: "Mon, 23 Nov 2020 17:00:00 GMT",
    description: "Sean and ATSUKO OKATSUKA compete in Hayes's special game show. ",
    isoDate: "2020-11-23T17:00:00.000Z"
  },
  {
    id: "376",
    title: "The Cowboy TV Christmas Special (with Bang Rodgman)",
    pubDate: "Mon, 30 Nov 2020 05:00:38 GMT",
    description: "Hayes helps Sean and BANG RODGMAN film The Cowboy TV Christmas Special. ",
    isoDate: "2020-11-30T05:00:38.000Z"
  },
  {
    id: "377",
    title: "Naomi Fry, Our Important Writer Friend",
    pubDate: "Mon, 07 Dec 2020 05:00:46 GMT",
    description: "NAOMI FRY writes a seriously major article about The Boys. ",
    isoDate: "2020-12-07T05:00:46.000Z"
  },
  {
    id: "378",
    title: "Jason Concepcion, Our Close Friend",
    pubDate: "Mon, 14 Dec 2020 05:00:12 GMT",
    description: "JASON CONCEPCION teaches The Boys about all these movie franchises. ",
    isoDate: "2020-12-14T05:00:12.000Z"
  },
  {
    id: "379",
    title: "Julie Klausner, Our Former Close Friend",
    pubDate: "Mon, 21 Dec 2020 21:00:00 GMT",
    description: "QUEENIE returns to announce her New Year's resolution. ",
    isoDate: "2020-12-21T21:00:00.000Z"
  },
  {
    id: "380",
    title: "Our Farewell to Earwolf Episode",
    pubDate: "Mon, 28 Dec 2020 21:00:00 GMT",
    description: "SHAUN DISTON helps The Boys say goodbye to Earwolf. ",
    isoDate: "2020-12-28T21:00:00.000Z"
  },
  {
    id: "381",
    title: "Jake Johnson, Our First Close Friend",
    pubDate: "Mon, 04 Jan 2021 22:54:37 GMT",
    description: "The first Hollywood Handbook guest JAKE JOHNSON returns to ask The Boys what went wrong and to do press for his pilot.\xA0 Also, check out all the shows The Boys are adding to their Patreon (including The Pro Version) at Patreon.com/TheFlagrantOnes.\xA0 ",
    isoDate: "2021-01-04T22:54:37.000Z"
  },
  {
    id: "382",
    title: "Natalie Palamides, Our Clown Friend",
    pubDate: "Mon, 11 Jan 2021 21:01:03 GMT",
    description: 'NATALIE PALAMIDES teaches The Boys how to become clowns.\xA0 Watch her special "Nate - A One Man Show" on Netflix! Also, The Boys and Carl Tart have new episodes of shows releasing 5 days a week at Patreon.com/TheFlagrantOnes.\xA0 ',
    isoDate: "2021-01-11T21:01:03.000Z"
  },
  {
    id: "383",
    title: "Carl Tart and Ahsohn Williams, Our Business Associates",
    pubDate: "Mon, 18 Jan 2021 21:36:24 GMT",
    description: "The Boys and CARL TART welcome AHSOHN WILLIAMS to the show to improve their Patreon. Check out their new episodes 5 days a week at Patreon.com/TheFlagrantOnes.\xA0 ",
    isoDate: "2021-01-18T21:36:24.000Z"
  },
  {
    id: "384",
    title: "LilMookieB, Our Gratitude Friend",
    pubDate: "Mon, 25 Jan 2021 22:52:00 GMT",
    description: "MOOKIE BLAIKLOCK aka LilMookieB returns to tell The Boys about his journey becoming positivity and also answers some questions.\xA0 Check out all the new podcasts and videos at Patreon.com/TheFlagrantOnes. ",
    isoDate: "2021-01-25T22:52:00.000Z"
  },
  {
    id: "385",
    title: "Nick Wiger and Mike Mitchell, Our Patreon Partners",
    pubDate: "Mon, 01 Feb 2021 21:09:00 GMT",
    description: "NICK WIGER and MIKE MITCHELL return to collaborate with The Boys on their new business venture. ",
    isoDate: "2021-02-01T21:09:00.000Z"
  },
  {
    id: "386",
    title: "Dylan Gelula and Broti Gupta, Our Close Friends",
    pubDate: "Mon, 08 Feb 2021 22:32:00 GMT",
    description: "DYLAN GELULA and BROTI GUPTA from the podcast Lecture Hall host an important seminar for The Boys. Check out all the new podcasts and videos at Patreon.com/TheFlagrantOnes. Plus, there's 2 new Hollywood Handbook shirts available here. \xA0 ",
    isoDate: "2021-02-08T22:32:00.000Z"
  },
  {
    id: "387",
    title: "Griffin Newman and David Sims, Our Blank Check Friends",
    pubDate: "Mon, 15 Feb 2021 21:02:26 GMT",
    description: "The Boys teach GRIFFIN NEWMAN and DAVID SIMS how to do a much more efficient version of their podcast Blank Check. Check out the bonus podcasts and videos at Patreon.com/TheFlagrantOnes. The Boys also have new Hollywood Handbook merch available here. ",
    isoDate: "2021-02-15T21:02:26.000Z"
  },
  {
    id: "388",
    title: "Ben Rodgers and Brett Morris, Our Masterclass Friends",
    pubDate: "Mon, 22 Feb 2021 22:04:00 GMT",
    description: "BANG RODGMAN and ENGINEER BRETT return to debut a sneak peak of the new season of Hollywood Masterclass. Check out the Cowboy TV and Zen Den Online merch here! ",
    isoDate: "2021-02-22T22:04:00.000Z"
  },
  {
    id: "389",
    title: "The Podcaster\u2019s Promise Sessions: Volume I (with Paul F. Tompkins and Ayo Edebiri)",
    pubDate: "Mon, 01 Mar 2021 21:29:21 GMT",
    description: "PAUL F. TOMPKINS and AYO EDEBIRI return to the show for The Boys\u2019 debut episode of The Podcaster\u2019s Promise.\xA0 Check out the new Flagrant Ones' shirt available here and bonus episodes at Patreon.com/TheFlagrantOnes. ",
    isoDate: "2021-03-01T21:29:21.000Z"
  },
  {
    id: "390",
    title: "Bonus: The Flagrant Ones After Dark",
    pubDate: "Fri, 05 Mar 2021 01:16:00 GMT",
    description: `In celebration of Tri Month, please enjoy this un-paywalled Flagrant Ones episode. You can watch the video recording for free HERE.\xA0 If you'd like to subscribe for episodes 5 days a week and plenty of video content, go to Patreon.com/TheFlagrantOnes. Episode description: The Ones record an episode very late into the night and it results in them getting very flagrant indeed. Plus an After Dark version of "What Did This Man Say?" We looked at some stuff:\xA0 Top Shot guy discusses NBA players Joe Ingles crashes Donovan Mitchell's interview\xA0 Anthony Edwards likes an interviewer's accent\xA0 Shaq calls players "pudding pops"\xA0 Blake Griffin's prank show And also: An instant classic from the Flagrant Five `,
    isoDate: "2021-03-05T01:16:00.000Z"
  },
  {
    id: "391",
    title: "The Podcaster\u2019s Promise Sessions: Volume II (with Jon Gabrus and Joe Wengert)",
    pubDate: "Mon, 08 Mar 2021 20:53:57 GMT",
    description: "The Podcaster\u2019s Promise continues with JON GABRUS and JOE WENGERT. Check out the bonus podcasts and videos at Patreon.com/TheFlagrantOnes. ",
    isoDate: "2021-03-08T20:53:57.000Z"
  },
  {
    id: "392",
    title: "Bonus: Carl Calls His Cousin: Food Hot Takes",
    pubDate: "Fri, 12 Mar 2021 10:54:50 GMT",
    description: "In celebration of Tri Month, please enjoy this un-paywalled episode of Carl Calls His Cousin. You can watch the video recording for free HERE.\xA0 In this episode, Carl and Ahsohn share their food hot takes and a special commercial. ",
    isoDate: "2021-03-12T10:54:50.000Z"
  },
  {
    id: "393",
    title: "The Podcaster\u2019s Promise Sessions: Volume III (with Rajat Suresh and Jeremy Levick)",
    pubDate: "Mon, 15 Mar 2021 23:05:00 GMT",
    description: "Please enjoy part 3 of The Podcaster\u2019s Promise with JEREMY LEVICK and RAJAT SURESH. Check out the podcasts 5 days a week at Patreon.com/TheFlagrantOnes ",
    isoDate: "2021-03-15T23:05:00.000Z"
  },
  {
    id: "394",
    title: "The Podcaster\u2019s Promise Sessions: Volume IV (with Lauren Lapkus and Mary Holland)",
    pubDate: "Tue, 23 Mar 2021 00:17:00 GMT",
    description: "The Boys welcome back LAUREN LAPKUS and MARY HOLLAND for the fourth installation of The Podcaster's Promise. Check out the podcasts 5 days a week at Patreon.com/TheFlagrantOnes. ",
    isoDate: "2021-03-23T00:17:00.000Z"
  },
  {
    id: "395",
    title: "John Hodgman, Our Judge Friend",
    pubDate: "Tue, 30 Mar 2021 00:38:00 GMT",
    description: "The Boys and JOHN HODGMAN have fun doing an episode of Judge Hollywood Handbook. Check out the bonus podcasts and videos at Patreon.com/TheFlagrantOnes ",
    isoDate: "2021-03-30T00:38:00.000Z"
  },
  {
    id: "396",
    title: "Dave Holmes, Our On-Camera Friend",
    pubDate: "Tue, 06 Apr 2021 00:16:00 GMT",
    description: "DAVE HOLMES returns to teach The Boys how to have charisma on camera. Subscribe to watch the full video recording on Patreon here.\xA0 ",
    isoDate: "2021-04-06T00:16:00.000Z"
  },
  {
    id: "397",
    title: "Ronna Glickman and Bryan Safi, Our Advice Show Friends",
    pubDate: "Mon, 12 Apr 2021 21:01:00 GMT",
    description: "RONNA GLICKMAN and BRYAN SAFI from the podcast Ask Ronna help The Boys create characters for their new advice show. Subscribe on Patreon and watch the full video recording here.\xA0 ",
    isoDate: "2021-04-12T21:01:00.000Z"
  },
  {
    id: "398",
    title: "Bridger Winegar, Our Close Friend",
    pubDate: "Mon, 19 Apr 2021 21:41:11 GMT",
    description: "BRIDGER WINEGAR from I Said No Gifts splits up some of his gifts with The Boys.\xA0 Check out the bonus podcasts and videos at Patreon.com/TheFlagrantOnes ",
    isoDate: "2021-04-19T21:41:11.000Z"
  },
  {
    id: "399",
    title: "Tawny Newsome and Her Dad, Our Cartoon Friends",
    pubDate: "Mon, 26 Apr 2021 21:59:00 GMT",
    description: "The Boys welcome back TAWNY NEWSOME to pitch more cartoons to her dad. Check out her new podcasts at suboptimalpods.com. Subscribe on Patreon and watch the full video recording of this episode here.\xA0 ",
    isoDate: "2021-04-26T21:59:00.000Z"
  },
  {
    id: "400",
    title: "Jesse Farrar and Mike Hale, Our Your Kickstarter Sucks Friends",
    pubDate: "Mon, 03 May 2021 21:23:00 GMT",
    description: "The Boys catch up with JESSE FARRAR and meet his co-host MIKE HALE of the podcast Your Kickstarter Sucks. Subscribe on Patreon and watch the full video recording of this episode here.\xA0 ",
    isoDate: "2021-05-03T21:23:00.000Z"
  },
  {
    id: "401",
    title: "Tom Scharpling, Our Maintenance Friend",
    pubDate: "Mon, 10 May 2021 23:11:00 GMT",
    description: "TOM SCHARPLING returns to do some maintenance on the show. Subscribe on Patreon and watch the full video recording of this episode here.\xA0 ",
    isoDate: "2021-05-10T23:11:00.000Z"
  }
];
var Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  let query = "";
  let hits, stats;
  const client = new import_meilisearch.MeiliSearch({
    host: "https://meili-router-zraqvc5gd4kituxj-gtw.qovery.io",
    apiKey: "masterKey"
  });
  const index2 = client.index("handbook");
  function search() {
    return __awaiter(this, void 0, void 0, function* () {
      const data = yield index2.search(query, {attributesToHighlight: ["line"]});
      console.log(data);
      stats = {
        nbHits: data.nbHits,
        processingTime: data.processingTimeMs
      };
      hits = data.hits;
    });
  }
  onMount(() => {
    if (query === "")
      query = randomQuery[getRandomInt(randomQuery.length)];
    search();
  });
  const findEpNr = (title, returnValue) => {
    const epNr = EpList.find((x) => x.title == title);
    if (epNr)
      return epNr[returnValue];
    return null;
  };
  return `<div class="${"mx-auto w-full px-10 md:px-4 md:w-3/4"}"><input class="${"w-full h-12 px-4 text-xl border border-gray-500 outline-none"}" type="${"text"}"${add_attribute("value", query, 1)}>
	
	<p class="${"my-2"}">${stats ? `Found ${escape2(stats.nbHits)} hits for <span class="${"font-bold"}">${escape2(query)}</span> in ${escape2(stats.processingTime)}
			ms` : ``}</p>
	<button>Random phrase</button>
	${hits ? `${each(hits, (hit) => `<div class="${"w-full px-4 pb-6 mb-6 shadow-md hover:bg-blue-100"}"><div class="${"flex flex-wrap items-center justify-between w-full mb-2"}"><div class="${"flex items-center"}"><div class="${"pt-1 mr-2 text-xs text-gray-700 uppercase"}">#${escape2(findEpNr(hit.episode, "id"))}</div>
						<div class="${"text-sm text-gray-800 md:text-base"}">${escape2(hit.episode)} (${escape2(new Date(findEpNr(hit.episode, "isoDate")).toDateString())})</div></div>
					<div class="${"flex items-center font-mono text-right text-gray-600"}"><div class="${"mr-2 font-sans text-black"}">${escape2(hit.speaker)}</div>
						<div class="${"mr-2 font-sans text-right text-blue-600 border-b-2 border-dotted"}"></div>
						${escape2(secToMins(hit.timeCode))}\xA0
					</div></div>
				<div class="${"py-2 pl-4 mt-4 border-l-2 border-gray-400 md:text-lg"}"><p>${hit._formatted.line}</p></div>
			</div>`)}` : ``}</div>`;
});
var prerender = true;
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Home</title>`, ""}`, ""}

<section><h1 class="${"text-3xl text-blue-400"}">Handbook Search</h1>
	<p>The unofficial Hollywood Handbook search engine</p>
	${validate_component(Search, "Search").$$render($$result, {}, {}, {})}</section>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  prerender
});

// .svelte-kit/vercel/entry.js
var entry_default = async (req, res) => {
  const {pathname, searchParams} = new URL(req.url || "", "http://localhost");
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: await getRawBody(req)
  });
  if (rendered) {
    const {status, headers, body} = rendered;
    return res.writeHead(status, headers).end(body);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
