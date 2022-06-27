import AdComponent from "discourse/plugins/discourse-adplugin/discourse/components/ad-component";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import { isBlank } from "@ember/utils";

const adIndex = {
  topic_list_top: null,
  topic_above_post_stream: null,
  topic_above_suggested: null,
  post_bottom: null,
  topic_list_between: null,
};

export default AdComponent.extend({
  classNames: ["house-creative"],
  classNameBindings: ["adUnitClass"],
  attributeBindings: ["colspanAttribute:colspan"],
  adHtml: "",

  @discourseComputed
  colspanAttribute() {
    return this.tagName === "td" ? "5" : null;
  },

  @discourseComputed("placement", "showAd")
  adUnitClass(placement, showAd) {
    return showAd ? `house-${placement}` : "";
  },

  @discourseComputed(
    "showToGroups",
    "showAfterPost",
    "showAfterTopicListItem",
    "showOnCurrentPage"
  )
  showAd(
    showToGroups,
    showAfterPost,
    showAfterTopicListItem,
    showOnCurrentPage
  ) {
    return (
      showToGroups &&
      (showAfterPost || showAfterTopicListItem) &&
      showOnCurrentPage
    );
  },

  @discourseComputed("postNumber", "placement")
  showAfterPost(postNumber, placement) {
    if (!postNumber && placement !== "topic-list-between") {
      return true;
    }

    return this.isNthPost(
      parseInt(this.site.get("house_creatives.settings.after_nth_post"), 10)
    );
  },

  @discourseComputed("placement")
  showAfterTopicListItem(placement) {
    if (placement !== "topic-list-between") {
      return true;
    }

    return this.isNthTopicListItem(
      parseInt(this.site.get("house_creatives.settings.after_nth_topic"), 10)
    );
  },

  chooseAdHtml() {
    const houseAds = this.site.get("house_creatives"),
      placement = this.get("placement").replace(/-/g, "_"),
      adNames = this.adsNamesForSlot(placement);

    if (adNames.length > 0) {
      if (!adIndex[placement]) {
        adIndex[placement] = 0;
      }
      let ad = houseAds.creatives[adNames[adIndex[placement]]] || "";
      adIndex[placement] = (adIndex[placement] + 1) % adNames.length;
      return ad;
    } else {
      return "";
    }
  },

  adsNamesForSlot(placement) {
    const houseAds = this.site.get("house_creatives");

    if (!houseAds || !houseAds.settings) {
      return [];
    }

    const adsForSlot = houseAds.settings[placement];

    if (Object.keys(houseAds.creatives).length > 0 && !isBlank(adsForSlot)) {
      return adsForSlot.split("|");
    } else {
      return [];
    }
  },

  @observes("refreshOnChange")
  refreshAd() {
    if (this.get("listLoading")) {
      return;
    }

    this.set("adHtml", this.chooseAdHtml());
  },

  didInsertElement() {
    this._super(...arguments);

    if (!this.get("showAd")) {
      return;
    }

    if (this.get("listLoading")) {
      return;
    }

    if (adIndex.topic_list_top === null) {
      // start at a random spot in the ad inventory
      Object.keys(adIndex).forEach((placement) => {
        const adNames = this.adsNamesForSlot(placement);
        adIndex[placement] = Math.floor(Math.random() * adNames.length);
      });
    }

    this.refreshAd();
  },
});
