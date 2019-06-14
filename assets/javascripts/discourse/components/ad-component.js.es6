import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  router: Ember.inject.service(),

  currentCategoryId: Ember.computed.or(
    "router.currentRoute.attributes.category.id",
    "router.currentRoute.parent.attributes.category_id"
  ),

  currentCategorySlug: Ember.computed.or(
    "router.currentRoute.attributes.category.slug",
    "router.currentRoute.parent.attributes.category.slug"
  ),

  @computed(
    "router.currentRoute.parent.attributes.tags",
    "router.currentRoute.attributes.__type",
    "router.currentRoute.attributes.id"
  )
  currentTags(tagsArray, type, tag) {
    if (tagsArray) {
      return tagsArray;
    }

    if (type == "tag" && tag) {
      return [tag];
    }
  },

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

  @computed("currentCategoryId", "currentTags")
  showOnCurrentPage(categoryId, currentTags) {
    return (
      (!categoryId ||
        !this.siteSettings.no_ads_for_categories ||
        !this.siteSettings.no_ads_for_categories
          .split("|")
          .includes(categoryId.toString())) &&
      (!currentTags ||
        !this.siteSettings.no_ads_for_tags ||
        Ember.isEmpty(
          this.siteSettings.no_ads_for_tags
            .split("|")
            .filter(tag => currentTags.includes(tag))
        ))
    );
  },

  isNthPost(n) {
    if (n && n > 0) {
      return this.get("postNumber") % n === 0;
    } else {
      return false;
    }
  }
});
