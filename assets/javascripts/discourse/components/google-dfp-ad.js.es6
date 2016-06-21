import loadScript from 'discourse/lib/load-script';

var currentUser = Discourse.User.current(),
    _loaded = false,
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

function defineSlot(divId, placement, settings, isMobile) {
  var ad, width, height;

  if (ads[divId]) {
    return ads[divId];
  }

  if (placement === "topic-list-top" && settings.dfp_topic_list_top_code && settings.dfp_topic_list_top_ad_sizes) {
    if (isMobile) {
      width = parseInt(splitWidthInt(settings.dfp_mobile_topic_list_top_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_mobile_topic_list_top_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_list_top_code, [width,height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(Discourse.SiteSettings.dfp_target_topic_list_top_key_code)), (keyParse(settings.dfp_target_topic_list_top_value_code)), ad);
    } else {
      width = parseInt(splitWidthInt(settings.dfp_topic_list_top_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_topic_list_top_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_list_top_code, [width, height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_topic_list_top_key_code)), (keyParse(settings.dfp_target_topic_list_top_value_code)), ad);
    }
  } else if (placement === "topic-above-post-stream" && settings.dfp_topic_above_post_stream_code && settings.dfp_topic_above_post_stream_ad_sizes) {
    if (isMobile) {
      width = parseInt(splitWidthInt(settings.dfp_mobile_topic_above_post_stream_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_mobile_topic_above_post_stream_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_post_stream_code, [width,height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_topic_above_post_stream_key_code)), (keyParse(settings.dfp_target_topic_above_post_stream_value_code)), ad);
    } else {
      width = parseInt(splitWidthInt(settings.dfp_topic_above_post_stream_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_topic_above_post_stream_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_post_stream_code, [width, height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_topic_above_post_stream_key_code)), (keyParse(settings.dfp_target_topic_above_post_stream_value_code)), ad);
    }
  } else if (placement === "topic-above-suggested" && settings.dfp_topic_above_suggested_code && settings.dfp_topic_above_suggested_ad_sizes) {
    if (isMobile) {
      width = parseInt(splitWidthInt(settings.dfp_mobile_topic_above_suggested_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_mobile_topic_above_suggested_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_topic_above_suggested_code, [width,height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_topic_above_suggested_key_code)), (keyParse(settings.dfp_target_topic_above_suggested_value_code)), ad);
    } else {
      width = parseInt(splitWidthInt(settings.dfp_topic_above_suggested_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_topic_above_suggested_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_suggested_code, [width, height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_topic_above_suggested_key_code)), (keyParse(settings.dfp_target_topic_above_suggested_value_code)), ad);
    }
  } else if (placement === "post-bottom" && settings.dfp_post_bottom_code && settings.dfp_post_bottom_ad_sizes) {
    if (isMobile) {
      width = parseInt(splitWidthInt(settings.dfp_mobile_post_bottom_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_mobile_post_bottom_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_mobile_post_bottom_code, [width,height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_post_bottom_key_code)), (keyParse(settings.dfp_target_post_bottom_value_code)), ad);
    } else {
      width = parseInt(splitWidthInt(settings.dfp_post_bottom_ad_sizes));
      height = parseInt(splitHeightInt(settings.dfp_post_bottom_ad_sizes));
      ad = window.googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_post_bottom_code, [width, height], divId).addService(window.googletag.pubads());
      custom_targeting((keyParse(settings.dfp_target_post_bottom_key_code)), (keyParse(settings.dfp_target_post_bottom_value_code)), ad);
    }
  }

  if (ad) {
    ads[divId] = {ad: ad, width: width, height: height};
    return ads[divId];
  }
}

function destroySlot(divId) {
  if (ads[divId] && window.googletag) {
    window.googletag.cmd.push(function(){
      window.googletag.destroySlots([ads[divId].ad]);
      delete ads[divId];
    });
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
  width: 728,
  height: 90,

  classNameBindings: ['adUnitClass'],
  classNames: ['google-dfp-ad'],
  loadedGoogletag: false,
  refreshOnChange: null,

  divId: function() {
    if (this.get('postNumber')) {
      return "div-gpt-ad-" + this.get('placement') + '-' + this.get('postNumber');
    } else {
      return "div-gpt-ad-" + this.get('placement');
    }
  }.property('placement', 'postNumber'),

  adUnitClass: function() {
    return "dfp-ad-" + this.get("placement");
  }.property('placement'),

  adWrapperStyle: function() {
    return `width: ${this.get('width')}px; height: ${this.get('height')}px;`.htmlSafe();
  }.property('width', 'height'),

  adTitleStyleMobile: function() {
    return `width: ${this.get('width')}px;`.htmlSafe();
  }.property('width'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.dfp_through_trust_level));
  }.property('trust_level'),

  refreshAd: function() {
    var slot = ads[this.get('divId')];
    if (!(slot && slot.ad)) { return; }

    var self = this,
        ad = slot.ad;

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
        let slot = defineSlot(self.get('divId'), self.get('placement'), self.siteSettings, self.site.mobileView);
        if (slot && slot.ad) {
          slot.ad.setTargeting('discourse-category', self.get('category') ? self.get('category') : '0');
          self.set('width', slot.width);
          self.set('height', slot.height);
          window.googletag.display(self.get('divId'));
          window.googletag.pubads().refresh([slot.ad]);
        }
      });
    });
  }.on('didInsertElement'),

  cleanup: function() {
    destroySlot(this.get('divId'));
  }.on('willDestroyElement')
});
