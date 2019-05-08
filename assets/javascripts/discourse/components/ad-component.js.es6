import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  @computed("currentUser.groups")
  showToGroups(groups) {
    const currentUser = Discourse.User.current();

    if (
      !currentUser ||
      !groups ||
      !this.siteSettings.no_ads_for_groups ||
      this.siteSettings.no_ads_for_groups.length === 0
    ) {
      return true;
    }

    const groupNames = groups.map(g => g.name.toLowerCase());
    const noAdsGroupNames = this.siteSettings.no_ads_for_groups
      .split("|")
      .map(g => g.toLowerCase());

    return !groupNames.any(g => noAdsGroupNames.includes(g));
  },

  isNthPost(n) {
    if (n && n > 0) {
      return this.get("postNumber") % n === 0;
    } else {
      return false;
    }
  }
});
