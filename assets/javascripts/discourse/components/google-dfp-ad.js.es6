import loadScript from 'discourse/lib/load-script';

var const_width = '';
var const_height = '';
var const_mobile_width = Discourse.SiteSettings.dfp_mobile_ad_width;
var const_mobile_height = Discourse.SiteSettings.dfp_mobile_ad_height;
var currentUser = Discourse.User.current();

var _loaded = false,
  _promise = null,
  ads = {};

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
  var final = value.replace(/ /g, '');
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
var Foo = function(key, value, adslot) {
  this.locationKey = key;
  this.locationValue = value;
  this.adslot = adslot;
};

Foo.prototype.bar = function() {
  if (this.locationKey) {
    this.adslot.setTargeting(this.locationKey, this.locationValue);
  }
};

// This should call adslot.setTargeting(key for that location, value for that location)
function custom_targeting(key_array, value_array, location) {
  var f;
  for (var i = 0; i < key_array.length; i++) {
    var wordValue = valueParse(value_array[i]);
    f = new Foo(key_array[i], wordValue, location);
    f.bar();
  }
}

function defineSlot(placement, settings) {

  if (ads[placement]) {
    return ads[placement];
  }

  if (placement === "topic-list-top" && settings.dfp_topic_list_top_code && settings.dfp_topic_list_top_ad_sizes) {
    const_width = parseInt(splitWidthInt(settings.dfp_topic_list_top_ad_sizes));
    const_height = parseInt(splitHeightInt(settings.dfp_topic_list_top_ad_sizes));
    if (Discourse.Mobile.mobileView) {
      var topic_list_top_mobile = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_list_top_code, [320,50], 'div-gpt-ad-topic-list-top').addService(window.googletag.pubads());
      ads['topic-list-top'] = topic_list_top_mobile;
      custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_key_code)), (keyParse(settings.dfp_target_topic_list_top_value_code)), topic_list_top_mobile);
    } else {
      var topic_list_top = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_list_top_code, [parseInt(splitWidthInt(settings.dfp_topic_list_top_ad_sizes)), parseInt(splitHeightInt(settings.dfp_topic_list_top_ad_sizes))], 'div-gpt-ad-topic-list-top').addService(window.googletag.pubads());
      ads['topic-list-top'] = topic_list_top;
      custom_targeting((keyParse(settings.dfp_target_topic_list_top_key_code)), (keyParse(settings.dfp_target_topic_list_top_value_code)), topic_list_top);
    }

    return ads['topic-list-top'];
  }

  if (placement === "topic-above-post-stream" && settings.dfp_topic_above_post_stream_code && settings.dfp_topic_above_post_stream_ad_sizes) {
    const_width = parseInt(splitWidthInt(settings.dfp_topic_above_post_stream_ad_sizes));
    const_height = parseInt(splitHeightInt(settings.dfp_topic_above_post_stream_ad_sizes));
    if (Discourse.Mobile.mobileView) {
      var topic_above_post_stream_mobile = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_post_stream_code, [320,50], 'div-gpt-ad-topic-above-post-stream').addService(window.googletag.pubads());
      ads['topic-above-post-stream'] = topic_above_post_stream_mobile;
      custom_targeting((keyParse(settings.dfp_target_topic_above_post_stream_key_code)), (keyParse(settings.dfp_target_topic_above_post_stream_value_code)), topic_above_post_stream_mobile);
    }
    else {
      var topic_above_post_stream = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_post_stream_code, [parseInt(splitWidthInt(settings.dfp_topic_above_post_stream_ad_sizes)), parseInt(splitHeightInt(settings.dfp_topic_above_post_stream_ad_sizes))], 'div-gpt-ad-topic-above-post-stream').addService(window.googletag.pubads());
      ads['topic-above-post-stream'] = topic_above_post_stream;
      custom_targeting((keyParse(settings.dfp_target_topic_above_post_stream_key_code)), (keyParse(settings.dfp_target_topic_above_post_stream_value_code)), topic_above_post_stream);
    }

    return ads['topic-above-post-stream'];
  }

  if (placement === "topic-above-suggested" && settings.dfp_topic_above_suggested_code && settings.dfp_topic_above_suggested_ad_sizes) {
    const_width = parseInt(splitWidthInt(settings.dfp_topic_above_suggested_ad_sizes));
    const_height = parseInt(splitHeightInt(settings.dfp_topic_above_suggested_ad_sizes));
    if (Discourse.Mobile.mobileView) {
      var topic_above_suggested_mobile = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_suggested_code, [320,50], 'div-gpt-ad-topic-above-suggested').addService(window.googletag.pubads());
      ads['topic-above-suggested'] = topic_above_suggested_mobile;
      custom_targeting((keyParse(settings.dfp_target_topic_above_suggested_key_code)), (keyParse(settings.dfp_target_topic_above_suggested_value_code)), topic_above_suggested_mobile);
    }
    else {
      var topic_above_suggested = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_suggested_code, [parseInt(splitWidthInt(settings.dfp_topic_above_suggested_ad_sizes)), parseInt(splitHeightInt(settings.dfp_topic_above_suggested_ad_sizes))], 'div-gpt-ad-topic-above-suggested').addService(window.googletag.pubads());
      ads['topic-above-suggested'] = topic_above_suggested;
      custom_targeting((keyParse(settings.dfp_target_topic_above_suggested_key_code)), (keyParse(settings.dfp_target_topic_above_suggested_value_code)), topic_above_suggested);
    }

    return ads['topic-above-suggested'];
  }

  if (placement === "topic-above-footer" && settings.dfp_topic_above_footer_code && settings.dfp_topic_above_footer_ad_sizes) {
    const_width = parseInt(splitWidthInt(settings.dfp_topic_above_footer_ad_sizes));
    const_height = parseInt(splitHeightInt(settings.dfp_topic_above_footer_ad_sizes));
    if (Discourse.Mobile.mobileView) {
      var topic_above_footer_mobile = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_footer_code, [320,50], 'div-gpt-ad-topic-above-footer').addService(window.googletag.pubads());
      ads['topic-above-footer'] = topic_above_footer_mobile;
      custom_targeting((keyParse(settings.dfp_target_topic_above_footer_key_code)), (keyParse(settings.dfp_target_topic_above_footer_value_code)), topic_above_footer_mobile);
    }
    else {
      var topic_above_footer = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_footer_code, [parseInt(splitWidthInt(settings.dfp_topic_above_footer_ad_sizes)), parseInt(splitHeightInt(settings.dfp_topic_above_footer_ad_sizes))], 'div-gpt-ad-topic-above-footer').addService(window.googletag.pubads());
      ads['topic-above-footer'] = topic_above_footer;
      custom_targeting((keyParse(settings.dfp_target_topic_above_footer_key_code)), (keyParse(settings.dfp_target_topic_above_footer_value_code)), topic_above_footer);
    }

    return ads['topic-above-footer'];
  }

  if (placement === "post-bottom" && settings.dfp_post_bottom_code && settings.dfp_post_bottom_ad_sizes) {
    const_width = parseInt(splitWidthInt(settings.dfp_post_bottom_ad_sizes));
    const_height = parseInt(splitHeightInt(settings.dfp_post_bottom_ad_sizes));
    if (Discourse.Mobile.mobileView) {
      var post_bottom_mobile = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_post_bottom_code, [320,50], 'div-gpt-ad-post-bottom').addService(window.googletag.pubads());
      ads['post-bottom'] = post_bottom_mobile;
      custom_targeting((keyParse(settings.dfp_target_post_bottom_key_code)), (keyParse(settings.dfp_target_post_bottom_value_code)), post_bottom_mobile);
    }
    else {
      var post_bottom = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_post_bottom_code, [parseInt(splitWidthInt(settings.dfp_post_bottom_ad_sizes)), parseInt(splitHeightInt(settings.dfp_post_bottom_ad_sizes))], 'div-gpt-ad-post-bottom').addService(window.googletag.pubads());
      ads['post-bottom'] = post_bottom;
      custom_targeting((keyParse(settings.dfp_target_post_bottom_key_code)), (keyParse(settings.dfp_target_post_bottom_value_code)), post_bottom);
    }

    return ads['post-bottom'];
  }
}

