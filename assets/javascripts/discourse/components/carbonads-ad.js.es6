import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import {
  default as computed,
  observes
} from "ember-addons/ember-computed-decorators";

const currentUser = Discourse.User.current(),
  serve_id = Discourse.SiteSettings.carbonads_serve_id,
  placement = Discourse.SiteSettings.carbonads_placement;

export default AdComponent.extend({
  init() {
    this.set("serve_id", serve_id);
    this.set("placement", placement);
    this._super();
  },

  @computed("serve_id", "placement")
  url(serveId, placement) {
    return `//cdn.carbonads.com/carbon.js?serve=${serveId}&placement=${placement}`.htmlSafe();
  },

  @computed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel &&
      trustLevel > Discourse.SiteSettings.carbonads_through_trust_level
    );
  },

  @computed("showToTrustLevel", "showToGroups")
  showAd(showToTrustLevel, showToGroups) {
    return placement && serve_id && showToTrustLevel && showToGroups;
  }
});
