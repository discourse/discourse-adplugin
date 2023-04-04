import DiscourseRoute from "discourse/routes/discourse";
import EmberObject from "@ember/object";
import I18n from "I18n";

export default DiscourseRoute.extend({
  model(params) {
    if (params.ad_id === "new") {
      return EmberObject.create({
        name: I18n.t("admin.adplugin.house_ads.new_name"),
        html: "",
        visible_to_logged_in_users: true,
        visible_to_anons: true,
      });
    } else {
      return this.modelFor("adminPlugins.houseAds").findBy(
        "id",
        parseInt(params.ad_id, 10)
      );
    }
  },
});
