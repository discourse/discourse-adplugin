import { action } from "@ember/object";
import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  @action
  moreSettings() {
    this.transitionTo("adminSiteSettingsCategory", "ad_plugin");
  },
});
