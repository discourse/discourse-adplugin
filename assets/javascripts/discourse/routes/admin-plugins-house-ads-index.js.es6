import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  actions: {
    moreSettings() {
      this.transitionTo("adminSiteSettingsCategory", "ad_plugin");
    },
  },
});
