import loadScript from "discourse/lib/load-script";

var _loaded = false,
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

  var adsenseSrc =
    ("https:" === document.location.protocol ? "https:" : "http:") +
    "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  _promise = loadScript(adsenseSrc, { scriptTag: true }).then(function() {
    _loaded = true;
  });

  return _promise;
}

var data = {
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

export default Ember.Component.extend({
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

  waitForLoad: function() {
    if (this.get("adRequested")) {
      return;
    } // already requested that this ad unit be populated
    if (!this.get("listLoading")) {
      Ember.run.scheduleOnce("afterRender", this, this._triggerAds);
    }
  }.observes("listLoading"),

  isResponsive: function() {
    return this.get("ad_width") === "auto";
  }.property("ad_width"),

  classForSlot: function() {
    return `adsense-${this.get("placement")}`.htmlSafe();
  }.property("placement"),

  autoAdFormat: function() {
    return this.get("isResponsive") ? "auto".htmlSafe() : false;
  }.property("isResponsive"),

  adWrapperStyle: function() {
    return (this.get("isResponsive")
      ? ""
      : `width: ${this.get("ad_width")}; height: ${this.get("ad_height")};`
    ).htmlSafe();
  }.property("ad_width", "ad_height"),

  adInsStyle: function() {
    return `display: ${
      this.get("isResponsive") ? "block" : "inline-block"
    }; ${this.get("adWrapperStyle")}`.htmlSafe();
  }.property("adWrapperStyle", "isResponsive"),

  checkTrustLevels: function() {
    return !(
      currentUser &&
      currentUser.get("trust_level") >
        Discourse.SiteSettings.adsense_through_trust_level
    );
  }.property("trust_level"),

  showAd: function() {
    return (
      Discourse.SiteSettings.adsense_publisher_code &&
      this.get("checkTrustLevels")
    );
  }.property("checkTrustLevels")
});
