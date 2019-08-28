import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import { default as computed, observes } from "ember-addons/ember-computed-decorators";
import loadScript from "discourse/lib/load-script";

const publisher_id = Discourse.SiteSettings.adbutler_publisher_id;
const adserver_hostname = Discourse.SiteSettings.adbutler_adserver_hostname;

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

  _promise = loadScript('https://' + adserver_hostname + '/app.js', { scriptTag: true }).then(function() {
    _loaded = true;
  });

  return _promise;
}

export default AdComponent.extend({
  init() {
    var dimensions = [728,90];
    var config_key = 'adbutler_';
    var class_name = 'adbutler-';

    if (this.site.mobileView) {
      dimensions = [320,50];
      config_key += 'mobile_';
      class_name += 'mobile-';
    }

    config_key += this.get("placement").replace(/-/g, '_') + '_zone_id';
    this.set("config_key", config_key);

    class_name += this.get("placement");
    this.set("class_name", class_name);

    var zone_id = this.siteSettings[config_key];
    this.set("zone_id", zone_id);

    var div_id = 'placement-' + zone_id + '-' + _c;
    this.set("div_id", div_id);
    _c++;
    _divs.push({
      div_id: div_id,
      publisher_id: publisher_id,
      zone_id: zone_id,
      dimensions: dimensions
    });

    this.set("publisher_id", publisher_id);
    this._super();
  },

  _triggerAds() {
    loadAdbutler().then(function() {
      if(_divs.length > 0) {
        var abkw = window.abkw || '';
        AdButler.ads.push({
          handler: function(opt){ 
            AdButler.register(opt.place.publisher_id, opt.place.zone_id, opt.place.dimensions, opt.place.div_id, opt);
          }, 
          opt: { place: _divs.pop(), keywords: abkw, domain: adserver_hostname, click:'CLICK_MACRO_PLACEHOLDER' }
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
      publisher_id &&
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
