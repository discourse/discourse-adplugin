import PageTracker from 'discourse/lib/page-tracker';

var ad_width = '';
var ad_height = '';
var ad_code = '';
var ad_mobile_width = 320;
var ad_mobile_height = 50;
var ad_mobile_code = '';
var currentUser = Discourse.User.current();
var publisher_id = Discourse.SiteSettings.adsense_publisher_code;
var preGoogleVars = null;
var postGoogleVars = null;
var mobile_width = 320;
var mobile_height = 50;


function splitWidthInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

function splitHeightInt(value) {
    var str = value.substring(4, 7);
    return str.trim();
}

// On each page change, the child is removed and elements part of Adsense's googleads are removed/undefined.
PageTracker.current().on('change', function(url) {
  var ads = document.getElementById("adsense_loader");
  if (ads) {
    ads.parentNode.removeChild(ads);
    for (var i = 0; i < postGoogleVars.length; i++) {
      var key = postGoogleVars[i];
      window[key] = undefined;
    }
  }

// This is an array of all elements that start with google (adsense related or not)
  if(preGoogleVars === null) {
    preGoogleVars = [];
    for(var key in window) {
      if(key.indexOf("google") !== -1) {
        preGoogleVars.push(key);
      }
    }
  }

// Reinitialize script so that the ad can reload
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.id="adsense_loader";
  ga.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
// Creates array of postGoogle vars which are only elements starting with 'google' related to 
// Adsense's googleads.  This array is used in line 34 to undefine google elements related to Adsense only.
  ga.addEventListener('load', function(e) {
    if(postGoogleVars === null) {
      postGoogleVars = [];

      for(var key in window) {
        if(key.indexOf("google") !== -1 && preGoogleVars.indexOf(key) == -1) {
          postGoogleVars.push(key);
        }
      }
    }
  });
  // Puts relevant elements back into script.
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
});

var data = {
  "topic-list-top" : {},
  "topic-above-post-stream" : {},
  "topic-above-suggested" : {},
  "post-bottom" : {}  
}


if (Discourse.SiteSettings.adsense_publisher_code) {
  if (!Discourse.SiteSettings.adsense_show_topic_list_top && !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.adsense_through_trust_level))) {
    if (!Discourse.Mobile.mobileView && Discourse.SiteSettings.adsense_topic_list_top_code) {
      data["topic-list-top"]["ad_code"] = Discourse.SiteSettings.adsense_topic_list_top_code;
      data["topic-list-top"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
      data["topic-list-top"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
    } 
    if (Discourse.Mobile.mobileView && Discourse.SiteSettings.adsense_mobile_topic_list_top_code) {
      data["topic-list-top"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_list_top_code;
    }  
  }
  if (Discourse.SiteSettings.adsense_topic_above_post_stream_code && !Discourse.SiteSettings.adsense_show_topic_above_post_stream && !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.adsense_through_trust_level))) {
    data["topic-above-post-stream"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_post_stream_code;
    data["topic-above-post-stream"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
    data["topic-above-post-stream"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_topic_above_suggested_code && !Discourse.SiteSettings.adsense_show_topic_above_suggested && !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.adsense_through_trust_level))) {
    data["topic-above-suggested"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_suggested_code;
    data["topic-above-suggested"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
    data["topic-above-suggested"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_post_bottom_code && !Discourse.SiteSettings.adsense_show_post_bottom && !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.adsense_through_trust_level))) {
    data["post-bottom"]["ad_code"] = Discourse.SiteSettings.adsense_post_bottom_code;
    data["post-bottom"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
    data["post-bottom"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_post_bottom_ad_sizes));
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
    return `width: ${this.get('ad_width')}px; height: ${this.get('ad_height')}px; margin:0 auto;`.htmlSafe();
  }.property('ad_width', 'ad_height'),

  adInsStyle: function() {
    return `display: inline-block; ${this.get('adWrapperStyle')}`.htmlSafe();
  }.property('adWrapperStyle'),

  adWrapperStyleMobile: function() {
    return `width: ${this.get('ad_mobile_width')}px; height: ${this.get('ad_mobile_height')}px; margin:0 auto;`.htmlSafe();
  }.property('ad_mobile_width', 'ad_mobile_height'),

  adInsStyleMobile: function() {
    return `display: inline-block; ${this.get('adWrapperStyleMobile')}`.htmlSafe();
  }.property('adWrapperStyleMobile'),
});