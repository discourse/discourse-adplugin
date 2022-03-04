import { withPluginApi } from "discourse/lib/plugin-api";
import Site from "discourse/models/site";

export default {
  name: "initialize-ad-plugin",
  initialize(container) {
    withPluginApi("0.1", (api) => {
      api.decorateWidget("post:after", (dec) => {
        if (dec.canConnectComponent) {
          if (!dec.attrs.cloaked) {
            return dec.connect({
              component: "post-bottom-ad",
              context: "model",
            });
          }
        } else {
          // Old way for backwards compatibility
          return dec.connect({
            templateName: "connectors/post-bottom/discourse-adplugin",
            context: "model",
          });
        }
      });
    });

    const messageBus = container.lookup("message-bus:main");
    if (!messageBus) {
      return;
    }

    messageBus.subscribe("/site/house-creatives", function (houseAdsSettings) {
      Site.currentProp("house_creatives", houseAdsSettings);
    });
  },
};
