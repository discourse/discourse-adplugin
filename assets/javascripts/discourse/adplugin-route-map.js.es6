export default {
  resource: "admin.adminPlugins",
  path: "/plugins",
  map() {
    this.route("houseAds", { path: "/adplugin/house_ads" }, function() {
      this.route("index", { path: "/" });
      this.route("show", { path: "/:ad_id" });
    });
  }
};
