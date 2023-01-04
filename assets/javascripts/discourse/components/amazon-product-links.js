import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed from "discourse-common/utils/decorators";
import { and } from "@ember/object/computed";
import { htmlSafe } from "@ember/template";

export default AdComponent.extend({
  classNames: ["amazon-product-links"],

  showAd: and(
    "showToTrustLevel",
    "showToGroups",
    "showAfterPost",
    "showOnCurrentPage"
  ),

  init() {
    const data = {
      "topic-list-top": {},
      "topic-above-post-stream": {},
      "topic-above-suggested": {},
      "post-bottom": {},
    };
    const mobileView = this.site.get("mobileView");
    const placement = this.get("placement");

    if (!mobileView && this.siteSettings.amazon_topic_list_top_src_code) {
      data["topic-list-top"]["user_input"] =
        this.siteSettings.amazon_topic_list_top_src_code;
      data["topic-list-top"]["amazon_width"] = parseInt(
        this.siteSettings.amazon_topic_list_top_ad_width_code,
        10
      );
      data["topic-list-top"]["amazon_height"] = parseInt(
        this.siteSettings.amazon_topic_list_top_ad_height_code,
        10
      );
    }

    if (mobileView && this.siteSettings.amazon_mobile_topic_list_top_src_code) {
      data["topic-list-top"]["user_input_mobile"] =
        this.siteSettings.amazon_mobile_topic_list_top_src_code;
      data["topic-list-top"]["mobile_amazon_width"] = parseInt(
        this.siteSettings.amazon_mobile_topic_list_top_ad_width_code,
        10
      );
      data["topic-list-top"]["mobile_amazon_height"] = parseInt(
        this.siteSettings.amazon_mobile_topic_list_top_ad_height_code,
        10
      );
    }

    if (
      !mobileView &&
      this.siteSettings.amazon_topic_above_post_stream_src_code
    ) {
      data["topic-above-post-stream"]["user_input"] =
        this.siteSettings.amazon_topic_above_post_stream_src_code;
      data["topic-above-post-stream"]["amazon_width"] = parseInt(
        this.siteSettings.amazon_topic_above_post_stream_ad_width_code,
        10
      );
      data["topic-above-post-stream"]["amazon_height"] = parseInt(
        this.siteSettings.amazon_topic_above_post_stream_ad_height_code,
        10
      );
    }

    if (
      mobileView &&
      this.siteSettings.amazon_mobile_topic_above_post_stream_src_code
    ) {
      data["topic-above-post-stream"]["user_input_mobile"] =
        this.siteSettings.amazon_mobile_topic_above_post_stream_src_code;
      data["topic-above-post-stream"]["mobile_amazon_width"] = parseInt(
        this.siteSettings.amazon_mobile_topic_above_post_stream_ad_width_code,
        10
      );
      data["topic-above-post-stream"]["mobile_amazon_height"] = parseInt(
        this.siteSettings.amazon_mobile_topic_above_post_stream_ad_height_code,
        10
      );
    }

    if (
      !mobileView &&
      this.siteSettings.amazon_topic_above_suggested_src_code
    ) {
      data["topic-above-suggested"]["user_input"] =
        this.siteSettings.amazon_topic_above_suggested_src_code;
      data["topic-above-suggested"]["amazon_width"] = parseInt(
        this.siteSettings.amazon_topic_above_suggested_ad_width_code,
        10
      );
      data["topic-above-suggested"]["amazon_height"] = parseInt(
        this.siteSettings.amazon_topic_above_suggested_ad_height_code,
        10
      );
    }

    if (
      mobileView &&
      this.siteSettings.amazon_mobile_topic_above_suggested_src_code
    ) {
      data["topic-above-suggested"]["user_input_mobile"] =
        this.siteSettings.amazon_mobile_topic_above_suggested_src_code;
      data["topic-above-suggested"]["mobile_amazon_width"] = parseInt(
        this.siteSettings.amazon_mobile_topic_above_suggested_ad_width_code,
        10
      );
      data["topic-above-suggested"]["mobile_amazon_height"] = parseInt(
        this.siteSettings.amazon_mobile_topic_above_suggested_ad_height_code,
        10
      );
    }

    if (!mobileView && this.siteSettings.amazon_post_bottom_src_code) {
      data["post-bottom"]["user_input"] =
        this.siteSettings.amazon_post_bottom_src_code;
      data["post-bottom"]["amazon_width"] = parseInt(
        this.siteSettings.amazon_post_bottom_ad_width_code,
        10
      );
      data["post-bottom"]["amazon_height"] = parseInt(
        this.siteSettings.amazon_post_bottom_ad_height_code,
        10
      );
    }

    if (mobileView && this.siteSettings.amazon_mobile_post_bottom_src_code) {
      data["post-bottom"]["user_input_mobile"] =
        this.siteSettings.amazon_mobile_post_bottom_src_code;
      data["post-bottom"]["mobile_amazon_width"] = parseInt(
        this.siteSettings.amazon_mobile_post_bottom_ad_width_code,
        10
      );
      data["post-bottom"]["mobile_amazon_height"] = parseInt(
        this.siteSettings.amazon_mobile_post_bottom_ad_height_code,
        10
      );
    }

    this.set("user_input", data[placement]["user_input"]);
    this.set("amazon_width", data[placement]["amazon_width"]);
    this.set("amazon_height", data[placement]["amazon_height"]);
    this.set("user_input_mobile", data[placement]["user_input_mobile"]);
    this.set("mobile_amazon_height", data[placement]["mobile_amazon_height"]);
    this.set("mobile_amazon_width", data[placement]["mobile_amazon_width"]);
    this._super();
  },

  @discourseComputed("amazon_width", "amazon_height")
  adWrapperStyle(w, h) {
    return htmlSafe(`width: ${w}px; height: ${h}px;`);
  },

  @discourseComputed("mobile_amazon_width", "mobile_amazon_height")
  adWrapperStyleMobile(w, h) {
    return htmlSafe(`width: ${w}px; height: ${h}px;`);
  },

  @discourseComputed("mobile_amazon_width")
  adTitleStyleMobile(w) {
    return htmlSafe(`width: ${w}px;`);
  },

  @discourseComputed("user_input")
  userInput(userInput) {
    return htmlSafe(`${userInput}`);
  },

  @discourseComputed("user_input_mobile")
  userInputMobile(userInput) {
    return htmlSafe(`${userInput}`);
  },

  @discourseComputed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel && trustLevel > this.siteSettings.amazon_through_trust_level
    );
  },

  @discourseComputed("postNumber")
  showAfterPost(postNumber) {
    if (!postNumber) {
      return true;
    }

    return this.isNthPost(parseInt(this.siteSettings.amazon_nth_post_code, 10));
  },
});
