import MultiSelectComponent from "select-kit/components/multi-select";
import computed from "ember-addons/ember-computed-decorators";
const { makeArray } = Ember;

export default MultiSelectComponent.extend({
  classNames: "house-ads-chooser",
  filterable: true,
  filterPlaceholder: "admin.adplugin.house_ads.filter_placeholder",
  tokenSeparator: "|",
  allowCreate: false,
  allowAny: false,
  settingValue: "",

  computeContent() {
    return makeArray(this.get("choices"));
  },

  // called after a selection is made
  mutateValues(values) {
    this.set("settingValue", values.join(this.get("tokenSeparator")));
  },

  // called when first rendered
  computeValues() {
    return this.get("settingValue")
      .split(this.get("tokenSeparator"))
      .filter(c => c);
  }
});
