import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad_component";
import {
  default as computed,
  observes
} from "ember-addons/ember-computed-decorators";

let _loaded = false,
  _promise = null;

const currentUser = Discourse.User.current(),
  propertyId = Discourse.SiteSettings.codefund_property_id;

function loadCodeFund() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  const url = "https://codefund.app/properties/" + propertyId + "/funder.json";

  _promise = new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.onreadystatechange = handler;
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();

    function handler() {
      if (this.readyState === this.DONE) {
        _loaded = true;

        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(
            new Error(
              "getJSON: `" + url + "` failed with status: [" + this.status + "]"
            )
          );
        }
      }
    }
  });

  return _promise;
}

export default AdComponent.extend({
  classNameBindings: [":codefund-ad"],
  propertyId: propertyId,
  adRequested: false,
  adDetails: {},

  displayPostBottom: Ember.computed.equal("placement", "post-bottom"),
  displayTopicAbovePostStream: Ember.computed.equal(
    "placement",
    "topic-above-post-stream"
  ),
  displayTopicAboveSuggested: Ember.computed.equal(
    "placement",
    "topic-above-suggested"
  ),
  displayTopicListTop: Ember.computed.equal("placement", "topic-list-top"),

  _triggerAds() {
    if (!propertyId) return;

    this.set("adRequested", true);
    loadCodeFund()
      .then(data => {
        _loaded = false;
        _promise = null;
        this.set("adDetails", data);
        this.set("adRequested", false);
      })
      .catch(error => console.log(error));
  },

  didInsertElement() {
    this._super();

    if (!this.get("showAd")) {
      return;
    }

    if (this.get("listLoading")) {
      return;
    }

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
      trustLevel > Discourse.SiteSettings.codefund_through_trust_level
    );
  },

  @computed("showToTrustLevel", "showToGroups")
  showAd(showToTrustLevel, showToGroups) {
    return (
      Discourse.SiteSettings.codefund_property_id &&
      showToTrustLevel &&
      showToGroups
    );
  }
});
