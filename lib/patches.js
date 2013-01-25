
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                   window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Function.bind polyfill:
//
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// Element.classList polyfill:
//
// https://github.com/remy/polyfills/blob/master/classList.js
//
// Copyright (c) 2010 Remy Sharp, http://remysharp.com
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {

if (typeof Element === "undefined" || Element.prototype.hasOwnProperty("classList")) return;

var indexOf = [].indexOf,
    slice = [].slice,
    push = [].push,
    splice = [].splice,
    join = [].join;

function DOMTokenList(el) {
  this._element = el;
  if (el.className != this.classCache) {
    this._classCache = el.className;

    var classes = this._classCache.split(' '),
        i;
    for (i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  }
}

function setToClassName(el, classes) {
  el.className = classes.join(' ');
}

DOMTokenList.prototype = {
  add: function(token) {
    push.call(this, token);
    setToClassName(this._element, slice.call(this, 0));
  },
  contains: function(token) {
    return indexOf.call(this, token) !== -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    var i = indexOf.call(this, token);
    splice.call(this, i, 1);
    setToClassName(this._element, slice.call(this, 0));
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (indexOf.call(this, token) === -1) {
      this.add(token);
    } else {
      this.remove(token);
    }
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();

// Array.isArray polyfill from:
// https://gist.github.com/1126989
Array.isArray||(Array.isArray=function(a){return{}.toString.call(a)=='[object Array]';});