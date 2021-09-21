import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed from "discourse-common/utils/decorators";

export default AdComponent.extend({
  init() {
    this.set("serve_id", serve_id);
    this._super();
  },

  @discourseComputed("serve_id")
  url(serveId) {
    return `//cdn.carbonads.com/carbon.js?serve=${serveId}&placement=${placement}`.htmlSafe();
  },

  @discourseComputed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel && trustLevel > this.siteSettings.carbonads_through_trust_level
    );
  },

  @discourseComputed("showToTrustLevel", "showToGroups", "showOnCurrentPage")
  showAd(showToTrustLevel, showToGroups, showOnCurrentPage) {
    return (
      this.siteSettings.carbonads_placement &&
      this.siteSettings.carbonads_serve_id &&
      showToTrustLevel &&
      showToGroups &&
      showOnCurrentPage
    );
  },
});
