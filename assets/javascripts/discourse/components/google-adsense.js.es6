import PageTracker from 'discourse/lib/page-tracker';

var ad_width = '';
var ad_height = '';
var ad_code = '';
var publisher_id = Discourse.SiteSettings.adsense_publisher_code;

function splitWidthInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

function splitHeightInt(value) {
    var str = value.substring(4, 7);
    return str.trim();
}


PageTracker.current().on('change', function(url) {

  var ads = document.getElementById("adsense_loader");
  if (ads) {
    // clear the old element and its state
    //ads.remove();
    ads.parentNode.removeChild(ads);
    for (var key in window) {
      if (key.indexOf("google") !== -1){
        window[key] = undefined;
      }
    }
  }

  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.id="adsense_loader";
  ga.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

});


if (Discourse.SiteSettings.adsense_publisher_code) {
  if (Discourse.SiteSettings.adsense_topic_list_top_code && !Discourse.SiteSettings.adsense_show_topic_list_top) {
    ad_code = Discourse.SiteSettings.adsense_topic_list_top_code;
    ad_width = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
    ad_height = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_topic_above_post_stream_code && !Discourse.SiteSettings.adsense_show_topic_above_post_stream) {
    ad_code = Discourse.SiteSettings.adsense_topic_above_post_stream_code;
    ad_width = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
    ad_height = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_topic_above_suggested_code && !Discourse.SiteSettings.adsense_show_topic_above_suggested) {
    ad_code = Discourse.SiteSettings.adsense_topic_above_suggested_code;
    ad_width = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
    ad_height = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_post_bottom_code && !Discourse.SiteSettings.adsense_show_post_bottom) {
    ad_code = Discourse.SiteSettings.adsense_post_bottom_code;
    ad_width = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
    ad_height = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
  }
}


export default Ember.Component.extend({
  classNames: ['google-adsense'],
  loadedGoogletag: false,

  publisher_id: publisher_id,
  ad_width: ad_width,
  ad_height: ad_height,

  adWrapperStyle: function() {
    return `width: ${this.get('ad_width')}px; height: ${this.get('ad_height')}px; margin:0 auto;`.htmlSafe();
  }.property('ad_width', 'ad_height'),

  adInsStyle: function() {
    return `display: inline-block; ${this.get('adWrapperStyle')}`.htmlSafe();
  }.property('adWrapperStyle'),

  adWrapperStyleMobile: function() {
    return `width: 320px; height: 50px; margin:0 auto;`.htmlSafe();
  },

  adInsStyleMobile: function() {
    return `display: inline-block; ${this.get('adWrapperStyleMobile')}`.htmlSafe();
  }.property('adWrapperStyleMobile'),
});