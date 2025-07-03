import { htmlSafe } from "@ember/template";
import discourseComputed from "discourse/lib/decorators";
import AdComponent from "./ad-component";

export default class CarbonadsAd extends AdComponent {
  serve_id = null;
  placement = null;
  format = null;

  init() {
    this.set("serve_id", this.siteSettings.carbonads_serve_id);
    this.set("placement", this.siteSettings.carbonads_placement);
    this.set("format", this.siteSettings.carbonads_format);
    super.init();
  }

  @discourseComputed("serve_id", "placement", "format")
  url(serveId, placement, format) {
    let baseUrl = `//cdn.carbonads.com/carbon.js?serve=${serveId}&placement=${placement}`;
    if (format) {
      baseUrl += `&format=${format}`;
    }

    return htmlSafe(baseUrl);
  }

  @discourseComputed
  showCarbonAds() {
    if (!this.currentUser) {
      return true;
    }

    return this.currentUser.show_carbon_ads;
  }

  @discourseComputed(
    "placement",
    "serve_id",
    "showCarbonAds",
    "showToGroups",
    "showOnCurrentPage"
  )
  showAd(placement, serveId, showCarbonAds, showToGroups, showOnCurrentPage) {
    return (
      placement && serveId && showCarbonAds && showToGroups && showOnCurrentPage
    );
  }

  <template>
    {{#if this.showAd}}
      {{! template-lint-disable no-forbidden-elements }}
      <script src={{this.url}} id="_carbonads_js" async type="text/javascript">
      </script>
    {{/if}}
  </template>
}
