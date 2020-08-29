// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name mixpanel-jslib-2.2-snippet.min.js
// ==/ClosureCompiler==

/** @define {string} */
var MIXPANEL_LIB_URL = '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';

(function(document, mixpanel) {
    // Only stub out if this is the first time running the snippet.
    if (!mixpanel['__SV']) {
        var win = window;

        // grab the hash params for ce editor immediately in case
        // host website changes hash after init
        try {
          var getHashParam, matches, state, loc = win.location, hash = loc.hash;
          getHashParam = function(hash, param) {
              matches = hash.match(new RegExp(param + '=([^&]*)'));
              return matches ? matches[1] : null;
          };
          if (hash && getHashParam(hash, 'state')) {
              state = JSON.parse(decodeURIComponent(getHashParam(hash, 'state')));
              if (state['action'] === 'mpeditor') {
                win.sessionStorage.setItem('_mpcehash', hash);
                history.replaceState(state['desiredHash'] || '', document.title, loc.pathname + loc.search); // remove ce editor hash
              }
          }
        } catch (e) {}

        var script, first_script, gen_fn, functions, i, lib_name = "mixpanel";
        window[lib_name] = mixpanel;

        mixpanel['_i'] = [];

        mixpanel['init'] = function (token, config, name) {
            // support multiple mixpanel instances
            var target = mixpanel;
            if (typeof(name) !== 'undefined') {
                target = mixpanel[name] = [];
            } else {
                name = lib_name;
            }

            // Pass in current people object if it exists
            target['people'] = target['people'] || [];
            target['toString'] = function(no_stub) {
                var str = lib_name;
                if (name !== lib_name) {
                    str += "." + name;
                }
                if (!no_stub) {
                    str += " (stub)";
                }
                return str;
            };
            target['people']['toString'] = function() {
                // 1 instead of true for minifying
                return target.toString(1) + ".people (stub)";
            };

            function _set_and_defer(target, fn) {
                var split = fn.split(".");
                if (split.length == 2) {
                    target = target[split[0]];
                    fn = split[1];
                }
                target[fn] = function() {
                    target.push([fn].concat(Array.prototype.slice.call(arguments, 0)));
                };
            }

            // create shallow clone of the public mixpanel interface
            // Note: only supports 1 additional level atm, e.g. mixpanel.people.set, not mixpanel.people.set.do_something_else.
            functions = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(' ');
            for (i = 0; i < functions.length; i++) {
                _set_and_defer(target, functions[i]);
            }

            // special case for get_group(): chain method calls like mixpanel.get_group('foo', 'bar').unset('baz')
            var group_functions = "set set_once union unset remove delete".split(' ');
            target['get_group'] = function() {
                var mock_group = {};

                var call1_args = arguments;
                var call1 = ['get_group'].concat(Array.prototype.slice.call(call1_args, 0));

                function _set_and_defer_chained(fn_name) {
                    mock_group[fn_name] = function() {
                        call2_args = arguments;
                        call2 = [fn_name].concat(Array.prototype.slice.call(call2_args, 0));
                        target.push([call1, call2]);
                    };
                }
                for (var i = 0; i < group_functions.length; i++) {
                    _set_and_defer_chained(group_functions[i]);
                }
                return mock_group;
            };

            // register mixpanel instance
            mixpanel['_i'].push([token, config, name]);
        };

        // Snippet version, used to fail on new features w/ old snippet
        mixpanel['__SV'] = 1.2;

        script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;

        if (typeof MIXPANEL_CUSTOM_LIB_URL !== 'undefined') {
            script.src = MIXPANEL_CUSTOM_LIB_URL;
        } else if (document.location.protocol === 'file:' && MIXPANEL_LIB_URL.match(/^\/\//)) {
            script.src = 'https:' + MIXPANEL_LIB_URL;
        } else {
            script.src = MIXPANEL_LIB_URL;
        }

        first_script = document.getElementsByTagName("script")[0];
        first_script.parentNode.insertBefore(script, first_script);
    }
// Pass in current Mixpanel object if it exists (for ppl like Optimizely)
})(document, window['mixpanel'] || []);
