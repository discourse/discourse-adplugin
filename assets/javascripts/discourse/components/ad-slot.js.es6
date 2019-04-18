import computed from "ember-addons/ember-computed-decorators";

const adConfig = Ember.Object.create({
  "google-adsense": {
    settingPrefix: "adsense" // settings follow naming convention
  },
  "google-dfp-ad": {
    settingPrefix: "dfp" // settings follow naming convention
  },
  "amazon-product-links": {
    settingPrefix: "amazon",
    desktop: {
      "topic-list-top": "amazon_topic_list_top_src_code",
      "post-bottom": "amazon_post_bottom_src_code",
      "topic-above-post-stream": "amazon_topic_above_post_stream_src_code",
      "topic-above-suggested": "amazon_topic_above_suggested_src_code"
    },
    mobile: {
      "topic-list-top": "amazon_mobile_topic_list_top_src_code",
      "post-bottom": "amazon_mobile_post_bottom_src_code",
      "topic-above-post-stream":
        "amazon_mobile_topic_above_post_stream_src_code",
      "topic-above-suggested": "amazon_mobile_topic_above_suggested_src_code"
    }
  },
  "codefund-ad": {
    settingPrefix: "codefund",
    desktop: {
      "topic-list-top": "codefund_top_of_topic_list_enabled",
      "post-bottom": "codefund_below_post_enabled",
      "topic-above-post-stream": "codefund_above_post_stream_enabled",
      "topic-above-suggested": "codefund_above_suggested_enabled"
    }
  },
  "carbonads-ad": {
    settingPrefix: "carbonads",
    desktop: {
      "topic-list-top": "carbonads_topic_list_top_enabled",
      "post-bottom": false,
      "topic-above-post-stream": "carbonads_above_post_stream_enabled",
      "topic-above-suggested": false
    }
  }
});

export default Ember.Component.extend({
  @computed("placement")
  adComponents(placement) {
    // Check house ads first
    const houseAds = this.site.get("house_creatives"),
      adsForSlot = houseAds.settings[placement.replace(/-/g, "_")];
    if (
      Object.keys(houseAds.creatives).length > 0 &&
      !Ember.isBlank(adsForSlot)
    ) {
      return ["house-ad"];
    }

    return Object.keys(adConfig).filter(adNetwork => {
      const config = adConfig[adNetwork];
      let settingNames = null,
        name;

      if (this.site.mobileView) {
        settingNames = config.mobile || config.desktop;
      } else {
        settingNames = config.desktop;
      }

      if (settingNames) {
        name = settingNames[placement];
      }

      if (name === undefined) {
        // follows naming convention: prefix_(mobile_)_{placement}_code
        name = `${config.settingPrefix}_${
          this.site.mobileView ? "mobile_" : ""
        }${placement.replace(/-/g, "_")}_code`;
      }

      return name !== false && !Ember.isBlank(this.siteSettings[name]);
    });
  }
});
