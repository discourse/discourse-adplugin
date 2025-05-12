import { action } from "@ember/object";
import { mapBy } from "@ember/object/computed";
import { classNames } from "@ember-decorators/component";
import DButton from "discourse/components/d-button";
import { makeArray } from "discourse/lib/helpers";
import HouseAdsSetting from "discourse/plugins/discourse-adplugin/admin/components/house-ads-setting";
import houseAdsChooser from "./house-ads-chooser";

@classNames("house-ads-setting house-ads-list-setting")
export default class HouseAdsListSetting extends HouseAdsSetting {
  @mapBy("allAds", "name") adNames;

  @action
  changeAdValue(value) {
    const settingValue = makeArray(value).join("|");
    this.set("adValue", settingValue);
  }

  <template>
    <label for={{this.name}}>{{this.title}}</label>
    {{houseAdsChooser
      settingValue=this.adValue
      choices=this.adNames
      onChange=this.changeAdValue
    }}
    <div class="setting-controls">
      {{#if this.changed}}
        <DButton class="ok" @action={{action "save"}} @icon="check" />
        <DButton class="cancel" @action={{action "cancel"}} @icon="xmark" />
      {{/if}}
    </div>
    <p class="help">{{this.help}}</p>
  </template>
}
