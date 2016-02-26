(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return $(el).bind('input.rivets', this.publish);
    },
    unbind: function(el) {
      return $(el).unbind('input.rivets');
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

}).call(this);

(function() {
  var FormbuilderModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FormbuilderModel = (function(_super) {
    __extends(FormbuilderModel, _super);

    function FormbuilderModel() {
      _ref = FormbuilderModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FormbuilderModel.prototype.sync = function() {};

    FormbuilderModel.prototype.indexInDOM = function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".fb-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

}).call(this);

(function() {
  Formbuilder.registerField('bullet_points', {
    order: 30,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />\n<div>...</div>\n<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'><span class='fa fa-list'></span></span> Bullet Points",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    order: 50,
    view: "<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-square-o'></span></span> Checkboxes",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          value: ""
        }, {
          label: "",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.option_numbering = 'none';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date', {
    order: 70,
    view: "<div class='fb-date'>\n    <input type=\"text\" />\n    <span class=\"symbol\"><span class=\"fa fa-calendar\"></span></span>\n</div>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-calendar\"></span></span> Date"
  });

}).call(this);

(function() {
  Formbuilder.registerField('dropdown', {
    order: 60,
    view: "<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeBlank: true, excludeOptionNumbering: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-caret-down'></span></span> Dropdown",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          value: ""
        }, {
          label: "",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.include_blank_option = false;
      return attrs;
    }
  });

}).call(this);

(function() {


}).call(this);

(function() {
  Formbuilder.registerField('number', {
    order: 80,
    view: "<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
    addButton: "<span class='symbol'><span class='fa fa-number'>123</span></span> Number"
  });

}).call(this);

(function() {
  Formbuilder.registerField('paragraph', {
    order: 20,
    view: "<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'>&#182;</span> Paragraph",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    order: 40,
    view: "<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>    \n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-circle-o'></span></span> Multiple Choice",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "",
          checked: false,
          value: ""
        }, {
          label: "",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.option_numbering = 'none';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('scale', {
    order: 90,
    view: "<i class='fa fa-chevron-left'></i><input type='text' /><i class='fa fa-chevron-right'></i>\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
    addButton: "<span class='symbol'><span class='fa fa-exchange'></span></span> Scale"
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_break', {
    order: 100,
    type: 'non_input',
    view: "<hr />\n<label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>\n<span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>\n<hr />",
    edit: "<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>",
    addButton: "<span class='symbol'><span class='fa fa-minus'></span></span> Section Break"
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_end', {
    order: 101,
    type: 'non_input',
    view: "<hr />",
    edit: "",
    addButton: "<span class='symbol'><span class='fa fa-arrow-left'></span></span> Section End"
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_start', {
    order: 99,
    type: 'non_input',
    view: "<label><span><%= rf.get(Formbuilder.options.mappings.LABEL) %></span></label>\n<span class='help-block'><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></span>\n<hr />",
    edit: "<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' class='fb-large-input' placeholder='Title' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>' class='fb-large-input' placeholder='Add a longer description to this field'></textarea>",
    addButton: "<span class='symbol'><span class='fa fa-arrow-right'></span></span> Section Start"
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    order: 10,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
    addButton: "<span class='symbol'><span class='fa fa-font'></span></span> Text",
    defaultAttributes: function(attrs) {
      attrs.field_options.size = 'small';
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('yes_no', {
    order: 100,
    view: "<ol style='list-style-type: <%= rf.get(Formbuilder.options.mappings.OPTION_NUMBERING) %>;'>\n<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <li>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </li>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <li class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </li>\n<% } %>\n</ol>",
    edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
    addButton: "<span class='symbol'><span class='fa fa-circle-o'></span></span> Yes/No",
    defaultAttributes: function(attrs) {
      attrs.field_options.options = [
        {
          label: "Yes",
          checked: false,
          value: ""
        }, {
          label: "No",
          checked: false,
          value: ""
        }
      ];
      attrs.field_options.option_numbering = 'none';
      return attrs;
    }
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.templates['edit/links']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-field-label\'>\r\n  <span data-rv-text="model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'"></span>\r\n  <code class=\'field-type\' data-rv-text=\'model.' +
((__t = ( Formbuilder.options.mappings.FIELD_TYPE )) == null ? '' : __t) +
'\'></code>\r\n  <span class=\'fa fa-arrow-right pull-right\'></span>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\r\n    Required\r\n</label>\r\n<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.ATTACHMENT )) == null ? '' : __t) +
'\' />\r\n    Add attachment\r\n</label>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Question</div>\r\n\r\n<div class=\'fb-common-wrapper\'>\r\n    <div class=\'fb-label-description\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-label-qid\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/label_qid']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-label-label\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/label_value']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-common-checkboxes\'>\r\n        ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\r\n    </div>\r\n    <div class=\'fb-clear\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Label</div>\r\n\r\n<div class=\'fb-common-wrapper\'>\r\n  <div class=\'fb-label-description\'>\r\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\r\n  </div>\r\n  <div class=\'fb-clear\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\r\n<label>\r\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\r\n  Only accept integers\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' class="fb-large-input" placeholder="Title" />\r\n<textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\' class="fb-large-input" placeholder=\'Add a longer description to this field\'></textarea>';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_qid"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.QID )) == null ? '' : __t) +
'\' placeholder="Question ID" class="fb-large-input" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_value"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.VALUE )) == null ? '' : __t) +
'\' class="fb-large-input" placeholder="Value" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/links"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>References</div>\r\n\r\n<div class=\'fb-edit-link\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.LINKS )) == null ? '' : __t) +
'\'>\r\n    <input type="text" class="fb-link-label-input" data-rv-input="option:label" placeholder="Reference" \r\n    /><!--<input type="text" class="fb-link-url-input" data-rv-input="option:url" placeholder="Url"\r\n    />--><a class="js-add-link ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Link"><i class=\'fa fa-plus\'></i>\r\n    </a><a class="js-remove-link ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Link"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>\r\n\r\n<div class=\'fb-bottom-add\'>\r\n    <a class="js-add-link ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add link</a>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\r\n\r\nAbove\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\nBelow\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\r\n\r\nMin\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\nMax\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\r\n\r\n&nbsp;&nbsp;\r\n\r\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\r\n  <option value="characters">characters</option>\r\n  <option value="words">words</option>\r\n</select>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\r\n\r\n';
 if (typeof excludeOptionNumbering === 'undefined') { ;
__p += '\r\n<div>\r\n    Options numbering:\r\n    <select data-rv-value=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTION_NUMBERING )) == null ? '' : __t) +
'\'>\r\n        <option selected="selected" value="none">none</option>\r\n        <option value="decimal">decimal</option>\r\n        <option value="lower-latin">lower-latin</option>\r\n        <option value="upper-latin">upper-latin</option>\r\n    </select>\r\n</div>\r\n';
 } ;
__p += '\r\n\r\n';
 if (typeof includeBlank !== 'undefined') { ;
__p += '\r\n<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\r\n    Include blank\r\n</label>\r\n';
 } ;
__p += '\r\n\r\n<div class=\'fb-edit-option\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\r\n    <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" \r\n    /><input type="text" class="fb-option-label-input" data-rv-input="option:label" placeholder="Label"\r\n    /><input type="text" class="fb-option-value-input" data-rv-input="option:value" placeholder="Value"\r\n    /><a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'fa fa-plus\'></i>\r\n    </a><a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>\r\n\r\n';
 if (typeof includeOther !== 'undefined') { ;
__p += '\r\n<label>\r\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\r\n    Include "other"\r\n</label>\r\n';
 } ;
__p += '\r\n\r\n<div class=\'fb-bottom-add\'>\r\n    <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\r\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\r\n  <option value="small">Small</option>\r\n  <option value="medium">Medium</option>\r\n  <option value="large">Large</option>\r\n</select>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\r\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['partials/save_button']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.templates['partials/menu_side']() )) == null ? '' : __t) +
'\r\n' +
((__t = ( Formbuilder.templates['partials/content_side']() )) == null ? '' : __t) +
'\r\n<div class=\'fb-clear\'></div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\r\n  <div class=\'fb-add-field-types\'>\r\n    <div class=\'section\'>\r\n      ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\r\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\r\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\r\n        </a>\r\n      ';
 }); ;
__p += '\r\n    </div>\r\n\r\n    <div class=\'section\'>\r\n      ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\r\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\r\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\r\n        </a>\r\n      ';
 }); ;
__p += '\r\n    </div>\r\n  </div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/content_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-form\'>\r\n  <div class=\'fb-no-response-fields\'>No response fields</div>\r\n  <div class=\'fb-response-fields\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\r\n  <div class=\'fb-edit-field-wrapper\'></div>\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/menu_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-menu\'>\r\n  <ul class=\'fb-tabs\'>\r\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\r\n    <li><a data-target=\'#editField\'>Edit field</a></li>\r\n  </ul>\r\n\r\n  <div class=\'fb-tab-content\'>\r\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\r\n  </div>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/save_button"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-save-wrapper\'>\r\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\r\n    <div class=\'cover\'></div>\r\n    ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['view/links']({rf: rf}) )) == null ? '' : __t) +
'\r\n\r\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\r\n\r\n    ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\r\n    <div class=\'cover\'></div>\r\n    ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\r\n    ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\r\n</div>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\r\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\r\n</span>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\r\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Duplicate Field"><i class=\'fa fa-plus\'></i></a>\r\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Field"><i class=\'fa fa-trash-o\'></i></a>\r\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\r\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\r\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\r\n    <abbr title=\'required\'>*</abbr>\r\n  ';
 } ;
__p += '\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/label_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\r\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\r\n</label>\r\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/links"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if ((rf.get(Formbuilder.options.mappings.LINKS) || []).length > 0) { ;
__p += '\r\n<div class="fb-links">\r\n    <div class="fb-links-title">Links:</div>\r\n    <ul>\r\n        ';
 for (i in (rf.get(Formbuilder.options.mappings.LINKS) || [])) { ;
__p += '\r\n        <li>\r\n            ';
 if((rf.get(Formbuilder.options.mappings.LINKS)[i].label || '').trim().indexOf('http') === 0) { ;
__p += '\r\n            <a href="' +
((__t = ( rf.get(Formbuilder.options.mappings.LINKS)[i].label )) == null ? '' : __t) +
'">\r\n            ';
 } ;
__p += '\r\n                ' +
((__t = ( rf.get(Formbuilder.options.mappings.LINKS)[i].label )) == null ? '' : __t) +
'\r\n            ';
 if((rf.get(Formbuilder.options.mappings.LINKS)[i].label || '').trim().indexOf('http') === 0) { ;
__p += '\r\n            </a>\r\n            ';
 } ;
__p += '\r\n        </li>\r\n        ';
 } ;
__p += '\r\n    </ul>\r\n</div>\r\n';
 } ;


}
return __p
};