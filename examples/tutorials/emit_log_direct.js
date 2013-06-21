#!/usr/bin/env node

var amqp = require('amqplib');

var args = process.argv.slice(2);
var severity = (args.length > 0) ? args[0] : 'info';
var message = args.slice(1).join(' ') || 'Hello World!';

amqp.connect('amqp://localhost').then(function(conn) {
  return conn.createChannel().then(function(ch) {
    var ex = 'direct_logs';
    var ok = ch.assertExchange(ex, 'direct', {durable: false});

    ok = ok.then(function() {
      ch.publish(ex, severity, new Buffer(message));
      console.log(" [x] Sent %s:'%s'", severity, message);
    });
    return ok.then(function() { conn.close(); });
  });
}).then(null, console.warn);
