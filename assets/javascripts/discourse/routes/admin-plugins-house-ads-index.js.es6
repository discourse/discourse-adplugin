export default Discourse.Route.extend({
  actions: {
    moreSettings() {
      this.transitionTo("adminSiteSettingsCategory", "ad_plugin");
    }
  }
});
