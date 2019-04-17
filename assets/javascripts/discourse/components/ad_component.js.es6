import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  @computed()
  showToGroups: function() {
    const currentUser = Discourse.User.current();

    if (
      !currentUser ||
      !currentUser.get("groups") ||
      !this.siteSettings.no_ads_for_groups ||
      this.siteSettings.no_ads_for_groups.length === 0
    ) {
      return true;
    }

    const noAdsGroupNames = this.siteSettings.no_ads_for_groups.split("|");

    return !currentUser
      .get("groups")
      .any(group => noAdsGroupNames.includes(group.name));
  }
});
