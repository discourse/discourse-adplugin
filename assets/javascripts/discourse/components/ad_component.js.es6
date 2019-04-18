import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  @computed('currentUser.groups')
  showToGroups: function(groups) {
    const currentUser = Discourse.User.current();

    if (
      !currentUser ||
      !groups ||
      !this.siteSettings.no_ads_for_groups ||
      this.siteSettings.no_ads_for_groups.length === 0
    ) {
      return true;
    }

    const noAdsGroupNames = this.siteSettings.no_ads_for_groups.split("|");

    return !groups.any(group => noAdsGroupNames.includes(group.name));
  }
});
