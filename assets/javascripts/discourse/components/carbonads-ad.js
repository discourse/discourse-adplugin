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

  @discourseComputed
  showCarbonAds() {
    if (!this.currentUser) {
      return true;
    }

    return this.currentUser.show_carbon_ads;
  },

  @discourseComputed(
    "placement",
    "serve_id",
    "showCarbonAds",
    "showToGroups",
    "showOnCurrentPage"
  )
  showAd(placement, serveId, showCarbonAds, showToGroups, showOnCurrentPage) {
    return (
      placement && serveId && showCarbonAds && showToGroups && showOnCurrentPage
    );
  },
});
