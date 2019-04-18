import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import computed from "ember-addons/ember-computed-decorators";
import HouseAdsSetting from "discourse/plugins/discourse-adplugin/discourse/components/house-ads-setting";

export default HouseAdsSetting.extend({
  classNames: "house-ads-setting house-ads-list-setting",
  adNames: Ember.computed.mapBy("allAds", "name")
});
