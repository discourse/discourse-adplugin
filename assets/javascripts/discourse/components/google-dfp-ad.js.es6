import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import {
  default as computed,
  on
} from "ember-addons/ember-computed-decorators";
import loadScript from "discourse/lib/load-script";

let _loaded = false,
  _promise = null,
  ads = {},
  nextSlotNum = 1;

function getNextSlotNum() {
  return nextSlotNum++;
}

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
  let final = value.replace(/ /g, "");
  final = final.replace(/['"]+/g, "");
  final = final.split(",");
  return final;
}

// This creates an array for the key of the custom targeting key
function keyParse(word) {
  let key = word;
  key = key.replace(/['"]+/g, "");
  key = key.split("\n");
  return key;
}

// This should call adslot.setTargeting(key for that location, value for that location)
function custom_targeting(key_array, value_array, adSlot) {
  for (var i = 0; i < key_array.length; i++) {
    if (key_array[i]) {
      adSlot.setTargeting(key_array[i], valueParse(value_array[i]));
    }
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

function defineSlot(divId, placement, settings, isMobile, categoryTarget) {
  if (!settings.dfp_publisher_id) {
    return;
  }

  if (ads[divId]) {
    return ads[divId];
  }

  let ad, config, publisherId;
  let size = getWidthAndHeight(placement, settings, isMobile);

  if (isMobile) {
    publisherId = settings.dfp_publisher_id_mobile || settings.dfp_publisher_id;
    config = MOBILE_SETTINGS[placement];
  } else {
    publisherId = settings.dfp_publisher_id;
    config = DESKTOP_SETTINGS[placement];
  }

  ad = window.googletag.defineSlot(
    "/" + publisherId + "/" + settings[config.code],
    [size.width, size.height],
    divId
  );

  custom_targeting(
    keyParse(settings[config.targeting_keys]),
    keyParse(settings[config.targeting_values]),
    ad
  );

  if (categoryTarget) {
    ad.setTargeting("discourse-category", categoryTarget);
  }

  ad.addService(window.googletag.pubads());

  ads[divId] = { ad: ad, width: size.width, height: size.height };
  return ads[divId];
}

function destroySlot(divId) {
  if (ads[divId] && window.googletag) {
    window.googletag.destroySlots([ads[divId].ad]);
    delete ads[divId];
  }
}

function loadGoogle() {
  /**
   * Refer to this article for help:
   * https://support.google.com/admanager/answer/4578089?hl=en
   */

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
      // eslint-disable-next-line no-console
      console.log("googletag is undefined!");
    }

    window.googletag.cmd.push(function() {
      // Infinite scroll requires SRA:
      window.googletag.pubads().enableSingleRequest();

      // we always use refresh() to fetch the ads:
      window.googletag.pubads().disableInitialLoad();

      window.googletag.enableServices();
    });
  });

  window.googletag = window.googletag || { cmd: [] };

  return _promise;
}

export default AdComponent.extend({
  classNameBindings: ["adUnitClass"],
  classNames: ["google-dfp-ad"],
  loadedGoogletag: false,
  refreshOnChange: null,

  @computed(
    "siteSettings.dfp_publisher_id",
    "siteSettings.dfp_publisher_id_mobile",
    "site.mobileView"
  )
  publisherId(globalId, mobileId, isMobile) {
    if (isMobile) {
      return mobileId || globalId;
    } else {
      return globalId;
    }
  },

  @computed("placement", "postNumber")
  divId(placement, postNumber) {
    let slotNum = getNextSlotNum();
    if (postNumber) {
      return `div-gpt-ad-${slotNum}-${placement}-${postNumber}`;
    } else {
      return `div-gpt-ad-${slotNum}-${placement}`;
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

  @computed(
    "publisherId",
    "showToTrustLevel",
    "showToGroups",
    "showAfterPost",
    "showOnCurrentPage"
  )
  showAd(
    publisherId,
    showToTrustLevel,
    showToGroups,
    showAfterPost,
    showOnCurrentPage
  ) {
    return (
      publisherId &&
      showToTrustLevel &&
      showToGroups &&
      showAfterPost &&
      showOnCurrentPage
    );
  },

  @computed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel && trustLevel > this.siteSettings.dfp_through_trust_level
    );
  },

  @computed("postNumber")
  showAfterPost(postNumber) {
    if (!postNumber) {
      return true;
    }

    return this.isNthPost(parseInt(this.siteSettings.dfp_nth_post_code));
  },

  @on("didUpdate")
  updated() {
    if (this.get("listLoading")) {
      return;
    }

    let slot = ads[this.get("divId")];
    if (!(slot && slot.ad)) {
      return;
    }

    let ad = slot.ad,
      categorySlug = this.get("currentCategorySlug");

    if (this.get("loadedGoogletag")) {
      window.googletag.cmd.push(function() {
        ad.setTargeting("discourse-category", categorySlug || "0");
        window.googletag.pubads().refresh([ad]);
      });
    }
  },

  @on("didInsertElement")
  _initGoogleDFP() {
    if (!this.get("showAd")) {
      return;
    }

    let self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set("loadedGoogletag", true);
      window.googletag.cmd.push(function() {
        let slot = defineSlot(
          self.get("divId"),
          self.get("placement"),
          self.siteSettings,
          self.site.mobileView,
          self.get("currentCategorySlug") || "0"
        );
        if (slot && slot.ad) {
          // Display has to be called before refresh
          // and after the slot div is in the page.
          window.googletag.display(self.get("divId"));
          window.googletag.pubads().refresh([slot.ad]);
        }
      });
    });
  },

  willRender() {
    this._super(...arguments);

    if (!this.get("showAd")) {
      return;
    }

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
