import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import loadScript from "discourse/lib/load-script";

const publisherId = Discourse.SiteSettings.adbutler_publisher_id;
const adserverHostname = Discourse.SiteSettings.adbutler_adserver_hostname;

let _loaded = false,
  _promise = null,
  _c = 0;

function loadAdbutler() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  _promise = loadScript("https://" + adserverHostname + "/app.js", {
    scriptTag: true,
  }).then(function () {
    _loaded = true;
  });

  return _promise;
}

export default AdComponent.extend({
  divs: null,

  init() {
    let dimensions = [728, 90];
    let configKey = "adbutler_";
    let className = "adbutler-";
    let dimClassName = "adbutler-ad";

    this.set("divs", []);

    if (this.site.mobileView) {
      dimensions = [320, 50];
      configKey += "mobile_";
      className += "mobile-";
      dimClassName = "adbutler-mobile-ad";
    }

    configKey += this.get("placement").replace(/-/g, "_") + "_zone_id";
    this.set("configKey", configKey);

    className += this.get("placement");
    this.set("className", className + " " + dimClassName);

    let zoneId = this.siteSettings[configKey];
    this.set("zoneId", zoneId);

    let divId = "placement-" + zoneId + "-" + _c;
    this.set("divId", divId);
    _c++;
    this.divs.push({
      divId: divId,
      publisherId: publisherId,
      zoneId: zoneId,
      dimensions: dimensions,
    });

    this.set("publisherId", publisherId);
    this._super();
  },

  _triggerAds() {
    if (Ember.testing) {
      return; // Don't load external JS during tests
    }

    loadAdbutler().then(
      function () {
        if (this.divs.length > 0) {
          let abkw = window.abkw || "";
          window.AdButler.ads.push({
            handler: function (opt) {
              window.AdButler.register(
                opt.place.publisherId,
                opt.place.zoneId,
                opt.place.dimensions,
                opt.place.divId,
                opt
              );
            },
            opt: {
              place: this.divs.pop(),
              keywords: abkw,
              domain: adserverHostname,
              click: "CLICK_MACRO_PLACEHOLDER",
            },
          });
        }
      }.bind(this)
    );
  },

  didInsertElement() {
    this._super();
    Ember.run.scheduleOnce("afterRender", this, this._triggerAds);
  },

  @observes("listLoading")
  waitForLoad() {
    if (this.get("adRequested")) {
      return;
    } // already requested that this ad unit be populated
    if (!this.get("listLoading")) {
      Ember.run.scheduleOnce("afterRender", this, this._triggerAds);
    }
  },

  @discourseComputed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel &&
      trustLevel > Discourse.SiteSettings.adbutler_through_trust_level
    );
  },

  @discourseComputed(
    "showToTrustLevel",
    "showToGroups",
    "showAfterPost",
    "showOnCurrentPage"
  )
  showAd(showToTrustLevel, showToGroups, showAfterPost, showOnCurrentPage) {
    return (
      publisherId &&
      showToTrustLevel &&
      showToGroups &&
      showAfterPost &&
      showOnCurrentPage
    );
  },

  @discourseComputed("postNumber")
  showAfterPost(postNumber) {
    if (!postNumber) {
      return true;
    }
    return this.isNthPost(parseInt(this.siteSettings.adbutler_nth_post, 10));
  },
});
