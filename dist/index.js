var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod2, isNodeMode, target) => {
  target = mod2 != null ? __create(__getProtoOf(mod2)) : {};
  const to = isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod2))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod2[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod2) => () => (mod2 || cb((mod2 = { exports: {} }).exports, mod2), mod2.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// node_modules/@protobufjs/aspromise/index.js
var require_aspromise = __commonJS((exports, module) => {
  var asPromise = function(fn, ctx) {
    var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
    while (index < arguments.length)
      params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
      params[offset] = function callback(err) {
        if (pending) {
          pending = false;
          if (err)
            reject(err);
          else {
            var params2 = new Array(arguments.length - 1), offset2 = 0;
            while (offset2 < params2.length)
              params2[offset2++] = arguments[offset2];
            resolve.apply(null, params2);
          }
        }
      };
      try {
        fn.apply(ctx || null, params);
      } catch (err) {
        if (pending) {
          pending = false;
          reject(err);
        }
      }
    });
  };
  module.exports = asPromise;
});

// node_modules/@protobufjs/base64/index.js
var require_base64 = __commonJS((exports) => {
  var base64 = exports;
  base64.length = function length(string) {
    var p = string.length;
    if (!p)
      return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
      ++n;
    return Math.ceil(string.length * 3) / 4 - n;
  };
  var b64 = new Array(64);
  var s64 = new Array(123);
  for (i = 0;i < 64; )
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
  var i;
  base64.encode = function encode(buffer, start, end) {
    var parts = null, chunk = [];
    var i2 = 0, j = 0, t;
    while (start < end) {
      var b = buffer[start++];
      switch (j) {
        case 0:
          chunk[i2++] = b64[b >> 2];
          t = (b & 3) << 4;
          j = 1;
          break;
        case 1:
          chunk[i2++] = b64[t | b >> 4];
          t = (b & 15) << 2;
          j = 2;
          break;
        case 2:
          chunk[i2++] = b64[t | b >> 6];
          chunk[i2++] = b64[b & 63];
          j = 0;
          break;
      }
      if (i2 > 8191) {
        (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
        i2 = 0;
      }
    }
    if (j) {
      chunk[i2++] = b64[t];
      chunk[i2++] = 61;
      if (j === 1)
        chunk[i2++] = 61;
    }
    if (parts) {
      if (i2)
        parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
      return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i2));
  };
  var invalidEncoding = "invalid encoding";
  base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, t;
    for (var i2 = 0;i2 < string.length; ) {
      var c = string.charCodeAt(i2++);
      if (c === 61 && j > 1)
        break;
      if ((c = s64[c]) === undefined)
        throw Error(invalidEncoding);
      switch (j) {
        case 0:
          t = c;
          j = 1;
          break;
        case 1:
          buffer[offset++] = t << 2 | (c & 48) >> 4;
          t = c;
          j = 2;
          break;
        case 2:
          buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
          t = c;
          j = 3;
          break;
        case 3:
          buffer[offset++] = (t & 3) << 6 | c;
          j = 0;
          break;
      }
    }
    if (j === 1)
      throw Error(invalidEncoding);
    return offset - start;
  };
  base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
  };
});

// node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = __commonJS((exports, module) => {
  var EventEmitter = function() {
    this._listeners = {};
  };
  module.exports = EventEmitter;
  EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
      fn,
      ctx: ctx || this
    });
    return this;
  };
  EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
      this._listeners = {};
    else {
      if (fn === undefined)
        this._listeners[evt] = [];
      else {
        var listeners = this._listeners[evt];
        for (var i = 0;i < listeners.length; )
          if (listeners[i].fn === fn)
            listeners.splice(i, 1);
          else
            ++i;
      }
    }
    return this;
  };
  EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
      var args = [], i = 1;
      for (;i < arguments.length; )
        args.push(arguments[i++]);
      for (i = 0;i < listeners.length; )
        listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
  };
});

// node_modules/@protobufjs/float/index.js
var require_float = __commonJS((exports, module) => {
  var factory = function(exports2) {
    if (typeof Float32Array !== "undefined")
      (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[3];
          buf[pos + 1] = f8b[2];
          buf[pos + 2] = f8b[1];
          buf[pos + 3] = f8b[0];
        }
        exports2.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports2.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
          f8b[3] = buf[pos];
          f8b[2] = buf[pos + 1];
          f8b[1] = buf[pos + 2];
          f8b[0] = buf[pos + 3];
          return f32[0];
        }
        exports2.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports2.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
    else
      (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf, pos);
          else if (val > 340282346638528860000000000000000000000)
            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
          else if (val < 0.000000000000000000000000000000000000011754943508222875)
            writeUint((sign << 31 | Math.round(val / 0.000000000000000000000000000000000000000000001401298464324817)) >>> 0, buf, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
          }
        }
        exports2.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports2.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 0.000000000000000000000000000000000000000000001401298464324817 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports2.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports2.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
    if (typeof Float64Array !== "undefined")
      (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
          buf[pos + 4] = f8b[4];
          buf[pos + 5] = f8b[5];
          buf[pos + 6] = f8b[6];
          buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[7];
          buf[pos + 1] = f8b[6];
          buf[pos + 2] = f8b[5];
          buf[pos + 3] = f8b[4];
          buf[pos + 4] = f8b[3];
          buf[pos + 5] = f8b[2];
          buf[pos + 6] = f8b[1];
          buf[pos + 7] = f8b[0];
        }
        exports2.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports2.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          f8b[4] = buf[pos + 4];
          f8b[5] = buf[pos + 5];
          f8b[6] = buf[pos + 6];
          f8b[7] = buf[pos + 7];
          return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
          f8b[7] = buf[pos];
          f8b[6] = buf[pos + 1];
          f8b[5] = buf[pos + 2];
          f8b[4] = buf[pos + 3];
          f8b[3] = buf[pos + 4];
          f8b[2] = buf[pos + 5];
          f8b[1] = buf[pos + 6];
          f8b[0] = buf[pos + 7];
          return f64[0];
        }
        exports2.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports2.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
    else
      (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0) {
            writeUint(0, buf, pos + off0);
            writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf, pos + off0);
            writeUint(2146959360, buf, pos + off1);
          } else if (val > 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000) {
            writeUint(0, buf, pos + off0);
            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
          } else {
            var mantissa;
            if (val < 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022250738585072014) {
              mantissa = val / 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005;
              writeUint(mantissa >>> 0, buf, pos + off0);
              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
            }
          }
        }
        exports2.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports2.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports2.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports2.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
    return exports2;
  };
  var writeUintLE = function(val, buf, pos) {
    buf[pos] = val & 255;
    buf[pos + 1] = val >>> 8 & 255;
    buf[pos + 2] = val >>> 16 & 255;
    buf[pos + 3] = val >>> 24;
  };
  var writeUintBE = function(val, buf, pos) {
    buf[pos] = val >>> 24;
    buf[pos + 1] = val >>> 16 & 255;
    buf[pos + 2] = val >>> 8 & 255;
    buf[pos + 3] = val & 255;
  };
  var readUintLE = function(buf, pos) {
    return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
  };
  var readUintBE = function(buf, pos) {
    return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
  };
  module.exports = factory(factory);
});

// node_modules/@protobufjs/inquire/index.js
var require_inquire = __commonJS((exports, module) => {
  function inquire(moduleName) {
    try {
      var mod = eval("quire".replace(/^/, "re"))(moduleName);
      if (mod && (mod.length || Object.keys(mod).length))
        return mod;
    } catch (e) {
    }
    return null;
  }
  module.exports = inquire;
});

// node_modules/@protobufjs/utf8/index.js
var require_utf8 = __commonJS((exports) => {
  var utf8 = exports;
  utf8.length = function utf8_length(string) {
    var len = 0, c = 0;
    for (var i = 0;i < string.length; ++i) {
      c = string.charCodeAt(i);
      if (c < 128)
        len += 1;
      else if (c < 2048)
        len += 2;
      else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
        ++i;
        len += 4;
      } else
        len += 3;
    }
    return len;
  };
  utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
      return "";
    var parts = null, chunk = [], i = 0, t;
    while (start < end) {
      t = buffer[start++];
      if (t < 128)
        chunk[i++] = t;
      else if (t > 191 && t < 224)
        chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
      else if (t > 239 && t < 365) {
        t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
        chunk[i++] = 55296 + (t >> 10);
        chunk[i++] = 56320 + (t & 1023);
      } else
        chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
      if (i > 8191) {
        (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
        i = 0;
      }
    }
    if (parts) {
      if (i)
        parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
      return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
  };
  utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset, c1, c2;
    for (var i = 0;i < string.length; ++i) {
      c1 = string.charCodeAt(i);
      if (c1 < 128) {
        buffer[offset++] = c1;
      } else if (c1 < 2048) {
        buffer[offset++] = c1 >> 6 | 192;
        buffer[offset++] = c1 & 63 | 128;
      } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
        c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
        ++i;
        buffer[offset++] = c1 >> 18 | 240;
        buffer[offset++] = c1 >> 12 & 63 | 128;
        buffer[offset++] = c1 >> 6 & 63 | 128;
        buffer[offset++] = c1 & 63 | 128;
      } else {
        buffer[offset++] = c1 >> 12 | 224;
        buffer[offset++] = c1 >> 6 & 63 | 128;
        buffer[offset++] = c1 & 63 | 128;
      }
    }
    return offset - start;
  };
});

// node_modules/@protobufjs/pool/index.js
var require_pool = __commonJS((exports, module) => {
  var pool = function(alloc, slice, size) {
    var SIZE = size || 8192;
    var MAX = SIZE >>> 1;
    var slab = null;
    var offset = SIZE;
    return function pool_alloc(size2) {
      if (size2 < 1 || size2 > MAX)
        return alloc(size2);
      if (offset + size2 > SIZE) {
        slab = alloc(SIZE);
        offset = 0;
      }
      var buf = slice.call(slab, offset, offset += size2);
      if (offset & 7)
        offset = (offset | 7) + 1;
      return buf;
    };
  };
  module.exports = pool;
});

// node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS((exports, module) => {
  var LongBits = function(lo, hi) {
    this.lo = lo >>> 0;
    this.hi = hi >>> 0;
  };
  module.exports = LongBits;
  var util = require_minimal();
  var zero = LongBits.zero = new LongBits(0, 0);
  zero.toNumber = function() {
    return 0;
  };
  zero.zzEncode = zero.zzDecode = function() {
    return this;
  };
  zero.length = function() {
    return 1;
  };
  var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
  LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
      return zero;
    var sign = value < 0;
    if (sign)
      value = -value;
    var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295)
          hi = 0;
      }
    }
    return new LongBits(lo, hi);
  };
  LongBits.from = function from(value) {
    if (typeof value === "number")
      return LongBits.fromNumber(value);
    if (util.isString(value)) {
      if (util.Long)
        value = util.Long.fromString(value);
      else
        return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
  };
  LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
      var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
      if (!lo)
        hi = hi + 1 >>> 0;
      return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
  };
  LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
  };
  var charCodeAt = String.prototype.charCodeAt;
  LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
      return zero;
    return new LongBits((charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0, (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0);
  };
  LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
  };
  LongBits.prototype.zzEncode = function zzEncode() {
    var mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
  };
  LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
  };
  LongBits.prototype.length = function length() {
    var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
  };
});

