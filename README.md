# Maraka
Simple MongoDB plugin for Haraka.

## Install
- Ensure you have created a Config directory
- Make the Config directory your terminal's current working directory and run `npm install mongodb`
  - This installs the mongodb node.js module that's required to run
- Place `mongodb_queue.js` in to your plugins directories
- Configure the settings using a `mongodb.settings` file in your config directory
  - `host` is the IP / hostname you wish to connect to, `port` is the port mongodb is listening on and `name` is the name of the collection you wish to insert into

## Future
- Authentication plugin
- Mailbox look-up for emails
- Attachment saving
