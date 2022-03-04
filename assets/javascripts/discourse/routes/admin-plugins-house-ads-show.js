import DiscourseRoute from "discourse/routes/discourse";
import I18n from "I18n";

export default DiscourseRoute.extend({
  model(params) {
    if (params.ad_id === "new") {
      return Ember.Object.create({
        name: I18n.t("admin.adplugin.house_ads.new_name"),
        html: "",
      });
    } else {
      return this.modelFor("adminPlugins.houseAds").findBy(
        "id",
        parseInt(params.ad_id, 10)
      );
    }
  },
});
