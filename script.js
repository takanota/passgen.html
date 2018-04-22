function $(id) {
  return document.getElementById(id);
}

Object.prototype.inspect = function () {
try {
  var inspected = [ "{" ];
  var hasLeading = false;
  for (var property in this) {
    if (this[property] instanceof Function) {
      continue;
    }

// alert("inspect: " + property);
    if (hasLeading) {
      inspected.push(", ");
    } else {
      hasLeading = true;
    }
    inspected.push(property, ": ", this[property]);
  }
  inspected.push("}");
  return inspected.join("");
} catch(e) {
  alert(e);
}
};

Object.prototype.properties = function () {
  var properties = [];
  for (var key in this) {
    if (!(this[key] instanceof Function)) {
      properties.push(key);
    }
  }
  return properties;
};

function Event() { }
Event.on = function (object, eventName, thisObj, handlerName) {
  object.addEventListener(eventName,
    function (event) {
      alert(event + " -> " + handlerName);
      var handler = thisObj[handlerName];
      try {
        handler.call(thisObj, event);
      } catch (exception) {
        alert(exception);
      }
    }, false);
};

function PasswordGenerator() { this.initialize(); }
PasswordGenerator.prototype = {
  DEFAULT_LENGTH: 8,

  CHAR_LIST: {
    upperAlphabet: {
      L: "QWERTASDFGZXCV", R: "YUIOPHJKLBNM"
    },
    lowerAlphabet: {
      L: "qwertasdfgzxcv", R: "yuiophjklbnm"
    },
    number: {
      L: "12345", R: "67890"
    },
    symbol: {
      L: "!\"#$%", R: "&'()="
    }
  },

  /**
   * Initialize Application Object.
   */
  initialize: function () {
    this.setInitialValues();
    this.setEventListeners();
  },

  setInitialValues: function () {
    $("upperAlphabet").checked = true;
    $("lowerAlphabet").checked = true;
    $("number").checked = true;
    $("symbol").checked = true;
    $("length").value = this.DEFAULT_LENGTH;
  },

  setEventListeners: function () {
    var self = this;

    Event.on($("generate_button"), "click",
      this, "onClickGenerateButton");
    Event.on($("lengh"), "blur",
      this, "onBlurLength");
  },

  onBlurLength: function () {
    $("length").value =
      this.sanitizeLength($("length").value);
  },

  sanitizeLength: function (length) {
    var sanitized = length
      .replace(/[^0-9]+/, "")
      .replace(/^0+/, "");
    if (sanitized == "") {
      sanitized = this.DEFAULT_LENGTH;
    }
    alert(sanitized);
    return sanitized;
  },

  onClickGenerateButton: function () {
    var charCount = this.createCharCount();
    var generated = this.generatePassword(charCount);

    var history = $("history");
    alert(history.children.length);
    while (history.children.length > 5) {
      history.removeChild(history.lastChild);
    }

    var li = document.createElement("LI");
    li.appendChild(document.createTextNode(
      generated));
    history.insertBefore(li, history.firstChild);
  },

  createCharCount: function () {
    var length = $("length").value;
    var restCount = length;
    var charCount = {};

    var charTypes = this.CHAR_LIST.properties()
    .filter(function (charType) {
      return $(charType).checked;

    }).forEach(function (charType, i, charTypes) {
      var count = 0;
      if (i == charTypes.length - 1) {
        count = restCount;

      } else {
        var baseCount =
          restCount / (charTypes.length - i);

        count = Math.ceil(baseCount *
          (Math.random() * 100 + 50) / 100);
/*
        alert([
          charType, ": ",
          restCount, " / ", (this.length - i),
          " => ", count
        ].join(""));
*/
      }

      charCount[charType] = count;
      restCount -= count;
    });

    alert(charCount.inspect());
    return charCount;
  },

  generatePassword: function (charCount) {
    var charTypes = [];
    charCount.properties().forEach(function (charType) {
      var count = charCount[charType];
//          alert(charType + ": " + count);
      for (var i = 0; i < count; ++i) {
        charTypes.splice(
          Math.floor(Math.random() * charTypes.length),
          0, charType);
      }
    });

     alert(charTypes);
    var self = this;
    var password = [];
    charTypes.forEach(function (charType, charNo) {
//          alert(charType);
      var leftRight = (Math.floor(charNo / 2) % 2) == 0 ? "L" : "R";
      var charList = self.CHAR_LIST[charType][leftRight];
      var i = Math.floor(Math.random() * charList.length);
      password.push(charList.charAt(i));
    });

    return password.join("");
  }
};

var app = new PasswordGenerator();
