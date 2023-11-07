import { scheduleOnce } from "@ember/runloop";
import RSVP from "rsvp";
import loadScript from "discourse/lib/load-script";
import { isTesting } from "discourse-common/config/environment";
import discourseComputed from "discourse-common/utils/decorators";
import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";

let _loaded = false,
  _promise = null,
  _c = 0;

function loadAdbutler(adserverHostname) {
  if (_loaded) {
    return RSVP.resolve();
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
  publisherId: null,

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

    let publisherId = this.siteSettings.adbutler_publisher_id;
    this.set("publisherId", publisherId);

    _c++;

    this.divs.push({
      divId,
      publisherId,
      zoneId,
      dimensions,
    });

    this._super();
  },

  _triggerAds() {
    if (isTesting()) {
      return; // Don't load external JS during tests
    }

    const adserverHostname = this.siteSettings.adbutler_adserver_hostname;

    loadAdbutler(adserverHostname).then(
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
    scheduleOnce("afterRender", this, this._triggerAds);
  },

  @discourseComputed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel && trustLevel > this.siteSettings.adbutler_through_trust_level
    );
  },

  @discourseComputed(
    "publisherId",
    "showToTrustLevel",
    "showToGroups",
    "showAfterPost",
    "showOnCurrentPage"
  )
  showAd(
    publisherId,
    showToTrustLevel,
    showToGroups,
    showAfterPost,
    showOnCurrentPage
  ) {
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
