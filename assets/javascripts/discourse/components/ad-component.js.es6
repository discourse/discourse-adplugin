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

  // Server needs to compute this in case hidden tags are being used.
  topicTagsDisableAds: Ember.computed.alias(
    "router.currentRoute.parent.attributes.tags_disable_ads"
  ),

  @computed(
    "router.currentRoute.attributes.__type",
    "router.currentRoute.attributes.id"
  )
  topicListTag(type, tag) {
    if (type === "tag" && tag) {
      return tag;
    }
  },

  @computed("router.currentRoute.parent.attributes.archetype")
  isPersonalMessage(topicType) {
    return topicType === "private_message";
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

    let noAdsGroups = this.siteSettings.no_ads_for_groups
        .split("|")

    // TODO: Remove when 2.4 becomes the new stable. This is for backwards compatibility.
    const groupListUseIDs = this.site.group_list_use_ids;

    let currentGroups = groups;
    if (groupListUseIDs) {
      currentGroups = currentGroups.map(g => g.id.toString());
    } else {
      currentGroups = currentGroups.map(g => g.name.toLowerCase());
      noAdsGroups = noAdsGroups.map(g => g.toLowerCase());
    }

    return !currentGroups.any(g => noAdsGroups.includes(g));
  },

  @computed(
    "currentCategoryId",
    "topicTagsDisableAds",
    "topicListTag",
    "isPersonalMessage"
  )
  showOnCurrentPage(
    categoryId,
    topicTagsDisableAds,
    topicListTag,
    isPersonalMessage
  ) {
    return (
      !topicTagsDisableAds &&
      (!categoryId ||
        !this.siteSettings.no_ads_for_categories ||
        !this.siteSettings.no_ads_for_categories
          .split("|")
          .includes(categoryId.toString())) &&
      (!topicListTag ||
        !this.siteSettings.no_ads_for_tags ||
        !this.siteSettings.no_ads_for_tags.split("|").includes(topicListTag)) &&
      (!isPersonalMessage || !this.siteSettings.no_ads_for_personal_messages)
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
