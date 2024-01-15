import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  router: service(),

  @action
  moreSettings() {
    this.router.transitionTo("adminSiteSettingsCategory", "ad_plugin");
  },
});
