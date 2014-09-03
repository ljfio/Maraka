// mongodb_queue

// documentation via: haraka -c /etc/haraka -h plugins/mongodb_queue

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin

exports.register = function() {
  this.settings = this.config.get('mongodb.settings') || {
    host: 'localhost',
    port: '27017',
    name: 'test'
  };
  
  // Workaround because JS
  var self = this;
  
  // Initialize connection once
  var mongoc = require('mongodb').MongoClient, format = require('util').format;
  
  mongoc.connect(format("mongodb://%s:%s/%s", this.settings.host, this.settings.port, this.settings.name), function(err, database) {
    if(err) throw err;

    self.emails = database.collection('emails');
  });
};

function extractChildren(children) {
  return children.map(function(child) {
    var data = {
      body: child.bodytext
    }
    if (child.children.length > 0) data.children = extractChildren(child.children);
    return data;
  }) 
}

// Parse the address - Useful for checking usernames in rcpt_to
function parseSubaddress(user) {
  var parsed = {username: user};
  if (user.indexOf('+')) {
    parsed.username = user.split('+')[0];
    parsed.subaddress = user.split('+')[1];
  }
  return parsed;
}

// Hook for data
exports.hook_data = function(next, connection) {
  connection.transaction.parse_body = 1;
  next();
};

// Hook for queue-ing
exports.hook_queue = function(next, connection) {
  var body = connection.transaction.body;

  this.emails.insert({
    sender: body.header.get_decoded('sender'),
    from: body.header.get_decoded('from'),
    to: body.header.get_decoded('to'),
    date: body.header.get_decoded('date'),
    subject: body.header.get_decoded('subject'),
    body: body.bodytext,
    parts: extractChildren(body.children),
    content_type: body.ct
  }, function(err) {
    if(err) {
      next(DENY, "storage error");
    } else {
      next(OK);
    }
  });
};