// node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS((exports) => {
  var merge = function(dst, src, ifNotSet) {
    for (var keys = Object.keys(src), i = 0;i < keys.length; ++i)
      if (dst[keys[i]] === undefined || !ifNotSet)
        dst[keys[i]] = src[keys[i]];
    return dst;
  };
  var newError = function(name) {
    function CustomError(message, properties) {
      if (!(this instanceof CustomError))
        return new CustomError(message, properties);
      Object.defineProperty(this, "message", { get: function() {
        return message;
      } });
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, CustomError);
      else
        Object.defineProperty(this, "stack", { value: new Error().stack || "" });
      if (properties)
        merge(this, properties);
    }
    CustomError.prototype = Object.create(Error.prototype, {
      constructor: {
        value: CustomError,
        writable: true,
        enumerable: false,
        configurable: true
      },
      name: {
        get: function get() {
          return name;
        },
        set: undefined,
        enumerable: false,
        configurable: true
      },
      toString: {
        value: function value() {
          return this.name + ": " + this.message;
        },
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
    return CustomError;
  };
  var util = exports;
  util.asPromise = require_aspromise();
  util.base64 = require_base64();
  util.EventEmitter = require_eventemitter();
  util.float = require_float();
  util.inquire = require_inquire();
  util.utf8 = require_utf8();
  util.pool = require_pool();
  util.LongBits = require_longbits();
  util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
  util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports;
  util.emptyArray = Object.freeze ? Object.freeze([]) : [];
  util.emptyObject = Object.freeze ? Object.freeze({}) : {};
  util.isInteger = Number.isInteger || function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };
  util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
  };
  util.isObject = function isObject(value) {
    return value && typeof value === "object";
  };
  util.isset = util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop))
      return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
  };
  util.Buffer = function() {
    try {
      var Buffer = util.inquire("buffer").Buffer;
      return Buffer.prototype.utf8Write ? Buffer : null;
    } catch (e) {
      return null;
    }
  }();
  util._Buffer_from = null;
  util._Buffer_allocUnsafe = null;
  util.newBuffer = function newBuffer(sizeOrArray) {
    return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
  };
  util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  util.Long = util.global.dcodeIO && util.global.dcodeIO.Long || util.global.Long || util.inquire("long");
  util.key2Re = /^true|false|0|1$/;
  util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
  util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
  util.longToHash = function longToHash(value) {
    return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
  };
  util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
      return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
  };
  util.merge = merge;
  util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  };
  util.newError = newError;
  util.ProtocolError = newError("ProtocolError");
  util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0;i < fieldNames.length; ++i)
      fieldMap[fieldNames[i]] = 1;
    return function() {
      for (var keys = Object.keys(this), i2 = keys.length - 1;i2 > -1; --i2)
        if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== undefined && this[keys[i2]] !== null)
          return keys[i2];
    };
  };
  util.oneOfSetter = function setOneOf(fieldNames) {
    return function(name) {
      for (var i = 0;i < fieldNames.length; ++i)
        if (fieldNames[i] !== name)
          delete this[fieldNames[i]];
    };
  };
  util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
  };
  util._configure = function() {
    var Buffer = util.Buffer;
    if (!Buffer) {
      util._Buffer_from = util._Buffer_allocUnsafe = null;
      return;
    }
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || function Buffer_from(value, encoding) {
      return new Buffer(value, encoding);
    };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe || function Buffer_allocUnsafe(size) {
      return new Buffer(size);
    };
  };
});

// node_modules/protobufjs/src/writer.js
var require_writer = __commonJS((exports, module) => {
  var Op = function(fn, len, val) {
    this.fn = fn;
    this.len = len;
    this.next = undefined;
    this.val = val;
  };
  var noop = function() {
  };
  var State = function(writer) {
    this.head = writer.head;
    this.tail = writer.tail;
    this.len = writer.len;
    this.next = writer.states;
  };
  var Writer = function() {
    this.len = 0;
    this.head = new Op(noop, 0, 0);
    this.tail = this.head;
    this.states = null;
  };
  var writeByte = function(val, buf, pos) {
    buf[pos] = val & 255;
  };
  var writeVarint32 = function(val, buf, pos) {
    while (val > 127) {
      buf[pos++] = val & 127 | 128;
      val >>>= 7;
    }
    buf[pos] = val;
  };
  var VarintOp = function(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
  };
  var writeVarint64 = function(val, buf, pos) {
    while (val.hi) {
      buf[pos++] = val.lo & 127 | 128;
      val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
      val.hi >>>= 7;
    }
    while (val.lo > 127) {
      buf[pos++] = val.lo & 127 | 128;
      val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
  };
  var writeFixed32 = function(val, buf, pos) {
    buf[pos] = val & 255;
    buf[pos + 1] = val >>> 8 & 255;
    buf[pos + 2] = val >>> 16 & 255;
    buf[pos + 3] = val >>> 24;
  };
  module.exports = Writer;
  var util = require_minimal();
  var BufferWriter;
  var LongBits = util.LongBits;
  var base64 = util.base64;
  var utf8 = util.utf8;
  var create = function create() {
    return util.Buffer ? function create_buffer_setup() {
      return (Writer.create = function create_buffer() {
        return new BufferWriter;
      })();
    } : function create_array() {
      return new Writer;
    };
  };
  Writer.create = create();
  Writer.alloc = function alloc(size) {
    return new util.Array(size);
  };
  if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
  Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
  };
  VarintOp.prototype = Object.create(Op.prototype);
  VarintOp.prototype.fn = writeVarint32;
  Writer.prototype.uint32 = function write_uint32(value) {
    this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
    return this;
  };
  Writer.prototype.int32 = function write_int32(value) {
    return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
  };
  Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
  };
  Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
  };
  Writer.prototype.int64 = Writer.prototype.uint64;
  Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  };
  Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
  };
  Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
  };
  Writer.prototype.sfixed32 = Writer.prototype.fixed32;
  Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  };
  Writer.prototype.sfixed64 = Writer.prototype.fixed64;
  Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
  };
  Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
  };
  var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
    buf.set(val, pos);
  } : function writeBytes_for(val, buf, pos) {
    for (var i = 0;i < val.length; ++i)
      buf[pos + i] = val[i];
  };
  Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
      return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
      var buf = Writer.alloc(len = base64.length(value));
      base64.decode(value, buf, 0);
      value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
  };
  Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
  };
  Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
  };
  Writer.prototype.reset = function reset() {
    if (this.states) {
      this.head = this.states.head;
      this.tail = this.states.tail;
      this.len = this.states.len;
      this.states = this.states.next;
    } else {
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
    }
    return this;
  };
  Writer.prototype.ldelim = function ldelim() {
    var head = this.head, tail = this.tail, len = this.len;
    this.reset().uint32(len);
    if (len) {
      this.tail.next = head.next;
      this.tail = tail;
      this.len += len;
    }
    return this;
  };
  Writer.prototype.finish = function finish() {
    var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
    while (head) {
      head.fn(head.val, buf, pos);
      pos += head.len;
      head = head.next;
    }
    return buf;
  };
  Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
    Writer.create = create();
    BufferWriter._configure();
  };
});

// node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS((exports, module) => {
  var BufferWriter = function() {
    Writer.call(this);
  };
  var writeStringBuffer = function(val, buf, pos) {
    if (val.length < 40)
      util.utf8.write(val, buf, pos);
    else if (buf.utf8Write)
      buf.utf8Write(val, pos);
    else
      buf.write(val, pos);
  };
  module.exports = BufferWriter;
  var Writer = require_writer();
  (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
  var util = require_minimal();
  BufferWriter._configure = function() {
    BufferWriter.alloc = util._Buffer_allocUnsafe;
    BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytesBuffer_copy(val, buf, pos) {
      if (val.copy)
        val.copy(buf, pos, 0, val.length);
      else
        for (var i = 0;i < val.length; )
          buf[pos++] = val[i++];
    };
  };
  BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
      value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
      this._push(BufferWriter.writeBytesBuffer, len, value);
    return this;
  };
  BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = util.Buffer.byteLength(value);
    this.uint32(len);
    if (len)
      this._push(writeStringBuffer, len, value);
    return this;
  };
  BufferWriter._configure();
});

// node_modules/protobufjs/src/reader.js
var require_reader = __commonJS((exports, module) => {
  var indexOutOfRange = function(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
  };
  var Reader = function(buffer) {
    this.buf = buffer;
    this.pos = 0;
    this.len = buffer.length;
  };
  var readLongVarint = function() {
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) {
      for (;i < 4; ++i) {
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
      if (this.buf[this.pos++] < 128)
        return bits;
      i = 0;
    } else {
      for (;i < 3; ++i) {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
      bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
      return bits;
    }
    if (this.len - this.pos > 4) {
      for (;i < 5; ++i) {
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
    } else {
      for (;i < 5; ++i) {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
      }
    }
    throw Error("invalid varint encoding");
  };
  var readFixed32_end = function(buf, end) {
    return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
  };
  var readFixed64 = function() {
    if (this.pos + 8 > this.len)
      throw indexOutOfRange(this, 8);
    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
  };
  module.exports = Reader;
  var util = require_minimal();
  var BufferReader;
  var LongBits = util.LongBits;
  var utf8 = util.utf8;
  var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
    if (buffer instanceof Uint8Array || Array.isArray(buffer))
      return new Reader(buffer);
    throw Error("illegal buffer");
  } : function create_array(buffer) {
    if (Array.isArray(buffer))
      return new Reader(buffer);
    throw Error("illegal buffer");
  };
  var create = function create() {
    return util.Buffer ? function create_buffer_setup(buffer) {
      return (Reader.create = function create_buffer(buffer2) {
        return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
      })(buffer);
    } : create_array;
  };
  Reader.create = create();
  Reader.prototype._slice = util.Array.prototype.subarray || util.Array.prototype.slice;
  Reader.prototype.uint32 = function read_uint32_setup() {
    var value = 4294967295;
    return function read_uint32() {
      value = (this.buf[this.pos] & 127) >>> 0;
      if (this.buf[this.pos++] < 128)
        return value;
      value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
      if (this.buf[this.pos++] < 128)
        return value;
      value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
      if (this.buf[this.pos++] < 128)
        return value;
      value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
      if (this.buf[this.pos++] < 128)
        return value;
      value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
      if (this.buf[this.pos++] < 128)
        return value;
      if ((this.pos += 5) > this.len) {
        this.pos = this.len;
        throw indexOutOfRange(this, 10);
      }
      return value;
    };
  }();
  Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
  };
  Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
  };
  Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
  };
  Reader.prototype.fixed32 = function read_fixed32() {
    if (this.pos + 4 > this.len)
      throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, this.pos += 4);
  };
  Reader.prototype.sfixed32 = function read_sfixed32() {
    if (this.pos + 4 > this.len)
      throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, this.pos += 4) | 0;
  };
  Reader.prototype.float = function read_float() {
    if (this.pos + 4 > this.len)
      throw indexOutOfRange(this, 4);
    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
  };
  Reader.prototype.double = function read_double() {
    if (this.pos + 8 > this.len)
      throw indexOutOfRange(this, 4);
    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
  };
  Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(), start = this.pos, end = this.pos + length;
    if (end > this.len)
      throw indexOutOfRange(this, length);
    this.pos += length;
    if (Array.isArray(this.buf))
      return this.buf.slice(start, end);
    if (start === end) {
      var nativeBuffer = util.Buffer;
      return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
    }
    return this._slice.call(this.buf, start, end);
  };
  Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
  };
  Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
      if (this.pos + length > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
    } else {
      do {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
      } while (this.buf[this.pos++] & 128);
    }
    return this;
  };
  Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((wireType = this.uint32() & 7) !== 4) {
          this.skipType(wireType);
        }
        break;
      case 5:
        this.skip(4);
        break;
      default:
        throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
  };
  Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;
    Reader.create = create();
    BufferReader._configure();
    var fn = util.Long ? "toLong" : "toNumber";
    util.merge(Reader.prototype, {
      int64: function read_int64() {
        return readLongVarint.call(this)[fn](false);
      },
      uint64: function read_uint64() {
        return readLongVarint.call(this)[fn](true);
      },
      sint64: function read_sint64() {
        return readLongVarint.call(this).zzDecode()[fn](false);
      },
      fixed64: function read_fixed64() {
        return readFixed64.call(this)[fn](true);
      },
      sfixed64: function read_sfixed64() {
        return readFixed64.call(this)[fn](false);
      }
    });
  };
});

