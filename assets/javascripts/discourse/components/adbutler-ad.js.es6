import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import { default as computed, observes } from "ember-addons/ember-computed-decorators";
import loadScript from "discourse/lib/load-script";

const publisherId = Discourse.SiteSettings.adbutler_publisher_id;
const adserverHostname = Discourse.SiteSettings.adbutler_adserver_hostname;

let _loaded = false,
    _promise = null,
    _divs = [],
    _c = 0;

function loadAdbutler() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  _promise = loadScript('https://' + adserverHostname + '/app.js', { scriptTag: true }).then(function() {
    _loaded = true;
  });

  return _promise;
}

export default AdComponent.extend({

  init() {
    let dimensions = [728,90];
    let configKey = 'adbutler_';
    let className = 'adbutler-';
    let dimClassName = 'adbutler-ad';

    if (this.site.mobileView) {
      dimensions = [320,50];
      configKey += 'mobile_';
      className += 'mobile-';
      dimClassName = 'adbutler-mobile-ad';
    }

    configKey += this.get("placement").replace(/-/g, '_') + '_zone_id';
    this.set("configKey", configKey);

    className += this.get("placement");
    this.set("className", className + ' ' + dimClassName);

    let zoneId = this.siteSettings[configKey];
    this.set("zoneId", zoneId);

    let divId = 'placement-' + zoneId + '-' + _c;
    this.set("divId", divId);
    _c++;
    _divs.push({
      divId: divId,
      publisherId: publisherId,
      zoneId: zoneId,
      dimensions: dimensions
    });

    this.set("publisherId", publisherId);
    this._super();
  },

  _triggerAds() {
    loadAdbutler().then(function() {
      if(_divs.length > 0) {
        let abkw = window.abkw || '';
        AdButler.ads.push({
          handler: function(opt){ 
            AdButler.register(opt.place.publisherId, opt.place.zoneId, opt.place.dimensions, opt.place.divId, opt);
          }, 
          opt: { place: _divs.pop(), keywords: abkw, domain: adserverHostname, click:'CLICK_MACRO_PLACEHOLDER' }
        });
      }
    });
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

  @computed("currentUser.trust_level")
  showToTrustLevel(trustLevel) {
    return !(
      trustLevel &&
      trustLevel > Discourse.SiteSettings.adbutler_through_trust_level
    );
  },

  @computed(
    "showToTrustLevel", 
    "showToGroups", 
    "showAfterPost",
    "showOnCurrentPage",
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

  @computed("postNumber")
  showAfterPost(postNumber) {
    if (!postNumber) {
      return true;
    }
    return this.isNthPost(parseInt(this.siteSettings.adbutler_nth_post));
  }

});
