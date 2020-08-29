// grab the Mixpanel factory
var Mixpanel = require('./lib/mixpanel-node');

// create an instance of the mixpanel client
var mixpanel = Mixpanel.init('962dbca1bbc54701d402c94d65b4a20e');
mixpanel.set_config({ debug: true });

// track an event with optional properties
mixpanel.track("my event", {
    distinct_id: "some unique client id",
    as: "many",
    properties: "as",
    you: "want"
});
mixpanel.track("played_game");

// create or update a user in Mixpanel Engage
mixpanel.people.set("billybob", {
    $first_name: "Billy",
    $last_name: "Bob",
    $created: (new Date('jan 1 2013')).toISOString(),
    plan: "premium",
    games_played: 1,
    points: 0
});

// create or update a user in Mixpanel Engage without altering $last_seen
// - pass option `$ignore_time: true` to prevent the $last_seen property from being updated
mixpanel.people.set("billybob", {
    plan: "premium",
    games_played: 1
}, {
    $ignore_time: true
});

// set a single property on a user
mixpanel.people.set("billybob", "plan", "free");

// set a single property on a user, don't override
mixpanel.people.set_once("billybob", "first_game_play", (new Date('jan 1 2013')).toISOString());

// increment a numeric property
mixpanel.people.increment("billybob", "games_played");

// increment a numeric property by a different amount
mixpanel.people.increment("billybob", "points", 15);

// increment multiple properties
mixpanel.people.increment("billybob", {"points": 10, "games_played": 1});

// append value to a list
mixpanel.people.append("billybob", "awards", "Great Player");

// append multiple values to a list
mixpanel.people.append("billybob", {"awards": "Great Player", "levels_finished": "Level 4"});

// record a transaction for revenue analytics
mixpanel.people.track_charge("billybob", 39.99);

// clear a users transaction history
mixpanel.people.clear_charges("billybob");

// delete a user
mixpanel.people.delete_user("billybob");

// all functions that send data to mixpanel take an optional
// callback as the last argument
mixpanel.track("test", function(err) { if (err) { throw err; } });

// import an old event
var mixpanel_importer = Mixpanel.init('valid mixpanel token', {
    key: "valid api key for project"
});
mixpanel_importer.set_config({ debug: true });

// needs to be in the system once for it to show up in the interface
mixpanel_importer.track('old event', { gender: '' });

mixpanel_importer.import("old event", new Date(2012, 4, 20, 12, 34, 56), {
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