// node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS((exports, module) => {
  var BufferReader = function(buffer) {
    Reader.call(this, buffer);
  };
  module.exports = BufferReader;
  var Reader = require_reader();
  (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
  var util = require_minimal();
  BufferReader._configure = function() {
    if (util.Buffer)
      BufferReader.prototype._slice = util.Buffer.prototype.slice;
  };
  BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32();
    return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
  };
  BufferReader._configure();
});

// node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS((exports, module) => {
  var Service = function(rpcImpl, requestDelimited, responseDelimited) {
    if (typeof rpcImpl !== "function")
      throw TypeError("rpcImpl must be a function");
    util.EventEmitter.call(this);
    this.rpcImpl = rpcImpl;
    this.requestDelimited = Boolean(requestDelimited);
    this.responseDelimited = Boolean(responseDelimited);
  };
  module.exports = Service;
  var util = require_minimal();
  (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
  Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
    if (!request)
      throw TypeError("request must be specified");
    var self2 = this;
    if (!callback)
      return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
    if (!self2.rpcImpl) {
      setTimeout(function() {
        callback(Error("already ended"));
      }, 0);
      return;
    }
    try {
      return self2.rpcImpl(method, requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(), function rpcCallback(err, response) {
        if (err) {
          self2.emit("error", err, method);
          return callback(err);
        }
        if (response === null) {
          self2.end(true);
          return;
        }
        if (!(response instanceof responseCtor)) {
          try {
            response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
          } catch (err2) {
            self2.emit("error", err2, method);
            return callback(err2);
          }
        }
        self2.emit("data", response, method);
        return callback(null, response);
      });
    } catch (err) {
      self2.emit("error", err, method);
      setTimeout(function() {
        callback(err);
      }, 0);
      return;
    }
  };
  Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
      if (!endedByRPC)
        this.rpcImpl(null, null, null);
      this.rpcImpl = null;
      this.emit("end").off();
    }
    return this;
  };
});

// node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS((exports) => {
  var rpc = exports;
  rpc.Service = require_service();
});

// node_modules/protobufjs/src/roots.js
var require_roots = __commonJS((exports, module) => {
  module.exports = {};
});

// node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS((exports) => {
  var configure = function() {
    protobuf.util._configure();
    protobuf.Writer._configure(protobuf.BufferWriter);
    protobuf.Reader._configure(protobuf.BufferReader);
  };
  var protobuf = exports;
  protobuf.build = "minimal";
  protobuf.Writer = require_writer();
  protobuf.BufferWriter = require_writer_buffer();
  protobuf.Reader = require_reader();
  protobuf.BufferReader = require_reader_buffer();
  protobuf.util = require_minimal();
  protobuf.rpc = require_rpc();
  protobuf.roots = require_roots();
  protobuf.configure = configure;
  configure();
});

// src/protos/yandex.ts
var exports_yandex = {};
__export(exports_yandex, {
  streamIntervalToJSON: () => {
    {
      return streamIntervalToJSON;
    }
  },
  streamIntervalFromJSON: () => {
    {
      return streamIntervalFromJSON;
    }
  },
  protobufPackage: () => {
    {
      return protobufPackage;
    }
  },
  YandexSessionResponse: () => {
    {
      return YandexSessionResponse;
    }
  },
  YandexSessionRequest: () => {
    {
      return YandexSessionRequest;
    }
  },
  VideoTranslationResponse: () => {
    {
      return VideoTranslationResponse;
    }
  },
  VideoTranslationRequest: () => {
    {
      return VideoTranslationRequest;
    }
  },
  VideoTranslationHelpObject: () => {
    {
      return VideoTranslationHelpObject;
    }
  },
  SubtitlesResponse: () => {
    {
      return SubtitlesResponse;
    }
  },
  SubtitlesRequest: () => {
    {
      return SubtitlesRequest;
    }
  },
  SubtitlesObject: () => {
    {
      return SubtitlesObject;
    }
  },
  StreamTranslationResponse: () => {
    {
      return StreamTranslationResponse;
    }
  },
  StreamTranslationRequest: () => {
    {
      return StreamTranslationRequest;
    }
  },
  StreamTranslationObject: () => {
    {
      return StreamTranslationObject;
    }
  },
  StreamPingRequest: () => {
    {
      return StreamPingRequest;
    }
  },
  StreamInterval: () => {
    {
      return StreamInterval;
    }
  }
});

// node_modules/long/index.js
var Long = function(low, high, unsigned) {
  this.low = low | 0;
  this.high = high | 0;
  this.unsigned = !!unsigned;
};
var isLong = function(obj) {
  return (obj && obj["__isLong__"]) === true;
};
var ctz32 = function(value) {
  var c = Math.clz32(value & -value);
  return value ? 31 - c : c;
};
var fromInt = function(value, unsigned) {
  var obj, cachedObj, cache;
  if (unsigned) {
    value >>>= 0;
    if (cache = 0 <= value && value < 256) {
      cachedObj = UINT_CACHE[value];
      if (cachedObj)
        return cachedObj;
    }
    obj = fromBits(value, 0, true);
    if (cache)
      UINT_CACHE[value] = obj;
    return obj;
  } else {
    value |= 0;
    if (cache = -128 <= value && value < 128) {
      cachedObj = INT_CACHE[value];
      if (cachedObj)
        return cachedObj;
    }
    obj = fromBits(value, value < 0 ? -1 : 0, false);
    if (cache)
      INT_CACHE[value] = obj;
    return obj;
  }
};
var fromNumber = function(value, unsigned) {
  if (isNaN(value))
    return unsigned ? UZERO : ZERO;
  if (unsigned) {
    if (value < 0)
      return UZERO;
    if (value >= TWO_PWR_64_DBL)
      return MAX_UNSIGNED_VALUE;
  } else {
    if (value <= -TWO_PWR_63_DBL)
      return MIN_VALUE;
    if (value + 1 >= TWO_PWR_63_DBL)
      return MAX_VALUE;
  }
  if (value < 0)
    return fromNumber(-value, unsigned).neg();
  return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
};
var fromBits = function(lowBits, highBits, unsigned) {
  return new Long(lowBits, highBits, unsigned);
};
var fromString = function(str, unsigned, radix) {
  if (str.length === 0)
    throw Error("empty string");
  if (typeof unsigned === "number") {
    radix = unsigned;
    unsigned = false;
  } else {
    unsigned = !!unsigned;
  }
  if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
    return unsigned ? UZERO : ZERO;
  radix = radix || 10;
  if (radix < 2 || 36 < radix)
    throw RangeError("radix");
  var p;
  if ((p = str.indexOf("-")) > 0)
    throw Error("interior hyphen");
  else if (p === 0) {
    return fromString(str.substring(1), unsigned, radix).neg();
  }
  var radixToPower = fromNumber(pow_dbl(radix, 8));
  var result = ZERO;
  for (var i = 0;i < str.length; i += 8) {
    var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = fromNumber(pow_dbl(radix, size));
      result = result.mul(power).add(fromNumber(value));
    } else {
      result = result.mul(radixToPower);
      result = result.add(fromNumber(value));
    }
  }
  result.unsigned = unsigned;
  return result;
};
var fromValue = function(val, unsigned) {
  if (typeof val === "number")
    return fromNumber(val, unsigned);
  if (typeof val === "string")
    return fromString(val, unsigned);
  return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
};
var wasm = null;
try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    13,
    2,
    96,
    0,
    1,
    127,
    96,
    4,
    127,
    127,
    127,
    127,
    1,
    127,
    3,
    7,
    6,
    0,
    1,
    1,
    1,
    1,
    1,
    6,
    6,
    1,
    127,
    1,
    65,
    0,
    11,
    7,
    50,
    6,
    3,
    109,
    117,
    108,
    0,
    1,
    5,
    100,
    105,
    118,
    95,
    115,
    0,
    2,
    5,
    100,
    105,
    118,
    95,
    117,
    0,
    3,
    5,
    114,
    101,
    109,
    95,
    115,
    0,
    4,
    5,
    114,
    101,
    109,
    95,
    117,
    0,
    5,
    8,
    103,
    101,
    116,
    95,
    104,
    105,
    103,
    104,
    0,
    0,
    10,
    191,
    1,
    6,
    4,
    0,
    35,
    0,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    126,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    127,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    128,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    129,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11,
    36,
    1,
    1,
    126,
    32,
    0,
    173,
    32,
    1,
    173,
    66,
    32,
    134,
    132,
    32,
    2,
    173,
    32,
    3,
    173,
    66,
    32,
    134,
    132,
    130,
    34,
    4,
    66,
    32,
    135,
    167,
    36,
    0,
    32,
    4,
    167,
    11
  ])), {}).exports;
} catch (e) {
}
Long.prototype.__isLong__;
Object.defineProperty(Long.prototype, "__isLong__", { value: true });
Long.isLong = isLong;
var INT_CACHE = {};
var UINT_CACHE = {};
Long.fromInt = fromInt;
Long.fromNumber = fromNumber;
Long.fromBits = fromBits;
var pow_dbl = Math.pow;
Long.fromString = fromString;
Long.fromValue = fromValue;
var TWO_PWR_16_DBL = 1 << 16;
var TWO_PWR_24_DBL = 1 << 24;
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
var ZERO = fromInt(0);
Long.ZERO = ZERO;
var UZERO = fromInt(0, true);
Long.UZERO = UZERO;
var ONE = fromInt(1);
Long.ONE = ONE;
var UONE = fromInt(1, true);
Long.UONE = UONE;
var NEG_ONE = fromInt(-1);
Long.NEG_ONE = NEG_ONE;
var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
Long.MAX_VALUE = MAX_VALUE;
var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
Long.MIN_VALUE = MIN_VALUE;
var LongPrototype = Long.prototype;
LongPrototype.toInt = function toInt() {
  return this.unsigned ? this.low >>> 0 : this.low;
};
LongPrototype.toNumber = function toNumber() {
  if (this.unsigned)
    return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
  return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};
