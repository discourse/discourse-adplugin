import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed from "discourse-common/utils/decorators";
import { htmlSafe } from "@ember/template";

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

  @discourseComputed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel && trustLevel > this.siteSettings.carbonads_through_trust_level
    );
  },

  @discourseComputed(
    "placement",
    "serve_id",
    "showToTrustLevel",
    "showToGroups",
    "showOnCurrentPage"
  )
  showAd(
    placement,
    serveId,
    showToTrustLevel,
    showToGroups,
    showOnCurrentPage
  ) {
    return (
      placement &&
      serveId &&
      showToTrustLevel &&
      showToGroups &&
      showOnCurrentPage
    );
  },
});
