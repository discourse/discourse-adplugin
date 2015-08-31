import PageTracker from 'discourse/lib/page-tracker';

var ad_width = '';
var ad_height = '';
var ad_code = '';
var publisher_id = Discourse.SiteSettings.adsense_publisher_code;
var preGoogleVars = null;
var postGoogleVars = null;


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
    for (var i = 0; i < postGoogleVars.length; i++) {
      var key = postGoogleVars[i];
      window[key] = undefined;
    }
  }

  if(preGoogleVars === null) {
    preGoogleVars = [];
    for(var key in window) {
      if(key.indexOf("google") !== -1) {
        preGoogleVars.push(key);
      }
    }
  }
  
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true; ga.id="adsense_loader";
  ga.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
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
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

});

var data = {
  "topic-list-top" : {},
  "topic-above-post-stream" : {},
  "topic-above-suggested" : {},
  "post-bottom" : {}  
}


if (Discourse.SiteSettings.adsense_publisher_code) {
  if (Discourse.SiteSettings.adsense_topic_list_top_code && !Discourse.SiteSettings.adsense_show_topic_list_top) {
    data["topic-list-top"]["ad_code"] = Discourse.SiteSettings.adsense_topic_list_top_code;
    data["topic-list-top"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
    data["topic-list-top"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_list_top_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_topic_above_post_stream_code && !Discourse.SiteSettings.adsense_show_topic_above_post_stream) {
    data["topic-above-post-stream"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_post_stream_code;
    data["topic-above-post-stream"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
    data["topic-above-post-stream"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_post_stream_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_topic_above_suggested_code && !Discourse.SiteSettings.adsense_show_topic_above_suggested) {
    data["topic-above-suggested"]["ad_code"] = Discourse.SiteSettings.adsense_topic_above_suggested_code;
    data["topic-above-suggested"]["ad_width"] = parseInt(splitWidthInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
    data["topic-above-suggested"]["ad_height"] = parseInt(splitHeightInt(Discourse.SiteSettings.adsense_topic_above_suggested_ad_sizes));
  }
  if (Discourse.SiteSettings.adsense_post_bottom_code && !Discourse.SiteSettings.adsense_show_post_bottom) {
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

  init: function() {
    this.set('ad_width', data[this.placement]["ad_width"] );
    this.set('ad_height', data[this.placement]["ad_height"] );
    this.set('ad_code', data[this.placement]["ad_code"] );
    this._super();
  },
  
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