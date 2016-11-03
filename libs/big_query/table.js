(function(module){
  var _ = require("underscore");

  function Table(dataset, name) {
    this.table = dataset.table(name);
    this.name = name;

    _.bindAll(this, '_insertionError');
  }

  var fn = Table.prototype;

  fn.insert = function(rows, options) {
    var that = this;

    options = _.extend(this._blankCallbacks(), options || {});

    this.table.insert(rows, function(err, insertErrors, apiResponse) {
      that._insertionCallback(err, insertErrors, apiResponse, options);
    });
  };

  fn._blankCallbacks = function() {
    return {
      success: function() {},
      error: function() {}
    };
  };
  
  fn._insertionCallback = function (err, insertErrors, apiResponse, options) {
    if (err || insertErrror) {
      options.error.call(this, err, insertErrors);
    } else {
      options.success.call(this, apiResponse);
    }
  };

  fn.select = function(select, options) {
    options = _.extend(this._blankCallbacks(), options || {});
    query =  'SELECT ' + select + ' FROM ' + this.name;

    this.table.query({
      query: query
    }, this.selectCallback);
  };
  
  fn.selectCallback = function(err, response) {
    if (err) {
      options.error.call(this, err);
    } else {
      options.error.call(this, response);
    }
  };

  module.exports = Table;
})(module);
