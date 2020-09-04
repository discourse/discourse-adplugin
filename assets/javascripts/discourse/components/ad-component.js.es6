import discourseComputed from "discourse-common/utils/decorators";

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

  isRestrictedCategory: Ember.computed.or(
    "router.currentRoute.attributes.category.read_restricted",
    "router.currentRoute.parent.attributes.category.read_restricted"
  ),

  @discourseComputed(
    "router.currentRoute.attributes.__type",
    "router.currentRoute.attributes.id"
  )
  topicListTag(type, tag) {
    if (type === "tag" && tag) {
      return tag;
    }
  },

  @discourseComputed("router.currentRoute.parent.attributes.archetype")
  isPersonalMessage(topicType) {
    return topicType === "private_message";
  },

  @discourseComputed("currentUser.groups")
  showToGroups(groups) {
    const currentUser = this.currentUser;

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
      .filter(Boolean);
    let currentGroups = groups.map((g) => g.id.toString());

    return !currentGroups.any((g) => noAdsGroups.includes(g));
  },

  @discourseComputed(
    "currentCategoryId",
    "topicTagsDisableAds",
    "topicListTag",
    "isPersonalMessage",
    "isRestrictedCategory"
  )
  showOnCurrentPage(
    categoryId,
    topicTagsDisableAds,
    topicListTag,
    isPersonalMessage,
    isRestrictedCategory
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
      (!isPersonalMessage || !this.siteSettings.no_ads_for_personal_messages) &&
      (!isRestrictedCategory ||
        !this.siteSettings.no_ads_for_restricted_categories)
    );
  },

  isNthPost(n) {
    if (n && n > 0) {
      return this.get("postNumber") % n === 0;
    } else {
      return false;
    }
  },
});
