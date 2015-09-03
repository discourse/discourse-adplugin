import loadScript from 'discourse/lib/load-script';
//import PageTracker from 'discourse/lib/page-tracker';

var const_width = '';
var const_height = '';
var const_mobile_width = 320;
var const_mobile_height = 50;
var currentUser = Discourse.User.current();

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
      function custom_targeting(key_array, value_array, location) {
        var f;
        for (var i = 0; i < key_array.length; i++) {
          var wordValue = valueParse(value_array[i]);
          f = new Foo(key_array[i], wordValue, location);  
          f.bar();
        }
      }

      if (settings.dfp_topic_list_top_code && !settings.dfp_show_topic_list_top && settings.topic_list_top_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_list_top_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_list_top_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          var topic_list_top_mobile = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_list_top_code, [320,50], 'div-gpt-ad-topic-list-top').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_value_code)), topic_list_top_mobile)
        }
        else {   
          var topic_list_top = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_list_top_code, [parseInt(splitWidthInt(Discourse.SiteSettings.topic_list_top_ad_sizes)), parseInt(splitHeightInt(Discourse.SiteSettings.topic_list_top_ad_sizes))], 'div-gpt-ad-topic-list-top').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_value_code)), topic_list_top)
        }
      }
      if (settings.dfp_topic_above_post_stream_code && !settings.dfp_show_topic_above_post_stream && settings.topic_above_post_stream_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_above_post_stream_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_above_post_stream_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          var topic_above_post_stream_mobile = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_post_stream_code, [320,50], 'div-gpt-ad-topic-above-post-stream').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_above_post_stream_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_above_post_stream_value_code)), topic_above_post_stream_mobile)
        }
        else {
          var topic_above_post_stream = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_post_stream_code, [parseInt(splitWidthInt(Discourse.SiteSettings.topic_above_post_stream_top_ad_sizes)), parseInt(splitHeightInt(Discourse.SiteSettings.topic_above_post_stream_ad_sizes))], 'div-gpt-ad-topic-above-post-stream').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_above_post_stream_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_above_post_stream_value_code)), topic_above_post_stream)
        }
      }
      if (settings.dfp_topic_above_suggested_code && !settings.dfp_show_topic_above_suggested && settings.topic_above_suggested_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_above_suggested_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_above_suggested_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          var topic_above_suggested_mobile = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_suggested_code, [320,50], 'div-gpt-ad-topic-above-suggested').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_above_suggested_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_above_suggested_value_code)), topic_above_suggested_mobile)
        }
        else {
          var topic_above_suggested = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_suggested_code, [parseInt(splitWidthInt(Discourse.SiteSettings.topic_above_suggested_ad_sizes)), parseInt(splitHeightInt(Discourse.SiteSettings.topic_above_suggested_ad_sizes))], 'div-gpt-ad-topic-above-suggested').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_above_suggested_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_topic_above_suggested_value_code)), topic_above_suggested)
        }
      }
      if (settings.dfp_post_bottom_code && !settings.dfp_show_post_bottom && settings.post_bottom_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.post_bottom_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.post_bottom_ad_sizes));
        if (Discourse.Mobile.mobileView) {
          var post_bottom_mobile = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_post_bottom_code, [320,50], 'div-gpt-ad-post-bottom').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_post_bottom_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_post_bottom_value_code)), post_bottom_mobile)
        }
        else {
          var post_bottom = googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_post_bottom_code, [parseInt(splitWidthInt(Discourse.SiteSettings.post_bottom_ad_sizes)), parseInt(splitHeightInt(Discourse.SiteSettings.post_bottom_ad_sizes))], 'div-gpt-ad-post-bottom').addService(googletag.pubads());
          custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_post_bottom_key_code)), (keyParse(Discourse.SiteSettings.dfp_target_post_bottom_value_code)), post_bottom)
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
  const_mobile_width: const_mobile_width,
  const_mobile_height: const_mobile_height,

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
    return `width: ${this.get('const_mobile_width')}px; height: ${this.get('const_mobile_height')}px;`.htmlSafe();
  }.property('const_mobile_width', 'const_mobile_height'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.dfp_through_trust_level));
  }.property('trust_level'),

  _initGoogleDFP: function() {
    var self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set('loadedGoogletag', true);
    });
  }.on('didInsertElement')
});
