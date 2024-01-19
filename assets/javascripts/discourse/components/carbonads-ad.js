import { htmlSafe } from "@ember/template";
import discourseComputed from "discourse-common/utils/decorators";
import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";

export default AdComponent.extend({
  serve_id: null,
  placement: null,

  init() {
    this.set("serve_id", this.siteSettings.carbonads_serve_id);
    this.set("placement", this.siteSettings.carbonads_placement);
    this._super();
  },

  @discourseComputed("serve_id", "placement")
  url(serveId, placement) {
    return htmlSafe(
      `//cdn.carbonads.com/carbon.js?serve=${serveId}&placement=${placement}`
    );
  },

  @discourseComputed("currentUser.groups")
  showToThroughAllowedGroups(groups) {
    const currentUser = this.currentUser;

    if (
      !currentUser ||
      !groups ||
      !this.siteSettings.carbonads_through_allowed_groups ||
      this.siteSettings.carbonads_through_allowed_groups.length === 0
    ) {
      return true;
    }
    return groups.some((group) =>
      this.siteSettings.carbonads_through_allowed_groups
        .map((g) => g.id)
        .includes(group.id)
    );
  },

  @discourseComputed(
    "placement",
    "serve_id",
    "showToThroughAllowedGroups",
    "showToGroups",
    "showOnCurrentPage"
  )
  showAd(
    placement,
    serveId,
    showToThroughAllowedGroups,
    showToGroups,
    showOnCurrentPage
  ) {
    return (
      placement &&
      serveId &&
      showToThroughAllowedGroups &&
      showToGroups &&
      showOnCurrentPage
    );
  },
});
