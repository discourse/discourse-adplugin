import { computed } from "@ember/object";
import { makeArray } from "discourse-common/lib/helpers";
import MultiSelectComponent from "select-kit/components/multi-select";

export default MultiSelectComponent.extend({
  classNames: ["house-ads-chooser"],
  filterable: true,
  filterPlaceholder: "admin.adplugin.house_ads.filter_placeholder",
  tokenSeparator: "|",
  allowCreate: false,
  allowAny: false,
  settingValue: "",
  valueAttribute: null,
  nameProperty: null,

  value: computed("settingValue", function () {
    return this.settingValue
      .toString()
      .split(this.tokenSeparator)
      .filter(Boolean);
  }),

  // TODO: kept for legacy, remove when Discourse is 2.5
  mutateValues(values) {
    this.set("settingValue", values.join(this.tokenSeparator));
  },
  computeValues() {
    return this.settingValue.split(this.tokenSeparator).filter(Boolean);
  },

  content: computed("choices", function () {
    return makeArray(this.choices);
  }),

  actions: {
    onChange(value) {
      const settingValue = makeArray(value).join(this.tokenSeparator);
      this.onChange?.(settingValue);
    },
  },
});
