import HouseAdsSetting from "discourse/plugins/discourse-adplugin/discourse/components/house-ads-setting";

export default HouseAdsSetting.extend({
  classNames: "house-ads-setting house-ads-list-setting",
  adNames: Ember.computed.mapBy("allAds", "name"),
});
