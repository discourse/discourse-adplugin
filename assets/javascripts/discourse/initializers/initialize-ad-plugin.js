import { hbs } from "ember-cli-htmlbars";
import { withPluginApi } from "discourse/lib/plugin-api";
import Site from "discourse/models/site";
import { registerWidgetShim } from "discourse/widgets/render-glimmer";

export default {
  name: "initialize-ad-plugin",
  initialize(container) {
    registerWidgetShim(
      "after-post-ad",
      "div.widget-connector",
      hbs`<PostBottomAd @model={{@data}} />`
    );

    withPluginApi("0.1", (api) => {
      api.decorateWidget("post:after", (helper) => {
        return helper.attach("after-post-ad", helper.widget.model);
      });
    });

    const messageBus = container.lookup("service:message-bus");
    const currentUser = container.lookup("service:current-user");

    const channel = currentUser
      ? "/site/house-creatives/logged-in"
      : "/site/house-creatives/anonymous";

    messageBus.subscribe(channel, function (houseAdsSettings) {
      Site.currentProp("house_creatives", houseAdsSettings);
    });
  },
};
