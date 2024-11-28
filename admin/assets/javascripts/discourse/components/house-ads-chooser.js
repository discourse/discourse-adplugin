import { action, computed } from "@ember/object";
import { classNames } from "@ember-decorators/component";
import { makeArray } from "discourse-common/lib/helpers";
import MultiSelectComponent from "select-kit/components/multi-select";

@classNames("house-ads-chooser")
export default class HouseAdsChooser extends MultiSelectComponent {
  filterable = true;
  filterPlaceholder = "admin.adplugin.house_ads.filter_placeholder";
  tokenSeparator = "|";
  allowCreate = false;
  allowAny = false;
  settingValue = "";
  valueAttribute = null;
  nameProperty = null;

  @computed("settingValue")
  get value() {
    return this.settingValue
      .toString()
      .split(this.tokenSeparator)
      .filter(Boolean);
  }

  // TODO: kept for legacy, remove when Discourse is 2.5
  mutateValues(values) {
    this.set("settingValue", values.join(this.tokenSeparator));
  }

  computeValues() {
    return this.settingValue.split(this.tokenSeparator).filter(Boolean);
  }

  @computed("choices")
  get content() {
    return makeArray(this.choices);
  }

  @action
  onChange(value) {
    const settingValue = makeArray(value).join(this.tokenSeparator);
    this.onChange?.(settingValue);
  }
}