LongPrototype.toString = function toString(radix) {
  radix = radix || 10;
  if (radix < 2 || 36 < radix)
    throw RangeError("radix");
  if (this.isZero())
    return "0";
  if (this.isNegative()) {
    if (this.eq(MIN_VALUE)) {
      var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
      return div.toString(radix) + rem1.toInt().toString(radix);
    } else
      return "-" + this.neg().toString(radix);
  }
  var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
  var result = "";
  while (true) {
    var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
    rem = remDiv;
    if (rem.isZero())
      return digits + result;
    else {
      while (digits.length < 6)
        digits = "0" + digits;
      result = "" + digits + result;
    }
  }
};
LongPrototype.getHighBits = function getHighBits() {
  return this.high;
};
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
  return this.high >>> 0;
};
LongPrototype.getLowBits = function getLowBits() {
  return this.low;
};
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
  return this.low >>> 0;
};
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
  if (this.isNegative())
    return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
  var val = this.high != 0 ? this.high : this.low;
  for (var bit = 31;bit > 0; bit--)
    if ((val & 1 << bit) != 0)
      break;
  return this.high != 0 ? bit + 33 : bit + 1;
};
LongPrototype.isZero = function isZero() {
  return this.high === 0 && this.low === 0;
};
LongPrototype.eqz = LongPrototype.isZero;
LongPrototype.isNegative = function isNegative() {
  return !this.unsigned && this.high < 0;
};
LongPrototype.isPositive = function isPositive() {
  return this.unsigned || this.high >= 0;
};
LongPrototype.isOdd = function isOdd() {
  return (this.low & 1) === 1;
};
LongPrototype.isEven = function isEven() {
  return (this.low & 1) === 0;
};
LongPrototype.equals = function equals(other) {
  if (!isLong(other))
    other = fromValue(other);
  if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
    return false;
  return this.high === other.high && this.low === other.low;
};
LongPrototype.eq = LongPrototype.equals;
LongPrototype.notEquals = function notEquals(other) {
  return !this.eq(other);
};
LongPrototype.neq = LongPrototype.notEquals;
LongPrototype.ne = LongPrototype.notEquals;
LongPrototype.lessThan = function lessThan(other) {
  return this.comp(other) < 0;
};
LongPrototype.lt = LongPrototype.lessThan;
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
  return this.comp(other) <= 0;
};
LongPrototype.lte = LongPrototype.lessThanOrEqual;
LongPrototype.le = LongPrototype.lessThanOrEqual;
LongPrototype.greaterThan = function greaterThan(other) {
  return this.comp(other) > 0;
};
LongPrototype.gt = LongPrototype.greaterThan;
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
  return this.comp(other) >= 0;
};
LongPrototype.gte = LongPrototype.greaterThanOrEqual;
LongPrototype.ge = LongPrototype.greaterThanOrEqual;
LongPrototype.compare = function compare(other) {
  if (!isLong(other))
    other = fromValue(other);
  if (this.eq(other))
    return 0;
  var thisNeg = this.isNegative(), otherNeg = other.isNegative();
  if (thisNeg && !otherNeg)
    return -1;
  if (!thisNeg && otherNeg)
    return 1;
  if (!this.unsigned)
    return this.sub(other).isNegative() ? -1 : 1;
  return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
};
LongPrototype.comp = LongPrototype.compare;
LongPrototype.negate = function negate() {
  if (!this.unsigned && this.eq(MIN_VALUE))
    return MIN_VALUE;
  return this.not().add(ONE);
};
LongPrototype.neg = LongPrototype.negate;
LongPrototype.add = function add(addend) {
  if (!isLong(addend))
    addend = fromValue(addend);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = addend.high >>> 16;
  var b32 = addend.high & 65535;
  var b16 = addend.low >>> 16;
  var b00 = addend.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 + b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.subtract = function subtract(subtrahend) {
  if (!isLong(subtrahend))
    subtrahend = fromValue(subtrahend);
  return this.add(subtrahend.neg());
};
LongPrototype.sub = LongPrototype.subtract;
LongPrototype.multiply = function multiply(multiplier) {
  if (this.isZero())
    return this;
  if (!isLong(multiplier))
    multiplier = fromValue(multiplier);
  if (wasm) {
    var low = wasm["mul"](this.low, this.high, multiplier.low, multiplier.high);
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (multiplier.isZero())
    return this.unsigned ? UZERO : ZERO;
  if (this.eq(MIN_VALUE))
    return multiplier.isOdd() ? MIN_VALUE : ZERO;
  if (multiplier.eq(MIN_VALUE))
    return this.isOdd() ? MIN_VALUE : ZERO;
  if (this.isNegative()) {
    if (multiplier.isNegative())
      return this.neg().mul(multiplier.neg());
    else
      return this.neg().mul(multiplier).neg();
  } else if (multiplier.isNegative())
    return this.mul(multiplier.neg()).neg();
  if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
    return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
  var a48 = this.high >>> 16;
  var a32 = this.high & 65535;
  var a16 = this.low >>> 16;
  var a00 = this.low & 65535;
  var b48 = multiplier.high >>> 16;
  var b32 = multiplier.high & 65535;
  var b16 = multiplier.low >>> 16;
  var b00 = multiplier.low & 65535;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 65535;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 65535;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 65535;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 65535;
  return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
};
LongPrototype.mul = LongPrototype.multiply;
LongPrototype.divide = function divide(divisor) {
  if (!isLong(divisor))
    divisor = fromValue(divisor);
  if (divisor.isZero())
    throw Error("division by zero");
  if (wasm) {
    if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
      return this;
    }
    var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high);
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  if (this.isZero())
    return this.unsigned ? UZERO : ZERO;
  var approx, rem, res;
  if (!this.unsigned) {
    if (this.eq(MIN_VALUE)) {
      if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
        return MIN_VALUE;
      else if (divisor.eq(MIN_VALUE))
        return ONE;
      else {
        var halfThis = this.shr(1);
        approx = halfThis.div(divisor).shl(1);
        if (approx.eq(ZERO)) {
          return divisor.isNegative() ? ONE : NEG_ONE;
        } else {
          rem = this.sub(divisor.mul(approx));
          res = approx.add(rem.div(divisor));
          return res;
        }
      }
    } else if (divisor.eq(MIN_VALUE))
      return this.unsigned ? UZERO : ZERO;
    if (this.isNegative()) {
      if (divisor.isNegative())
        return this.neg().div(divisor.neg());
      return this.neg().div(divisor).neg();
    } else if (divisor.isNegative())
      return this.div(divisor.neg()).neg();
    res = ZERO;
  } else {
    if (!divisor.unsigned)
      divisor = divisor.toUnsigned();
    if (divisor.gt(this))
      return UZERO;
    if (divisor.gt(this.shru(1)))
      return UONE;
    res = UZERO;
  }
  rem = this;
  while (rem.gte(divisor)) {
    approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
    var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
    while (approxRem.isNegative() || approxRem.gt(rem)) {
      approx -= delta;
      approxRes = fromNumber(approx, this.unsigned);
      approxRem = approxRes.mul(divisor);
    }
    if (approxRes.isZero())
      approxRes = ONE;
    res = res.add(approxRes);
    rem = rem.sub(approxRem);
  }
  return res;
};
LongPrototype.div = LongPrototype.divide;
LongPrototype.modulo = function modulo(divisor) {
  if (!isLong(divisor))
    divisor = fromValue(divisor);
  if (wasm) {
    var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high);
    return fromBits(low, wasm["get_high"](), this.unsigned);
  }
  return this.sub(this.div(divisor).mul(divisor));
};
LongPrototype.mod = LongPrototype.modulo;
LongPrototype.rem = LongPrototype.modulo;
LongPrototype.not = function not() {
  return fromBits(~this.low, ~this.high, this.unsigned);
};
LongPrototype.countLeadingZeros = function countLeadingZeros() {
  return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
};
LongPrototype.clz = LongPrototype.countLeadingZeros;
LongPrototype.countTrailingZeros = function countTrailingZeros() {
  return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
};
LongPrototype.ctz = LongPrototype.countTrailingZeros;
LongPrototype.and = function and(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};
LongPrototype.or = function or(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};
LongPrototype.xor = function xor(other) {
  if (!isLong(other))
    other = fromValue(other);
  return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};
LongPrototype.shiftLeft = function shiftLeft(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  else if (numBits < 32)
    return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
  else
    return fromBits(0, this.low << numBits - 32, this.unsigned);
};
LongPrototype.shl = LongPrototype.shiftLeft;
LongPrototype.shiftRight = function shiftRight(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  else if (numBits < 32)
    return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
  else
    return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
};
LongPrototype.shr = LongPrototype.shiftRight;
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits < 32)
    return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
  if (numBits === 32)
    return fromBits(this.high, 0, this.unsigned);
  return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
};
LongPrototype.shru = LongPrototype.shiftRightUnsigned;
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
LongPrototype.rotateLeft = function rotateLeft(numBits) {
  var b;
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits === 32)
    return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
};
LongPrototype.rotl = LongPrototype.rotateLeft;
LongPrototype.rotateRight = function rotateRight(numBits) {
  var b;
  if (isLong(numBits))
    numBits = numBits.toInt();
  if ((numBits &= 63) === 0)
    return this;
  if (numBits === 32)
    return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
  }
  numBits -= 32;
  b = 32 - numBits;
  return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
};
LongPrototype.rotr = LongPrototype.rotateRight;
LongPrototype.toSigned = function toSigned() {
  if (!this.unsigned)
    return this;
  return fromBits(this.low, this.high, false);
};
LongPrototype.toUnsigned = function toUnsigned() {
  if (this.unsigned)
    return this;
  return fromBits(this.low, this.high, true);
};
LongPrototype.toBytes = function toBytes(le) {
  return le ? this.toBytesLE() : this.toBytesBE();
};
LongPrototype.toBytesLE = function toBytesLE() {
  var hi = this.high, lo = this.low;
  return [
    lo & 255,
    lo >>> 8 & 255,
    lo >>> 16 & 255,
    lo >>> 24,
    hi & 255,
    hi >>> 8 & 255,
    hi >>> 16 & 255,
    hi >>> 24
  ];
};
LongPrototype.toBytesBE = function toBytesBE() {
  var hi = this.high, lo = this.low;
  return [
    hi >>> 24,
    hi >>> 16 & 255,
    hi >>> 8 & 255,
    hi & 255,
    lo >>> 24,
    lo >>> 16 & 255,
    lo >>> 8 & 255,
    lo & 255
  ];
};
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
  return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
  return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
};
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
  return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
};
var long_default = Long;