function loadGoogle() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  // The boilerplate code
  var dfpSrc = (('https:' === document.location.protocol) ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
  _promise = loadScript(dfpSrc, { scriptTag: true }).then(function() {
    _loaded = true;
    if (window.googletag === undefined) {
      console.log('googletag is undefined!');
    }

    window.googletag.cmd.push(function() {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().disableInitialLoad(); // we always use refresh() to fetch the ads
      window.googletag.enableServices();
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
  refreshOnChange: null,

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

  adTitleStyleMobile: function() {
    return `width: ${this.get('const_mobile_width')}px;`.htmlSafe();
  }.property('const_mobile_width'),

  adTitleStyleMobile: function() {
    return `width: ${this.get('const_mobile_width')}px;`.htmlSafe();
  }.property('const_mobile_width'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.dfp_through_trust_level));
  }.property('trust_level'),

  refreshAd: function() {
    var ad = ads[this.get('placement')];
    if (!ad) {
      return;
    }

    var self = this;

    if (this.get('loadedGoogletag') && this.get('refreshOnChange')) {
      window.googletag.cmd.push(function() {
        ad.setTargeting('discourse-category', self.get('category') ? self.get('category') : '0');
        window.googletag.pubads().refresh([ad]);
      });
    }
  }.observes('refreshOnChange'),

  _initGoogleDFP: function() {
    var self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set('loadedGoogletag', true);
      window.googletag.cmd.push(function() {
        var ad = defineSlot(self.get('placement'), self.siteSettings);
        if (ad) {
          ad.setTargeting('discourse-category', self.get('category') ? self.get('category') : '0');
          window.googletag.display(self.get('divId'));
          window.googletag.pubads().refresh([ad]);
        }
      });
    });
  }.on('didInsertElement')
});
