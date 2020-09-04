export default Ember.Controller.extend({
  adminPluginsHouseAds: Ember.inject.controller("adminPlugins.houseAds"),
  houseAds: Ember.computed.alias("adminPluginsHouseAds.model"),
  adSettings: Ember.computed.alias("adminPluginsHouseAds.houseAdsSettings"),
});
