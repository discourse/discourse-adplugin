import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import loadScript from "discourse/lib/load-script";

let _loaded = false,
  _promise = null,
  renderCounts = {},
  publisher_id = Discourse.SiteSettings.adsense_publisher_code;

function parseAdWidth(value) {
  if (value === "responsive") {
    return "auto";
  }
  if (value.startsWith("fluid")) {
    return "fluid";
  }
  const w = parseInt(value.substring(0, 3).trim(), 10);
  if (isNaN(w)) {
    return "auto";
  } else {
    return `${w}px`;
  }
}

function parseAdHeight(value) {
  if (value === "responsive") {
    return "auto";
  }
  if (value.startsWith("fluid")) {
    return "fluid";
  }
  const h = parseInt(value.substring(4, 7).trim(), 10);
  if (isNaN(h)) {
    return "auto";
  } else {
    return `${h}px`;
  }
}

function loadAdsense() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  const adsenseSrc =
    ("https:" === document.location.protocol ? "https:" : "http:") +
    "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  _promise = loadScript(adsenseSrc, { scriptTag: true }).then(function () {
    _loaded = true;
  });

  return _promise;
}

const DESKTOP_SETTINGS = {
  "topic-list-top": {
    code: "adsense_topic_list_top_code",
    sizes: "adsense_topic_list_top_ad_sizes",
  },
  "topic-above-post-stream": {
    code: "adsense_topic_above_post_stream_code",
    sizes: "adsense_topic_above_post_stream_ad_sizes",
  },
  "topic-above-suggested": {
    code: "adsense_topic_above_suggested_code",
    sizes: "adsense_topic_above_suggested_ad_sizes",
  },
  "post-bottom": {
    code: "adsense_post_bottom_code",
    sizes: "adsense_post_bottom_ad_sizes",
  },
};

const MOBILE_SETTINGS = {
  "topic-list-top": {
    code: "adsense_mobile_topic_list_top_code",
    sizes: "adsense_mobile_topic_list_top_ad_size",
  },
  "topic-above-post-stream": {
    code: "adsense_mobile_topic_above_post_stream_code",
    sizes: "adsense_mobile_topic_above_post_stream_ad_size",
  },
  "topic-above-suggested": {
    code: "adsense_mobile_topic_above_suggested_code",
    sizes: "adsense_mobile_topic_above_suggested_ad_size",
  },
  "post-bottom": {
    code: "adsense_mobile_post_bottom_code",
    sizes: "adsense_mobile_post_bottom_ad_size",
  },
};

export default AdComponent.extend({
  classNameBindings: [
    ":google-adsense",
    "classForSlot",
    "isResponsive:adsense-responsive",
  ],
  loadedGoogletag: false,

  publisher_id: publisher_id,
  ad_width: null,
  ad_height: null,

  adRequested: false,

  init() {
    let config, size;
    const placement = this.get("placement");

    if (this.site.mobileView) {
      config = MOBILE_SETTINGS[placement];
    } else {
      config = DESKTOP_SETTINGS[placement];
    }

    if (!renderCounts[placement]) {
      renderCounts[placement] = 0;
    }

    const sizes = (this.siteSettings[config.sizes] || "").split("|");

    if (sizes.length === 1) {
      size = sizes[0];
    } else {
      size = sizes[renderCounts[placement] % sizes.length];
      renderCounts[placement] += 1;
    }

    this.set("ad_width", parseAdWidth(size));
    this.set("ad_height", parseAdHeight(size));
    this.set("ad_code", this.siteSettings[config.code]);
    this._super();
  },

  _triggerAds() {
    if (Ember.testing) {
      return; // Don't load external JS during tests
    }

    this.set("adRequested", true);
    loadAdsense().then(function () {
      const adsbygoogle = window.adsbygoogle || [];

      try {
        adsbygoogle.push({}); // ask AdSense to fill one ad unit
      } catch (ex) {}
    });
  },

  didInsertElement() {
    this._super();

    if (!this.get("showAd")) {
      return;
    }

    if (this.get("listLoading")) {
      return;
    }

    Ember.run.scheduleOnce("afterRender", this, this._triggerAds);
  },

  @observes("listLoading")
  waitForLoad() {
    if (this.get("adRequested")) {
      return;
    } // already requested that this ad unit be populated
    if (!this.get("listLoading")) {
      Ember.run.scheduleOnce("afterRender", this, this._triggerAds);
    }
  },

  @discourseComputed("ad_width")
  isResponsive(adWidth) {
    return ["auto", "fluid"].includes(adWidth);
  },

  @discourseComputed("ad_width")
  isFluid(adWidth) {
    return adWidth === "fluid";
  },

  @discourseComputed("placement", "showAd")
  classForSlot(placement, showAd) {
    return showAd ? `adsense-${placement}`.htmlSafe() : "";
  },

  @discourseComputed("isResponsive", "isFluid")
  autoAdFormat(isResponsive, isFluid) {
    return isResponsive
      ? isFluid
        ? "fluid".htmlSafe()
        : "auto".htmlSafe()
      : false;
  },

  @discourseComputed("ad_width", "ad_height", "isResponsive")
  adWrapperStyle(w, h, isResponsive) {
    return (isResponsive ? "" : `width: ${w}; height: ${h};`).htmlSafe();
  },

  @discourseComputed("adWrapperStyle", "isResponsive")
  adInsStyle(adWrapperStyle, isResponsive) {
    return `display: ${
      isResponsive ? "block" : "inline-block"
    }; ${adWrapperStyle}`.htmlSafe();
  },

  @discourseComputed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel && trustLevel > this.siteSettings.adsense_through_trust_level
    );
  },

  @discourseComputed(
    "showToTrustLevel",
    "showToGroups",
    "showAfterPost",
    "showOnCurrentPage"
  )
  showAd(showToTrustLevel, showToGroups, showAfterPost, showOnCurrentPage) {
    return (
      this.siteSettings.adsense_publisher_code &&
      showToTrustLevel &&
      showToGroups &&
      showAfterPost &&
      showOnCurrentPage
    );
  },

  @discourseComputed("postNumber")
  showAfterPost(postNumber) {
    if (!postNumber) {
      return true;
    }

    return this.isNthPost(
      parseInt(this.siteSettings.adsense_nth_post_code, 10)
    );
  },
});