// src/protos/yandex.ts
var minimal = __toESM(require_index_minimal(), 1);
function streamIntervalFromJSON(object) {
  switch (object) {
    case 0:
    case "NO_CONNECTION":
      return StreamInterval.NO_CONNECTION;
    case 10:
    case "TRANSLATING":
      return StreamInterval.TRANSLATING;
    case 20:
    case "STREAMING":
      return StreamInterval.STREAMING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return StreamInterval.UNRECOGNIZED;
  }
}
function streamIntervalToJSON(object) {
  switch (object) {
    case StreamInterval.NO_CONNECTION:
      return "NO_CONNECTION";
    case StreamInterval.TRANSLATING:
      return "TRANSLATING";
    case StreamInterval.STREAMING:
      return "STREAMING";
    case StreamInterval.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
var createBaseVideoTranslationHelpObject = function() {
  return { target: "", targetUrl: "" };
};
var createBaseVideoTranslationRequest = function() {
  return {
    url: "",
    deviceId: undefined,
    firstRequest: false,
    duration: 0,
    unknown0: 0,
    language: "",
    forceSourceLang: false,
    unknown1: 0,
    translationHelp: [],
    responseLanguage: "",
    unknown2: 0,
    unknown3: 0,
    bypassCache: false
  };
};
var createBaseVideoTranslationResponse = function() {
  return {
    url: undefined,
    duration: undefined,
    status: 0,
    remainingTime: undefined,
    unknown0: undefined,
    translationId: "",
    language: undefined,
    message: undefined
  };
};
var createBaseSubtitlesObject = function() {
  return { language: "", url: "", unknown0: 0, translatedLanguages: "", translatedUrl: "", unknown1: 0, unknown2: 0 };
};
var createBaseSubtitlesRequest = function() {
  return { url: "", language: "" };
};
var createBaseSubtitlesResponse = function() {
  return { waiting: false, subtitles: [] };
};
var createBaseStreamTranslationObject = function() {
  return { url: "", timestamp: 0 };
};
var createBaseStreamTranslationRequest = function() {
  return { url: "", language: "", responseLanguage: "" };
};
var createBaseStreamTranslationResponse = function() {
  return { interval: 0, translatedInfo: undefined, pingId: undefined };
};
var createBaseStreamPingRequest = function() {
  return { pingId: 0 };
};
var createBaseYandexSessionRequest = function() {
  return { uuid: "", module: "" };
};
var createBaseYandexSessionResponse = function() {
  return { sign: "", expires: 0 };
};
var longToNumber = function(long) {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
};
var isSet = function(value) {
  return value !== null && value !== undefined;
};
var protobufPackage = "";
var StreamInterval;
(function(StreamInterval2) {
  StreamInterval2[StreamInterval2["NO_CONNECTION"] = 0] = "NO_CONNECTION";
  StreamInterval2[StreamInterval2["TRANSLATING"] = 10] = "TRANSLATING";
  StreamInterval2[StreamInterval2["STREAMING"] = 20] = "STREAMING";
  StreamInterval2[StreamInterval2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(StreamInterval || (StreamInterval = {}));
var VideoTranslationHelpObject = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.targetUrl !== "") {
      writer.uint32(18).string(message.targetUrl);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoTranslationHelpObject();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.targetUrl = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      target: isSet(object.target) ? globalThis.String(object.target) : "",
      targetUrl: isSet(object.targetUrl) ? globalThis.String(object.targetUrl) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.targetUrl !== "") {
      obj.targetUrl = message.targetUrl;
    }
    return obj;
  },
  create(base) {
    return VideoTranslationHelpObject.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseVideoTranslationHelpObject();
    message.target = object.target ?? "";
    message.targetUrl = object.targetUrl ?? "";
    return message;
  }
};
var VideoTranslationRequest = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.url !== "") {
      writer.uint32(26).string(message.url);
    }
    if (message.deviceId !== undefined) {
      writer.uint32(34).string(message.deviceId);
    }
    if (message.firstRequest !== false) {
      writer.uint32(40).bool(message.firstRequest);
    }
    if (message.duration !== 0) {
      writer.uint32(49).double(message.duration);
    }
    if (message.unknown0 !== 0) {
      writer.uint32(56).int32(message.unknown0);
    }
    if (message.language !== "") {
      writer.uint32(66).string(message.language);
    }
    if (message.forceSourceLang !== false) {
      writer.uint32(72).bool(message.forceSourceLang);
    }
    if (message.unknown1 !== 0) {
      writer.uint32(80).int32(message.unknown1);
    }
    for (const v of message.translationHelp) {
      VideoTranslationHelpObject.encode(v, writer.uint32(90).fork()).ldelim();
    }
    if (message.responseLanguage !== "") {
      writer.uint32(114).string(message.responseLanguage);
    }
    if (message.unknown2 !== 0) {
      writer.uint32(120).int32(message.unknown2);
    }
    if (message.unknown3 !== 0) {
      writer.uint32(128).int32(message.unknown3);
    }
    if (message.bypassCache !== false) {
      writer.uint32(136).bool(message.bypassCache);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoTranslationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          if (tag !== 26) {
            break;
          }
          message.url = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.deviceId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.firstRequest = reader.bool();
          continue;
        case 6:
          if (tag !== 49) {
            break;
          }
          message.duration = reader.double();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.unknown0 = reader.int32();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }
          message.language = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }
          message.forceSourceLang = reader.bool();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }
          message.unknown1 = reader.int32();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }
          message.translationHelp.push(VideoTranslationHelpObject.decode(reader, reader.uint32()));
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }
          message.responseLanguage = reader.string();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }
          message.unknown2 = reader.int32();
          continue;
        case 16:
          if (tag !== 128) {
            break;
          }
          message.unknown3 = reader.int32();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }
          message.bypassCache = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      deviceId: isSet(object.deviceId) ? globalThis.String(object.deviceId) : undefined,
      firstRequest: isSet(object.firstRequest) ? globalThis.Boolean(object.firstRequest) : false,
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : 0,
      language: isSet(object.language) ? globalThis.String(object.language) : "",
      forceSourceLang: isSet(object.forceSourceLang) ? globalThis.Boolean(object.forceSourceLang) : false,
      unknown1: isSet(object.unknown1) ? globalThis.Number(object.unknown1) : 0,
      translationHelp: globalThis.Array.isArray(object?.translationHelp) ? object.translationHelp.map((e) => VideoTranslationHelpObject.fromJSON(e)) : [],
      responseLanguage: isSet(object.responseLanguage) ? globalThis.String(object.responseLanguage) : "",
      unknown2: isSet(object.unknown2) ? globalThis.Number(object.unknown2) : 0,
      unknown3: isSet(object.unknown3) ? globalThis.Number(object.unknown3) : 0,
      bypassCache: isSet(object.bypassCache) ? globalThis.Boolean(object.bypassCache) : false
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.deviceId !== undefined) {
      obj.deviceId = message.deviceId;
    }
    if (message.firstRequest !== false) {
      obj.firstRequest = message.firstRequest;
    }
    if (message.duration !== 0) {
      obj.duration = message.duration;
    }
    if (message.unknown0 !== 0) {
      obj.unknown0 = Math.round(message.unknown0);
    }
    if (message.language !== "") {
      obj.language = message.language;
    }
    if (message.forceSourceLang !== false) {
      obj.forceSourceLang = message.forceSourceLang;
    }
    if (message.unknown1 !== 0) {
      obj.unknown1 = Math.round(message.unknown1);
    }
    if (message.translationHelp?.length) {
      obj.translationHelp = message.translationHelp.map((e) => VideoTranslationHelpObject.toJSON(e));
    }
    if (message.responseLanguage !== "") {
      obj.responseLanguage = message.responseLanguage;
    }
    if (message.unknown2 !== 0) {
      obj.unknown2 = Math.round(message.unknown2);
    }
    if (message.unknown3 !== 0) {
      obj.unknown3 = Math.round(message.unknown3);
    }
    if (message.bypassCache !== false) {
      obj.bypassCache = message.bypassCache;
    }
    return obj;
  },
  create(base) {
    return VideoTranslationRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseVideoTranslationRequest();
    message.url = object.url ?? "";
    message.deviceId = object.deviceId ?? undefined;
    message.firstRequest = object.firstRequest ?? false;
    message.duration = object.duration ?? 0;
    message.unknown0 = object.unknown0 ?? 0;
    message.language = object.language ?? "";
    message.forceSourceLang = object.forceSourceLang ?? false;
    message.unknown1 = object.unknown1 ?? 0;
    message.translationHelp = object.translationHelp?.map((e) => VideoTranslationHelpObject.fromPartial(e)) || [];
    message.responseLanguage = object.responseLanguage ?? "";
    message.unknown2 = object.unknown2 ?? 0;
    message.unknown3 = object.unknown3 ?? 0;
    message.bypassCache = object.bypassCache ?? false;
    return message;
  }
};
var VideoTranslationResponse = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.url !== undefined) {
      writer.uint32(10).string(message.url);
    }
    if (message.duration !== undefined) {
      writer.uint32(17).double(message.duration);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.remainingTime !== undefined) {
      writer.uint32(40).int32(message.remainingTime);
    }
    if (message.unknown0 !== undefined) {
      writer.uint32(48).int32(message.unknown0);
    }
    if (message.translationId !== "") {
      writer.uint32(58).string(message.translationId);
    }
    if (message.language !== undefined) {
      writer.uint32(66).string(message.language);
    }
    if (message.message !== undefined) {
      writer.uint32(74).string(message.message);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVideoTranslationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 17) {
            break;
          }
          message.duration = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }
          message.status = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.remainingTime = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.unknown0 = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }
          message.translationId = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }
          message.language = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }
          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : undefined,
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : undefined,
      status: isSet(object.status) ? globalThis.Number(object.status) : 0,
      remainingTime: isSet(object.remainingTime) ? globalThis.Number(object.remainingTime) : undefined,
      unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : undefined,
      translationId: isSet(object.translationId) ? globalThis.String(object.translationId) : "",
      language: isSet(object.language) ? globalThis.String(object.language) : undefined,
      message: isSet(object.message) ? globalThis.String(object.message) : undefined
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.url !== undefined) {
      obj.url = message.url;
    }
    if (message.duration !== undefined) {
      obj.duration = message.duration;
    }
    if (message.status !== 0) {
      obj.status = Math.round(message.status);
    }
    if (message.remainingTime !== undefined) {
      obj.remainingTime = Math.round(message.remainingTime);
    }
    if (message.unknown0 !== undefined) {
      obj.unknown0 = Math.round(message.unknown0);
    }
    if (message.translationId !== "") {
      obj.translationId = message.translationId;
    }
    if (message.language !== undefined) {
      obj.language = message.language;
    }
    if (message.message !== undefined) {
      obj.message = message.message;
    }
    return obj;
  },
  create(base) {
    return VideoTranslationResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseVideoTranslationResponse();
    message.url = object.url ?? undefined;
    message.duration = object.duration ?? undefined;
    message.status = object.status ?? 0;
    message.remainingTime = object.remainingTime ?? undefined;
    message.unknown0 = object.unknown0 ?? undefined;
    message.translationId = object.translationId ?? "";
    message.language = object.language ?? undefined;
    message.message = object.message ?? undefined;
    return message;
  }
};
var SubtitlesObject = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.language !== "") {
      writer.uint32(10).string(message.language);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    if (message.unknown0 !== 0) {
      writer.uint32(24).int32(message.unknown0);
    }
    if (message.translatedLanguages !== "") {
      writer.uint32(34).string(message.translatedLanguages);
    }
    if (message.translatedUrl !== "") {
      writer.uint32(42).string(message.translatedUrl);
    }
    if (message.unknown1 !== 0) {
      writer.uint32(48).int32(message.unknown1);
    }
    if (message.unknown2 !== 0) {
      writer.uint32(56).int32(message.unknown2);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubtitlesObject();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.language = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.url = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.unknown0 = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }
          message.translatedLanguages = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }
          message.translatedUrl = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }
          message.unknown1 = reader.int32();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }
          message.unknown2 = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      language: isSet(object.language) ? globalThis.String(object.language) : "",
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      unknown0: isSet(object.unknown0) ? globalThis.Number(object.unknown0) : 0,
      translatedLanguages: isSet(object.translatedLanguages) ? globalThis.String(object.translatedLanguages) : "",
      translatedUrl: isSet(object.translatedUrl) ? globalThis.String(object.translatedUrl) : "",
      unknown1: isSet(object.unknown1) ? globalThis.Number(object.unknown1) : 0,
      unknown2: isSet(object.unknown2) ? globalThis.Number(object.unknown2) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.language !== "") {
      obj.language = message.language;
    }
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.unknown0 !== 0) {
      obj.unknown0 = Math.round(message.unknown0);
    }
    if (message.translatedLanguages !== "") {
      obj.translatedLanguages = message.translatedLanguages;
    }
    if (message.translatedUrl !== "") {
      obj.translatedUrl = message.translatedUrl;
    }
    if (message.unknown1 !== 0) {
      obj.unknown1 = Math.round(message.unknown1);
    }
    if (message.unknown2 !== 0) {
      obj.unknown2 = Math.round(message.unknown2);
    }
    return obj;
  },
  create(base) {
    return SubtitlesObject.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSubtitlesObject();
    message.language = object.language ?? "";
    message.url = object.url ?? "";
    message.unknown0 = object.unknown0 ?? 0;
    message.translatedLanguages = object.translatedLanguages ?? "";
    message.translatedUrl = object.translatedUrl ?? "";
    message.unknown1 = object.unknown1 ?? 0;
    message.unknown2 = object.unknown2 ?? 0;
    return message;
  }
};
var SubtitlesRequest = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.language !== "") {
      writer.uint32(18).string(message.language);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubtitlesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.language = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      language: isSet(object.language) ? globalThis.String(object.language) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.language !== "") {
      obj.language = message.language;
    }
    return obj;
  },
  create(base) {
    return SubtitlesRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSubtitlesRequest();
    message.url = object.url ?? "";
    message.language = object.language ?? "";
    return message;
  }
};
var SubtitlesResponse = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.waiting !== false) {
      writer.uint32(8).bool(message.waiting);
    }
    for (const v of message.subtitles) {
      SubtitlesObject.encode(v, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubtitlesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.waiting = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.subtitles.push(SubtitlesObject.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      waiting: isSet(object.waiting) ? globalThis.Boolean(object.waiting) : false,
      subtitles: globalThis.Array.isArray(object?.subtitles) ? object.subtitles.map((e) => SubtitlesObject.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.waiting !== false) {
      obj.waiting = message.waiting;
    }
    if (message.subtitles?.length) {
      obj.subtitles = message.subtitles.map((e) => SubtitlesObject.toJSON(e));
    }
    return obj;
  },
  create(base) {
    return SubtitlesResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSubtitlesResponse();
    message.waiting = object.waiting ?? false;
    message.subtitles = object.subtitles?.map((e) => SubtitlesObject.fromPartial(e)) || [];
    return message;
  }
};
var StreamTranslationObject = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.timestamp !== 0) {
      writer.uint32(16).int64(message.timestamp);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamTranslationObject();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.timestamp = longToNumber(reader.int64());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    return obj;
  },
  create(base) {
    return StreamTranslationObject.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseStreamTranslationObject();
    message.url = object.url ?? "";
    message.timestamp = object.timestamp ?? 0;
    return message;
  }
};
var StreamTranslationRequest = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.language !== "") {
      writer.uint32(18).string(message.language);
    }
    if (message.responseLanguage !== "") {
      writer.uint32(26).string(message.responseLanguage);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamTranslationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.language = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }
          message.responseLanguage = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      language: isSet(object.language) ? globalThis.String(object.language) : "",
      responseLanguage: isSet(object.responseLanguage) ? globalThis.String(object.responseLanguage) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.language !== "") {
      obj.language = message.language;
    }
    if (message.responseLanguage !== "") {
      obj.responseLanguage = message.responseLanguage;
    }
    return obj;
  },
  create(base) {
    return StreamTranslationRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseStreamTranslationRequest();
    message.url = object.url ?? "";
    message.language = object.language ?? "";
    message.responseLanguage = object.responseLanguage ?? "";
    return message;
  }
};
var StreamTranslationResponse = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.interval !== 0) {
      writer.uint32(8).int32(message.interval);
    }
    if (message.translatedInfo !== undefined) {
      StreamTranslationObject.encode(message.translatedInfo, writer.uint32(18).fork()).ldelim();
    }
    if (message.pingId !== undefined) {
      writer.uint32(24).int32(message.pingId);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamTranslationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.interval = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.translatedInfo = StreamTranslationObject.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }
          message.pingId = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      interval: isSet(object.interval) ? streamIntervalFromJSON(object.interval) : 0,
      translatedInfo: isSet(object.translatedInfo) ? StreamTranslationObject.fromJSON(object.translatedInfo) : undefined,
      pingId: isSet(object.pingId) ? globalThis.Number(object.pingId) : undefined
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.interval !== 0) {
      obj.interval = streamIntervalToJSON(message.interval);
    }
    if (message.translatedInfo !== undefined) {
      obj.translatedInfo = StreamTranslationObject.toJSON(message.translatedInfo);
    }
    if (message.pingId !== undefined) {
      obj.pingId = Math.round(message.pingId);
    }
    return obj;
  },
  create(base) {
    return StreamTranslationResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseStreamTranslationResponse();
    message.interval = object.interval ?? 0;
    message.translatedInfo = object.translatedInfo !== undefined && object.translatedInfo !== null ? StreamTranslationObject.fromPartial(object.translatedInfo) : undefined;
    message.pingId = object.pingId ?? undefined;
    return message;
  }
};
var StreamPingRequest = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.pingId !== 0) {
      writer.uint32(8).int32(message.pingId);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamPingRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }
          message.pingId = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { pingId: isSet(object.pingId) ? globalThis.Number(object.pingId) : 0 };
  },
  toJSON(message) {
    const obj = {};
    if (message.pingId !== 0) {
      obj.pingId = Math.round(message.pingId);
    }
    return obj;
  },
  create(base) {
    return StreamPingRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseStreamPingRequest();
    message.pingId = object.pingId ?? 0;
    return message;
  }
};
var YandexSessionRequest = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.uuid !== "") {
      writer.uint32(10).string(message.uuid);
    }
    if (message.module !== "") {
      writer.uint32(18).string(message.module);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseYandexSessionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.uuid = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }
          message.module = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      uuid: isSet(object.uuid) ? globalThis.String(object.uuid) : "",
      module: isSet(object.module) ? globalThis.String(object.module) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.uuid !== "") {
      obj.uuid = message.uuid;
    }
    if (message.module !== "") {
      obj.module = message.module;
    }
    return obj;
  },
  create(base) {
    return YandexSessionRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseYandexSessionRequest();
    message.uuid = object.uuid ?? "";
    message.module = object.module ?? "";
    return message;
  }
};
var YandexSessionResponse = {
  encode(message, writer = minimal.default.Writer.create()) {
    if (message.sign !== "") {
      writer.uint32(10).string(message.sign);
    }
    if (message.expires !== 0) {
      writer.uint32(16).int32(message.expires);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof minimal.default.Reader ? input : minimal.default.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseYandexSessionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.sign = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }
          message.expires = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      sign: isSet(object.sign) ? globalThis.String(object.sign) : "",
      expires: isSet(object.expires) ? globalThis.Number(object.expires) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.sign !== "") {
      obj.sign = message.sign;
    }
    if (message.expires !== 0) {
      obj.expires = Math.round(message.expires);
    }
    return obj;
  },
  create(base) {
    return YandexSessionResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseYandexSessionResponse();
    message.sign = object.sign ?? "";
    message.expires = object.expires ?? 0;
    return message;
  }
};
if (minimal.default.util.Long !== long_default) {
  minimal.default.util.Long = long_default;
  minimal.default.configure();
}

