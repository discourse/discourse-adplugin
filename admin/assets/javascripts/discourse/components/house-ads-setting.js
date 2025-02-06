import Component from "@ember/component";
import { action } from "@ember/object";
import { classNames } from "@ember-decorators/component";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { i18n as computedI18n, propertyNotEqual } from "discourse/lib/computed";
import { i18n } from "discourse-i18n";

@classNames("house-ads-setting")
export default class HouseAdsSetting extends Component {
  adValue = "";
  saving = false;
  savingStatus = "";

  @computedI18n("name", "admin.adplugin.house_ads.%@.title") title;
  @computedI18n("name", "admin.adplugin.house_ads.%@.description") help;
  @propertyNotEqual("adValue", "value") changed;

  init() {
    super.init(...arguments);
    this.set("adValue", this.get("value"));
  }

  @action
  save() {
    if (!this.get("saving")) {
      this.setProperties({
        saving: true,
        savingStatus: i18n("saving"),
      });

      ajax(`/admin/plugins/pluginad/house_settings/${this.get("name")}.json`, {
        type: "PUT",
        data: { value: this.get("adValue") },
      })
        .then(() => {
          const adSettings = this.get("adSettings");
          adSettings.set(this.get("name"), this.get("adValue"));
          this.setProperties({
            value: this.get("adValue"),
            savingStatus: i18n("saved"),
          });
        })
        .catch(popupAjaxError)
        .finally(() => {
          this.setProperties({
            saving: false,
            savingStatus: "",
          });
        });
    }
  }

  @action
  cancel() {
    this.set("adValue", this.get("value"));
  }
}
