import { withPluginApi } from 'discourse/lib/plugin-api';
import PageTracker from 'discourse/lib/page-tracker';

var ad_width = '';
var ad_height = '';
var ad_mobile_width = 320;
var ad_mobile_height = 50;
var currentUser = Discourse.User.current();
var publisher_id = Discourse.SiteSettings.adsense_publisher_code;
var mobile_width = 320;
var mobile_height = 50;

const mobileView = Discourse.Site.currentProp('mobileView');

function splitWidthInt(value) {
  var str = value.substring(0, 3);
  return str.trim();
}

function splitHeightInt(value) {
  var str = value.substring(4, 7);
  return str.trim();
}

// On each page change, the child is removed and elements part of Adsense's googleads are removed/undefined.
function changePage() {
  const ads = document.getElementById("adsense_loader");
  if (ads) {
    ads.parentNode.removeChild(ads);
    for (var key in window) {
      // Undefining all elements starting with google except for googletag so that the reloading doesn't affect dfp.  Potential future
      // conflicts may occur if other plugins have element starting with google.
      if(key.indexOf('google') !== -1 && key.indexOf('googletag') === -1) {
        window[key] = undefined;
      }
    }
  }

  // Reinitialize script so that the ad can reload
  const ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.id="adsense_loader";
  ga.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  const s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); 
}

function oldPluginCode() {
  PageTracker.current().on('change', changePage);
}

function watchPageChanges(api) {
  api.onPageChange(changePage);
}
withPluginApi('0.1', watchPageChanges, { noApi: oldPluginCode });

var data = {
  "topic-list-top" : {},
  "topic-above-post-stream" : {},
  "topic-above-suggested" : {},
  "post-bottom" : {}
};

if (Discourse.SiteSettings.adsense_publisher_code) {
  if (!mobileView && Discourse.SiteSettings.adsense_topic_list_top_code) {
    data["topic-list-top"]["ad_code"] = Discourse.SiteSettings.adsense_topic_list_top_code;
    data["topic-list-top"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
    data["topic-list-top"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_list_top_code) {
    data["topic-list-top"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_list_top_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_topic_above_post_stream_code) {
    data["topic-above-post-stream"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_post_stream_code;
    data["topic-above-post-stream"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
    data["topic-above-post-stream"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_code) {
    data["topic-above-post-stream"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_above_post_stream_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_topic_above_suggested_code) {
    data["topic-above-suggested"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_suggested_code;
    data["topic-above-suggested"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
    data["topic-above-suggested"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_topic_above_suggested_code) {
    data["topic-above-suggested"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_above_suggested_code;
  }
  if (!mobileView && Discourse.SiteSettings.adsense_post_bottom_code) {
    data["post-bottom"]["ad_code"] = Discourse.SiteSettings.adsense_post_bottom_code;
    data["post-bottom"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
    data["post-bottom"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
  }
  if (mobileView && Discourse.SiteSettings.adsense_mobile_post_bottom_code) {
    data["post-bottom"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_post_bottom_code;
  }
}

export default Ember.Component.extend({
  classNames: ['google-adsense'],
  loadedGoogletag: false,

  publisher_id: publisher_id,
  ad_width: ad_width,
  ad_height: ad_height,
  ad_mobile_width: ad_mobile_width,
  ad_mobile_height: ad_mobile_height,

  mobile_width: mobile_width,
  mobile_height: mobile_height,

  init: function() {
    this.set('ad_width', data[this.placement]["ad_width"] );
    this.set('ad_height', data[this.placement]["ad_height"] );
    this.set('ad_code', data[this.placement]["ad_code"] );
    this.set('ad_mobile_code', data[this.placement]["ad_mobile_code"] );
    this._super();
  },

  adWrapperStyle: function() {
    return `width: ${this.get('ad_width')}px; height: ${this.get('ad_height')}px;`.htmlSafe();
  }.property('ad_width', 'ad_height'),

  adInsStyle: function() {
    return `display: inline-block; ${this.get('adWrapperStyle')}`.htmlSafe();
  }.property('adWrapperStyle'),

  adWrapperStyleMobile: function() {
    return `width: ${this.get('ad_mobile_width')}px; height: ${this.get('ad_mobile_height')}px;`.htmlSafe();
  }.property('ad_mobile_width', 'ad_mobile_height'),

  adTitleStyleMobile: function() {
    return `width: ${this.get('ad_mobile_width')}px;`.htmlSafe();
  }.property('ad_mobile_width'),

  adInsStyleMobile: function() {
    return `display: inline-block; ${this.get('adWrapperStyleMobile')}`.htmlSafe();
  }.property('adWrapperStyleMobile'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.adsense_through_trust_level));
  }.property('trust_level'),
});
