import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad_component";
import {
  default as computed,
  observes,
  on
} from "ember-addons/ember-computed-decorators";
import loadScript from "discourse/lib/load-script";

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
  var final = value.replace(/ /g, "");
  final = final.replace(/['"]+/g, "");
  final = final.split(",");
  return final;
}

// This creates an array for the key of the custom targeting key
function keyParse(word) {
  var key = word;
  key = key.replace(/['"]+/g, "");
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

const DESKTOP_SETTINGS = {
  "topic-list-top": {
    code: "dfp_topic_list_top_code",
    sizes: "dfp_topic_list_top_ad_sizes",
    targeting_keys: "dfp_target_topic_list_top_key_code",
    targeting_values: "dfp_target_topic_list_top_value_code"
  },
  "topic-above-post-stream": {
    code: "dfp_topic_above_post_stream_code",
    sizes: "dfp_topic_above_post_stream_ad_sizes",
    targeting_keys: "dfp_target_topic_above_post_stream_key_code",
    targeting_values: "dfp_target_topic_above_post_stream_value_code"
  },
  "topic-above-suggested": {
    code: "dfp_topic_above_suggested_code",
    sizes: "dfp_topic_above_suggested_ad_sizes",
    targeting_keys: "dfp_target_topic_above_suggested_key_code",
    targeting_values: "dfp_target_topic_above_suggested_value_code"
  },
  "post-bottom": {
    code: "dfp_post_bottom_code",
    sizes: "dfp_post_bottom_ad_sizes",
    targeting_keys: "dfp_target_post_bottom_key_code",
    targeting_values: "dfp_target_post_bottom_value_code"
  }
};

const MOBILE_SETTINGS = {
  "topic-list-top": {
    code: "dfp_mobile_topic_list_top_code",
    sizes: "dfp_mobile_topic_list_top_ad_sizes",
    targeting_keys: "dfp_target_topic_list_top_key_code",
    targeting_values: "dfp_target_topic_list_top_value_code"
  },
  "topic-above-post-stream": {
    code: "dfp_mobile_topic_above_post_stream_code",
    sizes: "dfp_mobile_topic_above_post_stream_ad_sizes",
    targeting_keys: "dfp_target_topic_above_post_stream_key_code",
    targeting_values: "dfp_target_topic_above_post_stream_value_code"
  },
  "topic-above-suggested": {
    code: "dfp_mobile_topic_above_suggested_code",
    sizes: "dfp_mobile_topic_above_suggested_ad_sizes",
    targeting_keys: "dfp_target_topic_above_suggested_key_code",
    targeting_values: "dfp_target_topic_above_suggested_value_code"
  },
  "post-bottom": {
    code: "dfp_mobile_post_bottom_code",
    sizes: "dfp_mobile_post_bottom_ad_sizes",
    targeting_keys: "dfp_target_post_bottom_key_code",
    targeting_values: "dfp_target_post_bottom_value_code"
  }
};

function getWidthAndHeight(placement, settings, isMobile) {
  let config;

  if (isMobile) {
    config = MOBILE_SETTINGS[placement];
  } else {
    config = DESKTOP_SETTINGS[placement];
  }

  return {
    width: parseInt(splitWidthInt(settings[config.sizes])),
    height: parseInt(splitHeightInt(settings[config.sizes]))
  };
}

function defineSlot(divId, placement, settings, isMobile) {
  if (!settings.dfp_publisher_id) {
    return;
  }

  let ad, config;
  let size = getWidthAndHeight(placement, settings, isMobile);

  if (ads[divId]) {
    return ads[divId];
  }

  if (isMobile) {
    config = MOBILE_SETTINGS[placement];
  } else {
    config = DESKTOP_SETTINGS[placement];
  }

  ad = window.googletag
    .defineSlot(
      "/" + settings.dfp_publisher_id + "/" + settings[config.code],
      [size.width, size.height],
      divId
    )
    .addService(window.googletag.pubads());
  custom_targeting(
    keyParse(settings[config.targeting_keys]),
    keyParse(settings[config.targeting_values]),
    ad
  );

  if (ad) {
    ads[divId] = { ad: ad, width: size.width, height: size.height };
    return ads[divId];
  }
}

function destroySlot(divId) {
  if (ads[divId] && window.googletag) {
    window.googletag.cmd.push(function() {
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
  var dfpSrc =
    ("https:" === document.location.protocol ? "https:" : "http:") +
    "//www.googletagservices.com/tag/js/gpt.js";
  _promise = loadScript(dfpSrc, { scriptTag: true }).then(function() {
    _loaded = true;
    if (window.googletag === undefined) {
      console.log("googletag is undefined!");
    }

    window.googletag.cmd.push(function() {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().disableInitialLoad(); // we always use refresh() to fetch the ads
      window.googletag.enableServices();
    });
  });

  return _promise;
}

export default AdComponent.extend({
  classNameBindings: ["adUnitClass"],
  classNames: ["google-dfp-ad"],
  loadedGoogletag: false,
  refreshOnChange: null,

  @computed("placement", "postNumber")
  divId(placement, postNumber) {
    if (postNumber) {
      return `div-gpt-ad-${placement}-${postNumber}`;
    } else {
      return `div-gpt-ad-${placement}`;
    }
  },

  @computed("placement", "showAd")
  adUnitClass(placement, showAd) {
    return showAd ? `dfp-ad-${placement}` : "";
  },

  @computed("width", "height")
  adWrapperStyle(w, h) {
    return `width: ${w}px; height: ${h}px;`.htmlSafe();
  },

  @computed("width")
  adTitleStyleMobile(w) {
    return `width: ${w}px;`.htmlSafe();
  },

  @computed("showToTrustLevel", "showToGroups")
  showAd(showToTrustLevel, showToGroups) {
    return (
      Discourse.SiteSettings.dfp_publisher_id &&
      showToTrustLevel &&
      showToGroups
    );
  },

  @computed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel &&
      trustLevel > Discourse.SiteSettings.dfp_through_trust_level
    );
  },

  @observes("refreshOnChange")
  refreshAd() {
    var slot = ads[this.get("divId")];
    if (!(slot && slot.ad)) {
      return;
    }

    var self = this,
      ad = slot.ad;

    if (this.get("loadedGoogletag") && this.get("refreshOnChange")) {
      window.googletag.cmd.push(function() {
        ad.setTargeting(
          "discourse-category",
          self.get("category") ? self.get("category") : "0"
        );
        window.googletag.pubads().refresh([ad]);
      });
    }
  },

  @on("didInsertElement")
  _initGoogleDFP() {
    if (!this.get("showAd")) {
      return;
    }

    var self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set("loadedGoogletag", true);
      window.googletag.cmd.push(function() {
        let slot = defineSlot(
          self.get("divId"),
          self.get("placement"),
          self.siteSettings,
          self.site.mobileView
        );
        if (slot && slot.ad) {
          slot.ad.setTargeting(
            "discourse-category",
            self.get("category") ? self.get("category") : "0"
          );
          window.googletag.display(self.get("divId"));
          window.googletag.pubads().refresh([slot.ad]);
        }
      });
    });
  },

  willRender() {
    this._super(...arguments);
    let size = getWidthAndHeight(
      this.get("placement"),
      this.siteSettings,
      this.site.mobileView
    );
    this.set("width", size.width);
    this.set("height", size.height);
  },

  @on("willDestroyElement")
  cleanup() {
    destroySlot(this.get("divId"));
  }
});
