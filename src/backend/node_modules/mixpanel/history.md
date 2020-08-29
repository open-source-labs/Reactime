0.10.3 / 2019-10-09
==================
* upgrade https-proxy-agent for security fix (thanks omrilotan)

0.10.2 / 2019-03-26
==================
* type definitions for people.unset (thanks bradleyayers)

0.10.1 / 2018-12-03
==================
* support configurable API path (thanks CameronDiver)

0.9.2 / 2018-05-22
==================
* add type declarations file (thanks mklopets)

0.9.1 / 2018-04-12
==================
* upgrade https-proxy-agent for security fix

0.9.0 / 2018-02-09
==================
* default to tracking over HTTPS (thanks jhermsmeier)

0.8.0 / 2017-11-28
==================
* upgraded node-https-proxy-agent to v2.1.1 for security patch (see
https://github.com/TooTallNate/node-https-proxy-agent/issues/37)

0.7.0 / 2017-04-07
===================
* added `track_batch` for tracking multiple recent events per request (thanks cruzanmo)
* support for routing requests through proxy server specified in env var `HTTPS_PROXY`
or `HTTP_PROXY` (thanks colestrode)
* dropped support for node 0.10 and 0.12

0.6.0 / 2017-01-03
===================
* support for `time` field in `mixpanel.track()` (thanks cruzanmo)

0.5.0 / 2016-09-15
===================
* optional https support (thanks chiangf)

0.4.1 / 2016-09-09
===================
* include `$ignore_alias` in permitted `people` modifiers (thanks Left47)

0.4.0 / 2016-02-09
===================
* allow optional `modifiers` in all `people` calls for `$ignore_time`, `$ip`,
  and `$time` fields

0.3.2 / 2015-12-10
===================
* correct `$delete` field in `people.delete_user` request (thanks godspeedelbow)

0.3.1 / 2015-08-06
===================
* added config option for API host (thanks gmichael225)

0.3.0 / 2015-08-06
===================
* added people.union support (thanks maeldur)

0.2.0 / 2015-04-14
===================
* added batch import support

0.1.1 / 2015-03-27
===================
* fixed callback behavior in track_charges when no properties supplied
(thanks sorribas)

0.1.0 / 2015-03-20
===================
* updated URL metadata (thanks freeall)
* updated dev dependencies
* added builds for iojs, node 0.12, dropped support for node <0.10

0.0.20 / 2014-05-11
====================
* removed hardcoded port 80 for more flexibility (thanks zeevl)

0.0.19 / 2014.04.03
====================
* added people.append (thanks jylauril)

0.0.18 / 2013-08-23
====================
* added callback to alias (thanks to sandinmyjoints)
* added verbose config option (thanks to sandinmyjoints)
* added unset method (thanks to lukapril)

0.0.17 / 2013-08-12
====================
* added alias method (thanks to PierrickP)

0.0.16 / 2013-06-29
====================
* allow special key "ip" to be 0 in people.set (thanks to wwlinx)

0.0.15 / 2013-05-24
====================
* adds set once functionality to people (thanks to avoid3d)
* $ignore_time in people.set (thanks to Rick Cotter)

0.0.14 / 2013-03-28
====================
* revert Randal's http only patch since Mixpanel indeed supports https.
* handles the ip property in a property object properly for people calls

0.0.13 / 2013-03-25
====================
* force requests to go over http [reverted in 0.0.14]

0.0.12 / 2013-01-24
====================
* track_charge() no longer includes $time by default, rather it lets
Mixpanel's servers set the time when they receive the transaction.  This
doesn't modify the ability for the user to pass in their own $time (for
importing transactions).

0.0.11 / 2013-01-11
====================
* added track_charge() method which provides the ability to record user
transactions for revenue analytics.
* added clear_charges() method which provides the ability to remove a
users transactions from Mixpanel
* added tests for delete_user()

0.0.10 / 2012-11-26
====================
* added import() method which provides the ability to import events
older than 5 days.  Contributions from Thomas Watson Steen.

0.0.9 / 2012-11-15
===================
* removed time from properties sent to server.  This is to ensure that
UTC is always used.  Mixpanel will set the correct time as soon as they
receive the event.

0.0.8 / 2012-10-24
===================
* added mp_lib property, so people can segment by library

0.0.7 / 2012-01-05
===================
* added unit tests
* people.increment() only prints error message if debug is true

0.0.6 / 2012-01-01
===================
* added engage support
  * people.set()
  * people.increment()
  * people.delete_user()
* deprecated old constructor: require("mixpanel").Client(token)
* added new constructor: require("mixpanel").init(token)
