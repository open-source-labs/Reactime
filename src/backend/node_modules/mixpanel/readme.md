Mixpanel-node
=============
[![Build Status](https://travis-ci.org/mixpanel/mixpanel-node.svg?branch=master)](https://travis-ci.org/mixpanel/mixpanel-node)

This library provides many of the features in the official JavaScript mixpanel library.  It is easy to use, and fully async. It is intended to be used on the server (it is not a client module). The in-browser client library is available
at [https://github.com/mixpanel/mixpanel-js](https://github.com/mixpanel/mixpanel-js).

Installation
------------

    npm install mixpanel

Quick Start
-----------

```javascript
// grab the Mixpanel factory
var Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
var mixpanel = Mixpanel.init('<YOUR_TOKEN>');

// initialize mixpanel client configured to communicate over https
var mixpanel = Mixpanel.init('<YOUR_TOKEN>', {
    protocol: 'https'
});

// track an event with optional properties
mixpanel.track('my event', {
    distinct_id: 'some unique client id',
    as: 'many',
    properties: 'as',
    you: 'want'
});
mixpanel.track('played_game');

// set an IP address to get automatic geolocation info
mixpanel.track('my event', {ip: '127.0.0.1'});

// track an event with a specific timestamp (up to 5 days old;
// use mixpanel.import() for older events)
mixpanel.track('timed event', {time: new Date()});

// create or update a user in Mixpanel Engage
mixpanel.people.set('billybob', {
    $first_name: 'Billy',
    $last_name: 'Bob',
    $created: (new Date('jan 1 2013')).toISOString(),
    plan: 'premium',
    games_played: 1,
    points: 0
});

// create or update a user in Mixpanel Engage without altering $last_seen
// - pass option $ignore_time: true to prevent the $last_seen property from being updated
mixpanel.people.set('billybob', {
    plan: 'premium',
    games_played: 1
}, {
    $ignore_time: true
});

// set a user profile's IP address to get automatic geolocation info
mixpanel.people.set('billybob', {
    plan: 'premium',
    games_played: 1
}, {
    $ip: '127.0.0.1'
});

// set a single property on a user
mixpanel.people.set('billybob', 'plan', 'free');

// set a single property on a user, don't override
mixpanel.people.set_once('billybob', 'first_game_play', (new Date('jan 1 2013')).toISOString());

// increment a numeric property
mixpanel.people.increment('billybob', 'games_played');

// increment a numeric property by a different amount
mixpanel.people.increment('billybob', 'points', 15);

// increment multiple properties
mixpanel.people.increment('billybob', {'points': 10, 'games_played': 1});

// append value to a list
mixpanel.people.append('billybob', 'awards', 'Great Player');

// append multiple values to a list
mixpanel.people.append('billybob', {'awards': 'Great Player', 'levels_finished': 'Level 4'});

// merge value to a list (ignoring duplicates)
mixpanel.people.union('billybob', {'browsers': 'ie'});

// merge multiple values to a list (ignoring duplicates)
mixpanel.people.union('billybob', {'browsers': ['ie', 'chrome']});


// record a transaction for revenue analytics
mixpanel.people.track_charge('billybob', 39.99);

// clear a users transaction history
mixpanel.people.clear_charges('billybob');

// delete a user
mixpanel.people.delete_user('billybob');

// delete a user in Mixpanel Engage without altering $last_seen or resolving aliases
// - pass option $ignore_time: true to prevent the $last_seen property from being updated
// (useful if you subsequently re-import data for the same distinct ID)
mixpanel.people.delete_user('billybob', {$ignore_time: true, $ignore_alias: true});

// Create an alias for an existing distinct id
mixpanel.alias('distinct_id', 'your_alias');

// all functions that send data to mixpanel take an optional
// callback as the last argument
mixpanel.track('test', function(err) { if (err) throw err; });

// track multiple events at once
mixpanel.track_batch([
    {
        event: 'recent event',
        properties: {
            time: new Date(),
            distinct_id: 'billybob',
            gender: 'male'
        }
    },
    {
        event: 'another recent event',
        properties: {
            distinct_id: 'billybob',
            color: 'red'
        }
    }
]);

// import an old event
var mixpanel_importer = Mixpanel.init('valid mixpanel token', {
    key: 'valid api key for project'
});

// needs to be in the system once for it to show up in the interface
mixpanel_importer.track('old event', { gender: '' });

mixpanel_importer.import('old event', new Date(2012, 4, 20, 12, 34, 56), {
    distinct_id: 'billybob',
    gender: 'male'
});

// import multiple events at once
mixpanel_importer.import_batch([
    {
        event: 'old event',
        properties: {
            time: new Date(2012, 4, 20, 12, 34, 56),
            distinct_id: 'billybob',
            gender: 'male'
        }
    },
    {
        event: 'another old event',
        properties: {
            time: new Date(2012, 4, 21, 11, 33, 55),
            distinct_id: 'billybob',
            color: 'red'
        }
    }
]);
```

FAQ
---
**Where is `mixpanel.identify()`?**

`mixpanel-node` is a server-side library, optimized for stateless shared usage; e.g.,
in a web application, the same mixpanel instance is used across requests for all users.
Rather than setting a `distinct_id` through `identify()` calls like Mixpanel client-side
libraries (where a single Mixpanel instance is tied to a single user), this library
requires you to pass the `distinct_id` with every tracking call. See
https://github.com/mixpanel/mixpanel-node/issues/13.

**How do I get or set superproperties?**

See the previous answer: the library does not maintain user state internally and so has
no concept of superproperties for individual users. If you wish to preserve properties
for users between requests, you will need to load these properties from a source specific
to your app (e.g., your session store or database) and pass them explicitly with each
tracking call.


Tests
-----

    # in the mixpanel directory
    npm install
    npm test

Alternative Clients and Related Tools
-------------------------------------

- [Mixpanel-CLI](https://github.com/FGRibreau/mixpanel-cli) - CLI for Mixpanel API (currently only supports tracking functions)
- [Mixpanel Data Export](https://github.com/michaelcarter/mixpanel-data-export-js) - Supports various query and data-management APIs; runs in both Node.js and browser
- [Mixpanel Data Export (strawbrary)](https://github.com/strawbrary/mixpanel-data-export-js) - Fork of previous library, optimized for Node.js with support for streaming large raw exports

Attribution/Credits
-------------------

Heavily inspired by the original js library copyright Mixpanel, Inc.
(http://mixpanel.com/)

Copyright (c) 2014-18 Mixpanel
Original Library Copyright (c) 2012-14 Carl Sverre

Contributions from:
 - [Andres Gottlieb](https://github.com/andresgottlieb)
 - [Ken Perkins](https://github.com/kenperkins)
 - [Nathan Rajlich](https://github.com/TooTallNate)
 - [Thomas Watson Steen](https://github.com/watson)
 - [Gabor Ratky](https://github.com/rgabo)
 - [wwlinx](https://github.com/wwlinx)
 - [PierrickP](https://github.com/PierrickP)
 - [lukapril](https://github.com/lukapril)
 - [sandinmyjoints](https://github.com/sandinmyjoints)
 - [Jyrki Laurila](https://github.com/jylauril)
 - [Zeevl](https://github.com/zeevl)
 - [Tobias Baunbæk](https://github.com/freeall)
 - [Eduardo Sorribas](https://github.com/sorribas)
 - [Nick Chang](https://github.com/maeldur)
 - [Michael G](https://github.com/gmichael225)
 - [Tejas Manohar](https://github.com/tejasmanohar)
 - [Eelke Boezeman](https://github.com/godspeedelbow)
 - [Jim Thomas](https://github.com/Left47)
 - [Frank Chiang](https://github.com/chiangf)
 - [Morgan Croney](https://github.com/cruzanmo)
 - [Cole Furfaro-Strode](https://github.com/colestrode)
 - [Jonas Hermsmeier](https://github.com/jhermsmeier)
 - [Marko Klopets](https://github.com/mklopets)
 - [Cameron Diver](https://github.com/CameronDiver)

License
-------------------

Released under the MIT license.  See file called LICENSE for more
details.
