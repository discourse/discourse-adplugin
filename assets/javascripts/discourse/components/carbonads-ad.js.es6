import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed from "discourse-common/utils/decorators";

const serve_id = Discourse.SiteSettings.carbonads_serve_id,
  placement = Discourse.SiteSettings.carbonads_placement;

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
      trustLevel &&
      trustLevel > Discourse.SiteSettings.carbonads_through_trust_level
    );
  },

  @discourseComputed("showToTrustLevel", "showToGroups", "showOnCurrentPage")
  showAd(showToTrustLevel, showToGroups, showOnCurrentPage) {
    return (
      placement &&
      serve_id &&
      showToTrustLevel &&
      showToGroups &&
      showOnCurrentPage
    );
  },
});
