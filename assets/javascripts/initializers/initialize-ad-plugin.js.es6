import PostModel from "discourse/models/post";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "initialize-ad-plugin",
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");

    PostModel.reopen({
      postSpecificCountDFP: function() {
        return this.isNthPost(parseInt(siteSettings.dfp_nth_post_code));
      }.property("post_number"),

      postSpecificCountAdsense: function() {
        return this.isNthPost(parseInt(siteSettings.adsense_nth_post_code));
      }.property("post_number"),

      postSpecificCountAmazon: function() {
        return this.isNthPost(parseInt(siteSettings.amazon_nth_post_code));
      }.property("post_number"),

      postSpecificCountCodeFund: function() {
        return this.isNthPost(parseInt(siteSettings.codefund_nth_post));
      }.property("post_number"),

      isNthPost: function(n) {
        if (n && n > 0) {
          return this.get("post_number") % n === 0;
        } else {
          return false;
        }
      }
    });

    withPluginApi("0.1", api => {
      api.decorateWidget("post:after", dec => {
        if (dec.canConnectComponent) {
          return dec.connect({
            component: "adplugin-container",
            context: "model"
          });
        }

        // Old way for backwards compatibility
        return dec.connect({
          templateName: "connectors/post-bottom/discourse-adplugin",
          context: "model"
        });
      });
    });
  }
};
