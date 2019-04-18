import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad_component";
import {
  default as computed,
  observes
} from "ember-addons/ember-computed-decorators";
import loadScript from "discourse/lib/load-script";

let _loaded = false,
  _promise = null,
  currentUser = Discourse.User.current(),
  publisher_id = Discourse.SiteSettings.adsense_publisher_code;

const mobileView = Discourse.Site.currentProp("mobileView");

function parseAdWidth(value) {
  if (value === "responsive") {
    return "auto";
  }
  return `${parseInt(value.substring(0, 3).trim())}px`;
}

function parseAdHeight(value) {
  if (value === "responsive") {
    return "auto";
  }
  return `${parseInt(value.substring(4, 7).trim())}px`;
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
  _promise = loadScript(adsenseSrc, { scriptTag: true }).then(function() {
    _loaded = true;
  });

  return _promise;
}

let data = {
  "topic-list-top": {},
  "topic-above-post-stream": {},
  "topic-above-suggested": {},
  "post-bottom": {}
};

if (Discourse.SiteSettings.adsense_publisher_code) {
  if (!mobileView && Discourse.SiteSettings.adsense_topic_list_top_code) {
    data["topic-list-top"]["ad_code"] =
      Discourse.SiteSettings.adsense_topic_list_top_code;
    data["topic-list-top"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_topic_list_top_ad_sizes
    );
    data["topic-list-top"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_topic_list_top_ad_sizes
    );
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_list_top_code) {
    data["topic-list-top"]["ad_code"] =
      Discourse.SiteSettings.adsense_mobile_topic_list_top_code;
    data["topic-list-top"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_mobile_topic_list_top_ad_size
    );
    data["topic-list-top"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_mobile_topic_list_top_ad_size
    );
  }
  if (
    !mobileView &&
    Discourse.SiteSettings.adsense_topic_above_post_stream_code
  ) {
    data["topic-above-post-stream"]["ad_code"] =
      Discourse.SiteSettings.adsense_topic_above_post_stream_code;
    data["topic-above-post-stream"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes
    );
    data["topic-above-post-stream"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes
    );
  }
  if (
    mobileView &&
    Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_code
  ) {
    data["topic-above-post-stream"]["ad_code"] =
      Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_code;
    data["topic-above-post-stream"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_ad_size
    );
    data["topic-above-post-stream"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_ad_size
    );
  }
  if (
    !mobileView &&
    Discourse.SiteSettings.adsense_topic_above_suggested_code
  ) {
    data["topic-above-suggested"]["ad_code"] =
      Discourse.SiteSettings.adsense_topic_above_suggested_code;
    data["topic-above-suggested"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes
    );
    data["topic-above-suggested"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes
    );
  }
  if (
    mobileView &&
    Discourse.SiteSettings.adsense_mobile_topic_above_suggested_code
  ) {
    data["topic-above-suggested"]["ad_code"] =
      Discourse.SiteSettings.adsense_mobile_topic_above_suggested_code;
    data["topic-above-suggested"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_mobile_topic_above_suggested_ad_size
    );
    data["topic-above-suggested"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_mobile_topic_above_suggested_ad_size
    );
  }
  if (!mobileView && Discourse.SiteSettings.adsense_post_bottom_code) {
    data["post-bottom"]["ad_code"] =
      Discourse.SiteSettings.adsense_post_bottom_code;
    data["post-bottom"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_post_bottom_ad_sizes
    );
    data["post-bottom"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_post_bottom_ad_sizes
    );
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_post_bottom_code) {
    data["post-bottom"]["ad_code"] =
      Discourse.SiteSettings.adsense_mobile_post_bottom_code;
    data["post-bottom"]["ad_width"] = parseAdWidth(
      Discourse.SiteSettings.adsense_mobile_post_bottom_ad_size
    );
    data["post-bottom"]["ad_height"] = parseAdHeight(
      Discourse.SiteSettings.adsense_mobile_post_bottom_ad_size
    );
  }
}

export default AdComponent.extend({
  classNameBindings: [
    ":google-adsense",
    "classForSlot",
    "isResponsive:adsense-responsive"
  ],
  loadedGoogletag: false,

  publisher_id: publisher_id,
  ad_width: null,
  ad_height: null,

  adRequested: false,

  init() {
    this.set("ad_width", data[this.placement]["ad_width"]);
    this.set("ad_height", data[this.placement]["ad_height"]);
    this.set("ad_code", data[this.placement]["ad_code"]);
    this._super();
  },

  _triggerAds() {
    this.set("adRequested", true);
    loadAdsense().then(function() {
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

  @computed("ad_width")
  isResponsive(adWidth) {
    return adWidth === "auto";
  },

  @computed("placement", "showAd")
  classForSlot(placement, showAd) {
    return showAd ? `adsense-${placement}`.htmlSafe() : "";
  },

  @computed("isResponsive")
  autoAdFormat(isResponsive) {
    return isResponsive ? "auto".htmlSafe() : false;
  },

  @computed("ad_width", "ad_height", "isResponsive")
  adWrapperStyle(w, h, isResponsive) {
    return (isResponsive ? "" : `width: ${w}; height: ${h};`).htmlSafe();
  },

  @computed("adWrapperStyle", "isResponsive")
  adInsStyle(adWrapperStyle, isResponsive) {
    return `display: ${
      isResponsive ? "block" : "inline-block"
    }; ${adWrapperStyle}`.htmlSafe();
  },

  @computed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel &&
      trustLevel > Discourse.SiteSettings.adsense_through_trust_level
    );
  },

  @computed("showToTrustLevel", "showToGroups")
  showAd(showToTrustLevel, showToGroups) {
    return (
      showToTrustLevel &&
      showToGroups &&
      Discourse.SiteSettings.adsense_publisher_code
    );
  }
});
