import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad_component";
import computed from "ember-addons/ember-computed-decorators";

const currentUser = Discourse.User.current();

const data = {
  "topic-list-top": {},
  "topic-above-post-stream": {},
  "topic-above-suggested": {},
  "post-bottom": {}
};

if (
  !Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_topic_list_top_src_code
) {
  data["topic-list-top"]["user_input"] =
    Discourse.SiteSettings.amazon_topic_list_top_src_code;
  data["topic-list-top"]["amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_topic_list_top_ad_width_code
  );
  data["topic-list-top"]["amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_topic_list_top_ad_height_code
  );
}

if (
  Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_mobile_topic_list_top_src_code
) {
  data["topic-list-top"]["user_input_mobile"] =
    Discourse.SiteSettings.amazon_mobile_topic_list_top_src_code;
  data["topic-list-top"]["mobile_amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_topic_list_top_ad_width_code
  );
  data["topic-list-top"]["mobile_amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_topic_list_top_ad_height_code
  );
}

if (
  !Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_topic_above_post_stream_src_code
) {
  data["topic-above-post-stream"]["user_input"] =
    Discourse.SiteSettings.amazon_topic_above_post_stream_src_code;
  data["topic-above-post-stream"]["amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_topic_above_post_stream_ad_width_code
  );
  data["topic-above-post-stream"]["amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_topic_above_post_stream_ad_height_code
  );
}

if (
  Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_mobile_topic_above_post_stream_src_code
) {
  data["topic-above-post-stream"]["user_input_mobile"] =
    Discourse.SiteSettings.amazon_mobile_topic_above_post_stream_src_code;
  data["topic-above-post-stream"]["mobile_amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_topic_above_post_stream_ad_width_code
  );
  data["topic-above-post-stream"]["mobile_amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_topic_above_post_stream_ad_height_code
  );
}

if (
  !Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_topic_above_suggested_src_code
) {
  data["topic-above-suggested"]["user_input"] =
    Discourse.SiteSettings.amazon_topic_above_suggested_src_code;
  data["topic-above-suggested"]["amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_topic_above_suggested_ad_width_code
  );
  data["topic-above-suggested"]["amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_topic_above_suggested_ad_height_code
  );
}

if (
  Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_mobile_topic_above_suggested_src_code
) {
  data["topic-above-suggested"]["user_input_mobile"] =
    Discourse.SiteSettings.amazon_mobile_topic_above_suggested_src_code;
  data["topic-above-suggested"]["mobile_amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_topic_above_suggested_ad_width_code
  );
  data["topic-above-suggested"]["mobile_amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_topic_above_suggested_ad_height_code
  );
}

if (
  !Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_post_bottom_src_code
) {
  data["post-bottom"]["user_input"] =
    Discourse.SiteSettings.amazon_post_bottom_src_code;
  data["post-bottom"]["amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_post_bottom_ad_width_code
  );
  data["post-bottom"]["amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_post_bottom_ad_height_code
  );
}

if (
  Discourse.Mobile.mobileView &&
  Discourse.SiteSettings.amazon_mobile_post_bottom_src_code
) {
  data["post-bottom"]["user_input_mobile"] =
    Discourse.SiteSettings.amazon_mobile_post_bottom_src_code;
  data["post-bottom"]["mobile_amazon_width"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_post_bottom_ad_width_code
  );
  data["post-bottom"]["mobile_amazon_height"] = parseInt(
    Discourse.SiteSettings.amazon_mobile_post_bottom_ad_height_code
  );
}

export default AdComponent.extend({
  classNames: ["amazon-product-links"],

  showAd: Ember.computed.and("showToTrustLevel", "showToGroups"),

  init() {
    let placement = this.get("placement");
    this.set("user_input", data[placement]["user_input"]);
    this.set("amazon_width", data[placement]["amazon_width"]);
    this.set("amazon_height", data[placement]["amazon_height"]);
    this.set("user_input_mobile", data[placement]["user_input_mobile"]);
    this.set("mobile_amazon_height", data[placement]["mobile_amazon_height"]);
    this.set("mobile_amazon_width", data[placement]["mobile_amazon_width"]);
    this._super();
  },

  @computed("amazon_width", "amazon_height")
  adWrapperStyle(w, h) {
    return `width: ${w}px; height: ${h}px;`.htmlSafe();
  },

  @computed("mobile_amazon_width", "mobile_amazon_height")
  adWrapperStyleMobile(w, h) {
    return `width: ${w}px; height: ${h}px;`.htmlSafe();
  },

  @computed("mobile_amazon_width")
  adTitleStyleMobile(w) {
    return `width: ${w}px;`.htmlSafe();
  },

  @computed("user_input")
  userInput(userInput) {
    return `${userInput}`.htmlSafe();
  },

  @computed("user_input_mobile")
  userInputMobile(userInput) {
    return `${userInput}`.htmlSafe();
  },

  @computed()
  showToTrustLevel() {
    return !(
      currentUser &&
      currentUser.get("trust_level") >
        Discourse.SiteSettings.amazon_through_trust_level
    );
  }
});
