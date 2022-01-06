import DiscourseRoute from "discourse/routes/discourse";
import { action } from "@ember/object";

export default DiscourseRoute.extend({
  @action
  moreSettings() {
    this.transitionTo("adminSiteSettingsCategory", "ad_plugin");
  },
});
