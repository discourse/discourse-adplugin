import loadScript from 'discourse/lib/load-script';
//import PageTracker from 'discourse/lib/page-tracker';

var const_width = '';
var const_height = '';

var _loaded = false,
    _promise = null;

function splitWidthInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

function splitHeightInt(value) {
    var str = value.substring(4, 7);
    return str.trim();
}

// Coaches Note!  
// Background: We want to call on google.setTargeting using googletag.bar so that we can can take in inputs from users (key and value) for custom targeting.
// Look at 26 - 55 which should call on googletag.setTargeting.
// Error is occuring on link 49 which is returning "Uncaught ReferenceError: setTargeting is not defined"

// This creates an array for the values of the custom targeting key
function valueParse(value) {
  var final = value.replace(/ /g,'');
  final = final.replace(/['"]+/g, '');
  final = final.split(',');
  return final;
}

// This creates an array for the key of the custom targeting key
function keyParse(word) {
  var key = word;
  key = key.replace(/['"]+/g, '');
  key = key.split("\n");
  return key; 
}

// This sets the key and value for custom targeting
var Foo = function(key, value, googletag) {
  this.locationKey = key;
  this.locationValue = value;
  this.googletag = googletag;
}

// setTargeting is not defined.  We want to return as a method - PROBLEM 1
Foo.prototype.bar = function() {
  return this.googletag.setTargeting(this.locationKey, this.locationValue);
}

// This should call googletag.setTargeting(key for that location, value for that location)
function custom_targeting(key_array, value_array) {
  var i = 0;
  while (i < key_array.length) {
    var custom_values = [];
    var wordValue = valueParse(value_array[i])
    var f = new Foo(key_array[i], wordValue, googletag);
    f.bar();
    i++;
  }
}

// END of Coaches Note

// splitting values 
/*var custom_values = [];
var word = keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_value_code);
var wordValue;
for (var i = 0; i < word.length; i++) {
  wordValue = valueParse(word[i]);
  custom_values.push(wordValue);
}*/


//PageTracker.current().on('change', function(url) {
function loadGoogle(settings) {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  // The boilerplate code
  var dfpSrc = (('https:' == document.location.protocol) ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
  _promise = loadScript(dfpSrc, { scriptTag: true }).then(function() {
    _loaded = true;
    if (window.googletag === undefined) {
      console.log('googletag is undefined!');
    }

    googletag.cmd.push(function() {
      if (settings.dfp_topic_list_top_code && !settings.dfp_show_topic_list_top && settings.topic_list_top_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_list_top_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_list_top_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          googletag.defineSlot(settings.dfp_topic_list_top_code, [320,50], 'div-gpt-ad-topic-list-top').addService(googletag.pubads());
        }
        else {
          googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_list_top_code, [parseInt(splitWidthInt(settings.topic_list_top_ad_sizes)), parseInt(splitHeightInt(settings.topic_list_top_ad_sizes))], 'div-gpt-ad-topic-list-top')
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_value_code)))
          googletag.addService(googletag.pubads());
        }
      }
      if (settings.dfp_topic_above_post_stream_code && !settings.dfp_show_topic_above_post_stream && settings.topic_above_post_stream_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_above_post_stream_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_above_post_stream_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          googletag.defineSlot(settings.dfp_topic_above_post_stream_code, [320,50], 'div-gpt-ad-topic-above-post-stream').addService(googletag.pubads());
        }
        else {
          googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_post_stream_code, [parseInt(splitWidthInt(settings.topic_above_post_stream_ad_sizes)), parseInt(splitHeightInt(settings.topic_above_post_stream_ad_sizes))], 'div-gpt-ad-topic-above-post-stream')
          .setTargeting(settings.dfp_target_topic_above_post_stream_key_code, valueParse(settings.dfp_target_topic_above_post_stream_value_code))
          // This hardcoded code works: .setTargeting('category', ["clothes", "handbags", "makeup"])
          .addService(googletag.pubads());       
        }
      }
      if (settings.dfp_topic_above_suggested_code && !settings.dfp_show_topic_above_suggested && settings.topic_above_suggested_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_above_suggested_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_above_suggested_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          googletag.defineSlot(settings.dfp_topic_above_suggested_code, [320,50], 'div-gpt-ad-topic-above-suggested').addService(googletag.pubads());
        }
        else {
          googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_suggested_code, [parseInt(splitWidthInt(settings.topic_above_suggested_ad_sizes)), parseInt(splitHeightInt(settings.topic_above_suggested_ad_sizes))], 'div-gpt-ad-topic-above-suggested')
          
          googletag.setTargeting(settings.dfp_target_topic_above_suggested_key_code, valueParse(settings.dfp_target_topic_above_suggested_value_code))
          // This hardcoded code works: .setTargeting('category', ["clothes", "handbags", "makeup"])
          googletag.addService(googletag.pubads());
        }
      }
      if (settings.dfp_post_bottom_code && !settings.dfp_show_post_bottom && settings.post_bottom_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.post_bottom_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.post_bottom_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          googletag.defineSlot(settings.dfp_post_bottom_code, [320,50], 'div-gpt-ad-post-bottom').addService(googletag.pubads());
        }
        else {
          googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_post_bottom_code, [parseInt(splitWidthInt(settings.post_bottom_ad_sizes)), parseInt(splitHeightInt(settings.post_bottom_ad_sizes))], 'div-gpt-ad-post-bottom')
          .setTargeting(settings.dfp_target_post_bottom_key_code, valueParse(settings.dfp_target_post_bottom_value_code))
          // This hardcoded code works: .setTargeting('category', ["clothes", "handbags", "makeup"])
          .addService(googletag.pubads());        
        }
      }

    // Page Level custom targeting goes here - needs an input section and also ad tags on the relevant pages      
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
  });

  return _promise;
}


// Ember component - the class is the adblock and css
export default Ember.Component.extend({
  const_width: const_width,
  const_height: const_height,

  classNames: ['google-dfp-ad'],
  loadedGoogletag: false,

  // Part of the divID of the div part of the GPT
  divId: function() {
    return "div-gpt-ad-" + this.get('placement');
  }.property('placement'),

  adWrapperStyle: function() {
    return `width: ${this.get('const_width')}px; height: ${this.get('const_height')}px;`.htmlSafe();
  }.property('const_width', 'const_height'),

  adWrapperStyleMobile: function() {
    return `width: 320px; height: 50px;`.htmlSafe();
  },

  _initGoogleDFP: function() {
    var self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set('loadedGoogletag', true);
    });
  }.on('didInsertElement')
});