// src/protobuf.ts
var yandexProtobuf = {
  encodeTranslationRequest(url, duration, requestLang, responseLang, translationHelp) {
    return VideoTranslationRequest.encode({
      url,
      firstRequest: true,
      duration,
      unknown0: 1,
      language: requestLang,
      forceSourceLang: false,
      unknown1: 0,
      translationHelp: translationHelp ? translationHelp : [],
      responseLanguage: responseLang,
      unknown2: 0,
      unknown3: 1,
      bypassCache: true
    }).finish();
  },
  decodeTranslationResponse(response) {
    return VideoTranslationResponse.decode(new Uint8Array(response));
  },
  encodeSubtitlesRequest(url, requestLang) {
    return SubtitlesRequest.encode({
      url,
      language: requestLang
    }).finish();
  },
  decodeSubtitlesResponse(response) {
    return SubtitlesResponse.decode(new Uint8Array(response));
  },
  encodeStreamPingRequest(pingId) {
    return StreamPingRequest.encode({
      pingId
    }).finish();
  },
  encodeStreamRequest(url, requestLang, responseLang) {
    return StreamTranslationRequest.encode({
      url,
      language: requestLang,
      responseLanguage: responseLang
    }).finish();
  },
  decodeStreamResponse(response) {
    return StreamTranslationResponse.decode(new Uint8Array(response));
  },
  encodeYandexSessionRequest(uuid, module) {
    return YandexSessionRequest.encode({
      uuid,
      module
    }).finish();
  },
  decodeYandexSessionResponse(response) {
    return YandexSessionResponse.decode(new Uint8Array(response));
  }
};
// src/config/config.ts
var config_default = {
  host: "api.browser.yandex.ru",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 YaBrowser/24.4.0.0 Safari/537.36",
  hmac: "bt8xH3VOlb4mqf0nqAibnDOoiPlXsisf",
  defaultDuration: 343
};

