import Controller, { inject as controller } from "@ember/controller";
import { alias } from "@ember/object/computed";

export default Controller.extend({
  adminPluginsHouseAds: controller("adminPlugins.houseAds"),
  houseAds: alias("adminPluginsHouseAds.model"),
  adSettings: alias("adminPluginsHouseAds.houseAdsSettings"),
});
