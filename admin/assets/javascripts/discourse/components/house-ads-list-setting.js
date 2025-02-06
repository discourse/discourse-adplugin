import { action } from "@ember/object";
import { mapBy } from "@ember/object/computed";
import { classNames } from "@ember-decorators/component";
import { makeArray } from "discourse/lib/helpers";
import HouseAdsSetting from "discourse/plugins/discourse-adplugin/discourse/components/house-ads-setting";

@classNames("house-ads-setting house-ads-list-setting")
export default class HouseAdsListSetting extends HouseAdsSetting {
  @mapBy("allAds", "name") adNames;

  @action
  changeAdValue(value) {
    const settingValue = makeArray(value).join("|");
    this.set("adValue", settingValue);
  }
}