// src/secure.ts
import crypto from "node:crypto";
async function getSignature(body) {
  const utf8Encoder = new TextEncoder;
  const key = await crypto.subtle.importKey("raw", utf8Encoder.encode(config_default.hmac), { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign", "verify"]);
  const signature = await crypto.subtle.sign("HMAC", key, body);
  return new Uint8Array(signature).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
function getUUID(isLower) {
  const randomBytes = crypto.getRandomValues(new Uint8Array(31));
  let byteIndex = 0;
  const uuid = ([1e7] + 1000 + 4000 + 8000 + 100000000000).replace(/[018]/g, (match) => (match ^ randomBytes[byteIndex++] & 15 >> match / 4).toString(16));
  return isLower ? uuid : uuid.toUpperCase();
}
async function getHmacSha1(hmacKey, salt) {
  try {
    const utf8Encoder = new TextEncoder;
    let hmacSalt = utf8Encoder.encode(salt);
    const key = await crypto.subtle.importKey("raw", utf8Encoder.encode(hmacKey), { name: "HMAC", hash: { name: "SHA-1" } }, false, ["sign", "verify"]);
    const signature = await crypto.subtle.sign("HMAC", key, hmacSalt);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } catch (err) {
    console.error(err);
    return false;
  }
}

// src/types/yandex.ts
var exports_yandex2 = {};
__export(exports_yandex2, {
  VideoTranslationStatus: () => {
    {
      return VideoTranslationStatus;
    }
  },
  VideoService: () => {
    {
      return VideoService;
    }
  }
});
var VideoService;
(function(VideoService2) {
  VideoService2["custom"] = "custom";
  VideoService2[VideoService2["directlink"] = VideoService2.custom] = "directlink";
  VideoService2["youtube"] = "youtube";
  VideoService2["piped"] = "piped";
  VideoService2["invidious"] = "invidious";
  VideoService2["vk"] = "vk";
  VideoService2["nine_gag"] = "nine_gag";
  VideoService2[VideoService2["gag"] = VideoService2.nine_gag] = "gag";
  VideoService2["twitch"] = "twitch";
  VideoService2["proxitok"] = "proxitok";
  VideoService2["tiktok"] = "tiktok";
  VideoService2["vimeo"] = "vimeo";
  VideoService2["xvideos"] = "xvideos";
  VideoService2["pornhub"] = "pornhub";
  VideoService2["twitter"] = "twitter";
  VideoService2["rumble"] = "rumble";
  VideoService2["facebook"] = "facebook";
  VideoService2["rutube"] = "rutube";
  VideoService2["coub"] = "coub";
  VideoService2["bilibili"] = "bilibili";
  VideoService2["mail_ru"] = "mailru";
  VideoService2[VideoService2["mailru"] = VideoService2.mail_ru] = "mailru";
  VideoService2["bitchute"] = "bitchute";
  VideoService2["eporner"] = "eporner";
  VideoService2["peertube"] = "peertube";
  VideoService2["dailymotion"] = "dailymotion";
  VideoService2["trovo"] = "trovo";
  VideoService2["yandexdisk"] = "yandexdisk";
  VideoService2["ok_ru"] = "okru";
  VideoService2[VideoService2["okru"] = VideoService2.ok_ru] = "okru";
  VideoService2["googledrive"] = "googledrive";
  VideoService2["bannedvideo"] = "bannedvideo";
  VideoService2["weverse"] = "weverse";
  VideoService2["newgrounds"] = "newgrounds";
  VideoService2["egghead"] = "egghead";
  VideoService2["youku"] = "youku";
})(VideoService || (VideoService = {}));
var VideoTranslationStatus;
(function(VideoTranslationStatus2) {
  VideoTranslationStatus2[VideoTranslationStatus2["FAILED"] = 0] = "FAILED";
  VideoTranslationStatus2[VideoTranslationStatus2["FINISHED"] = 1] = "FINISHED";
  VideoTranslationStatus2[VideoTranslationStatus2["WAITING"] = 2] = "WAITING";
  VideoTranslationStatus2[VideoTranslationStatus2["LONG_WAITING"] = 3] = "LONG_WAITING";
  VideoTranslationStatus2[VideoTranslationStatus2["PART_CONTENT"] = 5] = "PART_CONTENT";
  VideoTranslationStatus2[VideoTranslationStatus2["LONG_WAITING_2"] = 6] = "LONG_WAITING_2";
})(VideoTranslationStatus || (VideoTranslationStatus = {}));

// src/config/alternativeUrls.ts
var sitesInvidious = [
  "invidious.snopyta.org",
  "yewtu.be",
  "invidious.kavin.rocks",
  "vid.puffyan.us",
  "invidious.namazso.eu",
  "inv.riverside.rocks",
  "yt.artemislena.eu",
  "invidious.flokinet.to",
  "invidious.esmailelbob.xyz",
  "y.com.sb",
  "invidious.nerdvpn.de",
  "inv.vern.cc",
  "invidious.slipfox.xyz",
  "invidio.xamh.de",
  "invidious.dhusch.de"
];
var sitesPiped = [
  "piped.video",
  "piped.tokhmi.xyz",
  "piped.moomoo.me",
  "piped.syncpundit.io",
  "piped.mha.fi",
  "watch.whatever.social",
  "piped.garudalinux.org",
  "efy.piped.pages.dev",
  "watch.leptons.xyz",
  "piped.lunar.icu",
  "yt.dc09.ru",
  "piped.mint.lgbt",
  "il.ax",
  "piped.privacy.com.de",
  "piped.esmailelbob.xyz",
  "piped.projectsegfau.lt",
  "piped.in.projectsegfau.lt",
  "piped.us.projectsegfau.lt",
  "piped.privacydev.net",
  "piped.palveluntarjoaja.eu",
  "piped.smnz.de",
  "piped.adminforge.de",
  "piped.qdi.fi",
  "piped.hostux.net",
  "piped.chauvet.pro",
  "piped.jotoma.de",
  "piped.pfcd.me",
  "piped.frontendfriendly.xyz"
];
var sitesProxiTok = [
  "proxitok.pabloferreiro.es",
  "proxitok.pussthecat.org",
  "tok.habedieeh.re",
  "proxitok.esmailelbob.xyz",
  "proxitok.privacydev.net",
  "tok.artemislena.eu",
  "tok.adminforge.de",
  "tik.hostux.net",
  "tt.vern.cc",
  "cringe.whatever.social",
  "proxitok.lunar.icu",
  "proxitok.privacy.com.de"
];
var sitesPeertube = [
  "peertube.1312.media",
  "tube.shanti.cafe",
  "bee-tube.fr",
  "video.sadmin.io",
  "dalek.zone",
  "review.peertube.biz",
  "peervideo.club",
  "tube.la-dina.net",
  "peertube.tmp.rcp.tf",
  "peertube.su"
];

// src/config/sites.ts
var sites_default = [
  {
    host: VideoService.youtube,
    url: "https://youtu.be/",
    match: /^((www.|m.)?youtube(-nocookie|kids)?.com)|(youtu.be)$/
  },
  {
    host: VideoService.invidious,
    url: "https://youtu.be/",
    match: sitesInvidious
  },
  {
    host: VideoService.piped,
    url: "https://youtu.be/",
    match: sitesPiped
  },
  {
    host: VideoService.vk,
    url: "https://vk.com/video?z=",
    match: /^(www.|m.)?vk.(com|ru)$/
  },
  {
    host: VideoService.nine_gag,
    url: "https://9gag.com/gag/",
    match: /^9gag.com$/
  },
  {
    host: VideoService.twitch,
    url: "https://twitch.tv/",
    match: [
      /^m.twitch.tv$/,
      /^(www.)?twitch.tv$/,
      /^clips.twitch.tv$/,
      /^player.twitch.tv$/
    ]
  },
  {
    host: VideoService.proxitok,
    url: "https://www.tiktok.com/",
    match: sitesProxiTok
  },
  {
    host: VideoService.tiktok,
    url: "https://www.tiktok.com/",
    match: /^(www.)?tiktok.com$/
  },
  {
    host: VideoService.vimeo,
    url: "https://vimeo.com/",
    match: /^vimeo.com$/
  },
  {
    host: VideoService.vimeo,
    url: "https://player.vimeo.com/",
    match: /^player.vimeo.com$/
  },
  {
    host: VideoService.xvideos,
    url: "https://www.xvideos.com/",
    match: /^(www.)?xvideos.com$/
  },
  {
    host: VideoService.pornhub,
    url: "https://rt.pornhub.com/view_video.php?viewkey=",
    match: /^[a-z]+.pornhub.com$/
  },
  {
    host: VideoService.twitter,
    url: "https://twitter.com/i/status/",
    match: /^twitter.com$/
  },
  {
    host: VideoService.rumble,
    url: "https://rumble.com/",
    match: /^rumble.com$/
  },
  {
    host: VideoService.facebook,
    url: "https://facebook.com/",
    match: (url) => url.host.includes("facebook.com") && (url.pathname.includes("/videos/") || url.pathname.includes("/reel/"))
  },
  {
    host: VideoService.rutube,
    url: "https://rutube.ru/video/",
    match: /^rutube.ru$/
  },
  {
    host: VideoService.bilibili,
    url: "https://www.bilibili.com/video/",
    match: /^(www|m|player).bilibili.com$/
  },
  {
    host: VideoService.mailru,
    url: "https://my.mail.ru/",
    match: /^my.mail.ru$/
  },
  {
    host: VideoService.bitchute,
    url: "https://www.bitchute.com/video/",
    match: /^(www.)?bitchute.com$/
  },
  {
    host: VideoService.eporner,
    url: "https://www.eporner.com/",
    match: /^(www.)?eporner.com$/
  },
  {
    host: VideoService.peertube,
    url: "stub",
    match: sitesPeertube
  },
  {
    host: VideoService.dailymotion,
    url: "https://dai.ly/",
    match: /^(www.)?dailymotion.com|dai.ly$/
  },
  {
    host: VideoService.trovo,
    url: "https://trovo.live/s/",
    match: /^trovo.live$/
  },
  {
    host: VideoService.yandexdisk,
    url: "https://yadi.sk/i/",
    match: /^disk.yandex.ru|yadi.sk$/
  },
  {
    host: VideoService.okru,
    url: "https://ok.ru/video/",
    match: /^ok.ru$/
  },
  {
    host: VideoService.googledrive,
    url: "https://drive.google.com/file/d/",
    match: /^drive.google.com$/
  },
  {
    host: VideoService.bannedvideo,
    url: "https://madmaxworld.tv/watch?id=",
    match: /^(www.)?banned.video|madmaxworld.tv$/
  },
  {
    host: VideoService.weverse,
    url: "https://weverse.io/",
    match: /^weverse.io$/
  },
  {
    host: VideoService.newgrounds,
    url: "https://www.newgrounds.com/",
    match: /^(www.)?newgrounds.com$/
  },
  {
    host: VideoService.egghead,
    url: "https://egghead.io/",
    match: /^egghead.io$/
  },
  {
    host: VideoService.youku,
    url: "https://v.youku.com/",
    match: /^v.youku.com$/
  },
  {
    host: VideoService.custom,
    url: "stub",
    match: (url) => /([^.]+).mp4/.test(url.pathname)
  }
];

// src/utils/helpers.ts
class VideoHelperError extends Error {
  constructor(message) {
    super(message);
    this.name = "VideoHelper";
    this.message = message;
  }
}

class VideoHelper {
  static mailru = new class {
    async getVideoData(videoId) {
      try {
        const res = await fetch(`https://my.mail.ru/+/video/meta/${videoId}?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=${new Date().getTime()}`);
        return await res.json();
      } catch (err) {
        console.error("Failed to get mail.ru video info", err);
        return;
      }
    }
  };
  static weverse = new class {
    API_ORIGIN = "https://global.apis.naver.com/weverse/wevweb";
    API_APP_ID = "be4d79eb8fc7bd008ee82c8ec4ff6fd4";
    API_HMAC_KEY = "1b9cb6378d959b45714bec49971ade22e6e24e42";
    HEADERS = {
      Accept: "application/json, text/plain, */*",
      Origin: "https://weverse.io",
      Referer: "https://weverse.io/"
    };
    getURLData() {
      return {
        appId: this.API_APP_ID,
        language: "en",
        os: "WEB",
        platform: "WEB",
        wpf: "pc"
      };
    }
    async createHash(pathname) {
      const timestamp = Date.now();
      let salt = pathname.substring(0, Math.min(255, pathname.length)) + timestamp;
      const sign = await getHmacSha1(this.API_HMAC_KEY, salt);
      if (!sign) {
        throw new VideoHelperError("Failed to get weverse HMAC signature");
      }
      return {
        wmsgpad: timestamp.toString(),
        wmd: sign
      };
    }
    async getPostPreview(postId) {
      const pathname = `/post/v1.0/post-${postId}/preview?` + new URLSearchParams({
        fieldSet: "postForPreview",
        ...this.getURLData()
      });
      const hash = await this.createHash(pathname);
      try {
        const res = await fetch(this.API_ORIGIN + pathname + "&" + new URLSearchParams(hash), {
          headers: this.HEADERS
        });
        return await res.json();
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    async getVideoInKey(videoId) {
      const pathname = `/video/v1.1/vod/${videoId}/inKey?` + new URLSearchParams({
        gcc: "RU",
        ...this.getURLData()
      });
      const hash = await this.createHash(pathname);
      try {
        const res = await fetch(this.API_ORIGIN + pathname + "&" + new URLSearchParams(hash), {
          method: "POST",
          headers: this.HEADERS
        });
        return await res.json();
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    async getVideoInfo(infraVideoId, inkey, serviceId) {
      const timestamp = Date.now();
      try {
        const res = await fetch(`https://global.apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${infraVideoId}?` + new URLSearchParams({
          key: inkey,
          sid: serviceId,
          nonce: timestamp.toString(),
          devt: "html5_pc",
          prv: "N",
          aup: "N",
          stpb: "N",
          cpl: "en",
          env: "prod",
          lc: "en",
          adi: JSON.stringify([
            {
              adSystem: null
            }
          ]),
          adu: "/"
        }), {
          headers: this.HEADERS
        });
        return await res.json();
      } catch (err) {
        console.error(err);
        return false;
      }
    }
    extractVideoInfo(videoList) {
      return videoList.find((video) => video.useP2P === false && video.source.includes(".mp4"));
    }
    async getVideoData(postId) {
      const videoPreview = await this.getPostPreview(postId);
      if (!videoPreview) {
        return;
      }
      const { videoId, serviceId, infraVideoId } = videoPreview.extension.video;
      if (!(videoId && serviceId && infraVideoId)) {
        return;
      }
      const inkeyData = await this.getVideoInKey(videoId);
      if (!inkeyData) {
        return;
      }
      const videoInfo = await this.getVideoInfo(infraVideoId, inkeyData.inKey, serviceId);
      if (!videoInfo) {
        return;
      }
      const videoItem = this.extractVideoInfo(videoInfo.videos.list);
      if (!videoItem) {
        return;
      }
      return {
        url: videoItem.source,
        duration: videoItem.duration
      };
    }
  };
}

// src/utils/normalize.ts
var getService = function(videoUrl) {
  if (videoUrl.startsWith("file://"))
    return false;
  let enteredURL;
  try {
    enteredURL = new URL(videoUrl);
  } catch (e) {
    console.error(`Invalid URL: ${videoUrl}. Have you forgotten https?`);
    return false;
  }
  if (enteredURL.pathname.endsWith(".mp4")) {
    return {
      host: VideoService.custom
    };
  }
  const hostname = enteredURL.hostname;
  const isMathes = (match) => {
    if (match instanceof RegExp) {
      return match.test(hostname);
    } else if (typeof match === "string") {
      return hostname.includes(match);
    } else if (typeof match === "function") {
      return match(enteredURL);
    }
    return false;
  };
  return sites_default.find((e) => {
    return (Array.isArray(e.match) ? e.match.some(isMathes) : isMathes(e.match)) && e.host && e.url;
  });
};
async function getVideoID(service, videoURL) {
  const url = new URL(videoURL);
  switch (service.host) {
    case VideoService.custom:
      return url.href;
    case VideoService.piped:
    case VideoService.invidious:
    case VideoService.youtube:
      if (url.hostname === "youtu.be") {
        url.search = `?v=${url.pathname.replace("/", "")}`;
        url.pathname = "/watch";
      }
      return url.pathname.match(/(?:watch|embed|shorts|live)\/([^/]+)/)?.[1] || url.searchParams.get("v");
    case VideoService.vk: {
      const pathID = url.pathname.match(/^\/video-?[0-9]{8,9}_[0-9]{9}$/);
      const paramZ = url.searchParams.get("z");
      const paramOID = url.searchParams.get("oid");
      const paramID = url.searchParams.get("id");
      if (pathID) {
        return pathID[0].slice(1);
      } else if (paramZ) {
        return paramZ.split("/")[0];
      } else if (paramOID && paramID) {
        return `video-${Math.abs(parseInt(paramOID))}_${paramID}`;
      }
      return null;
    }
    case VideoService.nine_gag:
    case VideoService.gag:
      return url.pathname.match(/gag\/([^/]+)/)?.[1];
    case VideoService.twitch: {
      const clipPath = url.pathname.match(/([^/]+)\/(?:clip)\/([^/]+)/);
      const isClipsDomain = /^clips\.twitch\.tv$/.test(url.hostname);
      if (/^m\.twitch\.tv$/.test(url.hostname)) {
        return url.href.match(/videos\/([^/]+)/)?.[0] || url.pathname.slice(1);
      } else if (/^player\.twitch\.tv$/.test(url.hostname)) {
        return `videos/${url.searchParams.get("video")}`;
      } else if (isClipsDomain) {
        const pathname = url.pathname.slice(1);
        const isEmbed = pathname === "embed";
        const res = await fetch(`https://clips.twitch.tv/${isEmbed ? url.searchParams.get("clip") : url.pathname.slice(1)}`, {
          headers: {
            "User-Agent": "Googlebot/2.1 (+http://www.googlebot.com/bot.html)"
          }
        });
        const content = await res.text();
        const channelLink = content.match(/"url":"https:\/\/www\.twitch\.tv\/([^"]+)"/);
        if (!channelLink) {
          return null;
        }
        return `${channelLink[1]}/clip/${isEmbed ? url.searchParams.get("clip") : pathname}`;
      } else if (clipPath) {
        return clipPath[0];
      }
      return url.pathname.match(/(?:videos)\/([^/]+)/)?.[0];
    }
    case VideoService.proxitok:
    case VideoService.tiktok:
      return url.pathname.match(/([^/]+)\/video\/([^/]+)/)?.[0];
    case VideoService.vimeo: {
      const appId = url.searchParams.get("app_id");
      const videoId = url.pathname.match(/[^/]+\/[^/]+$/)?.[0] || url.pathname.match(/[^/]+$/)?.[0];
      return appId ? `${videoId}?app_id=${appId}` : videoId;
    }
    case VideoService.xvideos:
      return url.pathname.match(/[^/]+\/[^/]+$/)?.[0];
    case VideoService.pornhub:
      return url.searchParams.get("viewkey") || url.pathname.match(/embed\/([^/]+)/)?.[1];
    case VideoService.twitter:
      return url.pathname.match(/status\/([^/]+)/)?.[1];
    case VideoService.rumble:
    case VideoService.facebook:
      return url.pathname.slice(1);
    case VideoService.rutube:
      return url.pathname.match(/(?:video|embed)\/([^/]+)/)?.[1];
    case VideoService.bilibili: {
      const bvid = url.searchParams.get("bvid");
      if (bvid) {
        return bvid;
      }
      let vid = url.pathname.match(/video\/([^/]+)/)?.[1];
      if (vid && url.searchParams.get("p") !== null) {
        vid += `/?p=${url.searchParams.get("p")}`;
      }
      return vid;
    }
    case VideoService.mailru: {
      const pathname = url.pathname;
      if (pathname.startsWith("/v/") || pathname.startsWith("/mail/")) {
        return pathname.slice(1);
      }
      const videoId = pathname.match(/video\/embed\/([^/]+)/)?.[1];
      if (!videoId) {
        return null;
      }
      const videoData = await VideoHelper.mailru.getVideoData(videoId);
      if (!videoData) {
        return null;
      }
      return videoData.meta.url.replace("//my.mail.ru/", "");
    }
    case VideoService.bitchute:
      return url.pathname.match(/(video|embed)\/([^/]+)/)?.[2];
    case VideoService.eporner:
      return url.pathname.match(/video-([^/]+)\/([^/]+)/)?.[0];
    case VideoService.peertube:
      return url.pathname.match(/\/w\/([^/]+)/)?.[0];
    case VideoService.dailymotion: {
      return url.hostname === "dai.ly" ? url.pathname.slice(1) : url.pathname.match(/video\/([^/]+)/)?.[1];
    }
    case VideoService.trovo: {
      const vid = url.searchParams.get("vid");
      if (!vid) {
        return null;
      }
      const path = url.pathname.match(/([^/]+)\/([\d]+)/)?.[0];
      if (!path) {
        return null;
      }
      return `${path}?vid=${vid}`;
    }
    case VideoService.yandexdisk:
      return url.pathname.match(/\/i\/([^/]+)/)?.[1];
    case VideoService.okru: {
      return url.pathname.match(/\/video\/(\d+)/)?.[1];
    }
    case VideoService.googledrive:
      return url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    case VideoService.bannedvideo: {
      const videoId = url.searchParams.get("id");
      const res = await fetch(`${service.url}${videoId}`);
      const content = await res.text();
      return content.match(/https:\/\/download.assets.video\/videos\/([^.]+).mp4/)?.[0];
    }
    case VideoService.weverse: {
      const postId = url.pathname.match(/([^/]+)\/(live|media)\/([^/]+)/)?.[3];
      if (!postId) {
        return;
      }
      const result = await VideoHelper.weverse.getVideoData(postId);
      return result ? result.url : undefined;
    }
    case VideoService.newgrounds:
      return url.pathname.match(/([^/]+)\/(view)\/([^/]+)/)?.[0];
    case VideoService.egghead:
      return url.pathname.slice(1);
    case VideoService.youku:
      return url.pathname.match(/v_show\/id_[\w=]+/)?.[0];
    case VideoService.custom:
      return url.pathname + url.search;
    default:
      return;
  }
}
async function normalize(url) {
  const service = getService(url);
  if (!service) {
    throw new NormalizeError(`URL: "${url}" is unknown service`);
  }
  let videoId = await getVideoID(service, url);
  if (!videoId) {
    throw new NormalizeError(`Entered unsupported link: "${url}"`);
  }
  if ([VideoService.peertube].includes(service.host)) {
    service.url = new URL(url).origin;
  }
  return [
    VideoService.weverse,
    VideoService.bannedvideo,
    VideoService.custom
  ].includes(service.host) ? videoId : `${service.url}${videoId}`;
}

class NormalizeError extends Error {
  constructor(message) {
    super(message);
    this.name = "NormalizeError";
    this.message = message;
  }
}

// src/client.ts
class VOTJSError extends Error {
  constructor(message) {
    super(message);
    this.name = "VOTJSError";
    this.message = message;
  }
}

class VOTClient {
  host;
  fetch;
  fetchOpts;
  normalize;
  requestLang;
  responseLang;
  userAgent = config_default.userAgent;
  headers = {
    "User-Agent": this.userAgent,
    Accept: "application/x-protobuf",
    "Accept-Language": "en",
    "Content-Type": "application/x-protobuf",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    "Sec-Fetch-Mode": "no-cors"
  };
  constructor({
    host = config_default.host,
    fetchFn = fetch,
    fetchOpts = {},
    normalizeFn = normalize,
    requestLang = "en",
    responseLang = "ru"
  } = {}) {
    this.host = host;
    this.fetch = fetchFn;
    this.fetchOpts = fetchOpts;
    this.normalize = normalizeFn;
    this.requestLang = requestLang;
    this.responseLang = responseLang;
  }
  async request(path, body, headers = {}) {
    const options = {
      method: "POST",
      headers: {
        ...this.headers,
        ...headers
      },
      body: new Blob([body]),
      ...this.fetchOpts
    };
    try {
      const res = await this.fetch(`https://${this.host}${path}`, options);
      const data = await res.arrayBuffer();
      return {
        success: res.status === 200,
        data
      };
    } catch (err) {
      console.error("[vot.js]", err.message);
      return {
        success: false,
        data: null
      };
    }
  }
  async translateVideo({
    url,
    duration = config_default.defaultDuration,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    translationHelp = null,
    headers = {}
  }) {
    const body = yandexProtobuf.encodeTranslationRequest(await this.normalize(url), duration, requestLang, responseLang, translationHelp);
    const res = await this.request("/video-translation/translate", body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Token": getUUID(false),
      ...headers
    });
    if (!res.success) {
      throw new VOTJSError("Failed to request video translation");
    }
    const translateResponse = yandexProtobuf.decodeTranslationResponse(res.data);
    switch (translateResponse.status) {
      case VideoTranslationStatus.FAILED:
        throw new VOTJSError("Yandex couldn't translate video");
      case VideoTranslationStatus.FINISHED:
      case VideoTranslationStatus.PART_CONTENT:
        if (!translateResponse.url) {
          throw new VOTJSError("Audio link wasn't received from Yandex response");
        }
        return {
          translated: true,
          url: translateResponse.url,
          remainingTime: translateResponse.remainingTime ?? -1
        };
      case VideoTranslationStatus.WAITING:
        return {
          translated: false,
          remainingTime: translateResponse.remainingTime
        };
      case VideoTranslationStatus.LONG_WAITING:
      case VideoTranslationStatus.LONG_WAITING_2:
        return {
          translated: false,
          remainingTime: translateResponse.remainingTime ?? -1
        };
    }
    console.error("[vot.js] Unknown response", translateResponse);
    throw new VOTJSError("Unknown response from Yandex");
  }
  async getSubtitles({
    url,
    requestLang = this.requestLang,
    headers = {}
  }) {
    const body = yandexProtobuf.encodeSubtitlesRequest(await this.normalize(url), requestLang);
    const res = await this.request("/video-subtitles/get-subtitles", body, {
      "Vsubs-Signature": await getSignature(body),
      "Sec-Vsubs-Token": getUUID(false),
      ...headers
    });
    if (!res.success) {
      throw new VOTJSError("Failed to request video subtitles");
    }
    return yandexProtobuf.decodeSubtitlesResponse(res.data);
  }
  async pingStream({ pingId, headers = {} }) {
    const body = yandexProtobuf.encodeStreamPingRequest(pingId);
    const res = await this.request("/stream-translation/ping-stream", body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Token": getUUID(false),
      ...headers
    });
    if (!res.success) {
      throw new VOTJSError("Failed to request stream ping");
    }
    return true;
  }
  async translateStream({
    url,
    requestLang = this.requestLang,
    responseLang = this.responseLang,
    headers = {}
  }) {
    const body = yandexProtobuf.encodeStreamRequest(await this.normalize(url), requestLang, responseLang);
    const res = await this.request("/stream-translation/translate-stream", body, {
      "Vtrans-Signature": await getSignature(body),
      "Sec-Vtrans-Token": getUUID(false),
      ...headers
    });
    if (!res.success) {
      throw new VOTJSError("Failed to request stream translation");
    }
    const translateResponse = yandexProtobuf.decodeStreamResponse(res.data);
    const interval = translateResponse.interval;
    switch (interval) {
      case 0:
      case 10:
        return {
          translated: false,
          interval,
          message: interval === 0 ? "streamNoConnectionToServer" : "translationTakeFewMinutes"
        };
      case 20: {
        return {
          translated: true,
          interval,
          result: translateResponse.translatedInfo
        };
      }
    }
    console.error("[vot.js] Unknown response", translateResponse);
    throw new VOTJSError("Unknown response from Yandex");
  }
}

class VOTWorkerClient extends VOTClient {
  constructor() {
    super(...arguments);
  }
  async request(path, body, headers = {}) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        headers: {
          ...this.headers,
          ...headers
        },
        body: Array.from(body)
      }),
      ...this.fetchOpts
    };
    try {
      const res = await this.fetch(`https://${this.host}${path}`, options);
      const data = await res.arrayBuffer();
      return {
        success: res.status === 200,
        data
      };
    } catch (err) {
      console.error("[vot.js]", err.message);
      return {
        success: false,
        data: null
      };
    }
  }
}
// src/types/client.ts
var exports_client = {};
// src/types/helpers/mailru.ts
var exports_mailru = {};
// src/types/helpers/weverse.ts
var exports_weverse = {};
export {
  yandexProtobuf,
  normalize,
  getUUID,
  getSignature,
  VOTClient as default,
  exports_yandex2 as YandexType,
  exports_yandex as YandexProtobufType,
  exports_weverse as WeverseType,
  VideoHelper,
  VOTWorkerClient,
  exports_mailru as MailRuType,
  exports_client as ClientType
};
