import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { i18n, propertyNotEqual } from "discourse/lib/computed";
import I18n from "I18n";

export default Ember.Component.extend({
  classNames: "house-ads-setting",
  adValue: "",
  saving: false,
  savingStatus: "",
  title: i18n("name", "admin.adplugin.house_ads.%@.title"),
  help: i18n("name", "admin.adplugin.house_ads.%@.description"),
  changed: propertyNotEqual("adValue", "value"),

  init() {
    this._super(...arguments);
    this.set("adValue", this.get("value"));
  },

  actions: {
    save() {
      if (!this.get("saving")) {
        this.setProperties({
          saving: true,
          savingStatus: I18n.t("saving"),
        });

        ajax(
          `/admin/plugins/pluginad/house_settings/${this.get("name")}.json`,
          {
            type: "PUT",
            data: { value: this.get("adValue") },
          }
        )
          .then(() => {
            const adSettings = this.get("adSettings");
            adSettings.set(this.get("name"), this.get("adValue"));
            this.setProperties({
              value: this.get("adValue"),
              savingStatus: I18n.t("saved"),
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
    },

    cancel() {
      this.set("adValue", this.get("value"));
    },
  },
});
