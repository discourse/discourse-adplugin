import { mapBy } from "@ember/object/computed";
import { classNames } from "@ember-decorators/component";
import HouseAdsSetting from "discourse/plugins/discourse-adplugin/discourse/components/house-ads-setting";

@classNames("house-ads-setting house-ads-list-setting")
export default class HouseAdsListSetting extends HouseAdsSetting {
  @mapBy("allAds", "name") adNames;
}
