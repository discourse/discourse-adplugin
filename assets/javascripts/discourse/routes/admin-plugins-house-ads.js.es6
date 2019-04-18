import { ajax } from "discourse/lib/ajax";

export default Discourse.Route.extend({
  settings: null,

  model(params) {
    return ajax("/admin/plugins/adplugin/house_ads.json").then(data => {
      this.set("settings", Ember.Object.create(data.settings));
      return data.house_ads.map(ad => Ember.Object.create(ad));
    });
  },

  setupController(controller, model) {
    controller.setProperties({
      model,
      houseAdsSettings: this.get("settings"),
      loadingAds: false
    });
  }
});
