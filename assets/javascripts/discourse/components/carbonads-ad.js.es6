import {
  default as computed,
  observes
} from "ember-addons/ember-computed-decorators";

var currentUser = Discourse.User.current(),
  serve_id = Discourse.SiteSettings.carbonads_serve_id,
  placement = Discourse.SiteSettings.carbonads_placement;

export default Ember.Component.extend({
  init: function() {
    this.set("serve_id", serve_id);
    this.set("placement", placement);
    this._super();
  },

  url: function() {
    return (`//cdn.carbonads.com/carbon.js?serve=${this.get("serve_id")}&placement=${this.get("placement")}`).htmlSafe();
  }.property("serve_id", "placement"),

  checkTrustLevels: function() {
    return !(
      currentUser &&
      currentUser.get("trust_level") >
        Discourse.SiteSettings.carbonads_through_trust_level
    );
  }.property("trust_level"),

  @computed("checkTrustLevels")
  showAd: function(checkTrustLevels) {
    return placement && serve_id && checkTrustLevels;
  }
});
