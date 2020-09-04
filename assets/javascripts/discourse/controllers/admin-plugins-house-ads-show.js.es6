import I18n from "I18n";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { propertyNotEqual } from "discourse/lib/computed";
import { bufferedProperty } from "discourse/mixins/buffered-content";

export default Ember.Controller.extend(bufferedProperty("model"), {
  adminPluginsHouseAds: Ember.inject.controller("adminPlugins.houseAds"),

  saving: false,
  savingStatus: "",

  nameDirty: propertyNotEqual("buffered.name", "model.name"),
  htmlDirty: propertyNotEqual("buffered.html", "model.html"),
  dirty: Ember.computed.or("nameDirty", "htmlDirty"),
  disableSave: Ember.computed.not("dirty"),

  actions: {
    save() {
      if (!this.get("saving")) {
        this.setProperties({
          saving: true,
          savingStatus: I18n.t("saving"),
        });

        const data = {},
          buffered = this.get("buffered"),
          newRecord = !buffered.get("id");

        if (!newRecord) {
          data.id = buffered.get("id");
        }
        data.name = buffered.get("name");
        data.html = buffered.get("html");

        ajax(
          newRecord
            ? `/admin/plugins/pluginad/house_creatives`
            : `/admin/plugins/pluginad/house_creatives/${buffered.get("id")}`,
          {
            type: newRecord ? "POST" : "PUT",
            data,
          }
        )
          .then((ajaxData) => {
            this.commitBuffer();
            this.set("savingStatus", I18n.t("saved"));
            if (newRecord) {
              const model = this.get("model");
              model.set("id", ajaxData.house_ad.id);
              const houseAds = this.get("adminPluginsHouseAds.model");
              if (!houseAds.includes(model)) {
                houseAds.pushObject(model);
              }
              this.transitionToRoute(
                "adminPlugins.houseAds.show",
                model.get("id")
              );
            }
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
      this.rollbackBuffer();
    },

    destroy() {
      const houseAds = this.get("adminPluginsHouseAds.model");
      const model = this.get("model");

      if (!model.get("id")) {
        this.transitionToRoute("adminPlugins.houseAds.index");
        return;
      }

      ajax(`/admin/plugins/pluginad/house_creatives/${model.get("id")}`, {
        type: "DELETE",
      })
        .then(() => {
          houseAds.removeObject(model);
          this.transitionToRoute("adminPlugins.houseAds.index");
        })
        .catch(() => bootbox.alert(I18n.t("generic_error")));
    },
  },
});
