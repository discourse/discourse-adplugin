import loadScript from 'discourse/lib/load-script';

var const_width = '';
var const_height = '';

var _loaded = false,
    _promise = null;


function splitWidthInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

function splitHeightInt(value) {
    var str = value.substring(4, 7);
    return str.trim();
}
  
function loadGoogle(settings) {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  // The boilerplate code
  var dfpSrc = (('https:' == document.location.protocol) ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
  _promise = loadScript(dfpSrc, { scriptTag: true }).then(function() {
    _loaded = true;
    if (window.googletag === undefined) {
      console.log('googletag is undefined!');
    }

    // Define our ad units - extend for mobile view.
    // if statement?  the code should be able to run without the custom targeting settings
    googletag.cmd.push(function() {
      if (settings.dfp_topic_list_top_code && !settings.dfp_show_topic_list_top && settings.topic_list_top_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_list_top_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_list_top_ad_sizes));
        googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_list_top_code, [parseInt(splitWidthInt(settings.topic_list_top_ad_sizes)), parseInt(splitHeightInt(settings.topic_list_top_ad_sizes))], 'div-gpt-ad-topic-list-top')
        // Inventory or slot level custom targeting goes here for each of the defined ad units - needs input and injection.
        // The ad runs with .setTargeting('gender', ['female'])
        .addService(googletag.pubads());
      }
      if (settings.dfp_topic_above_post_stream_code && !settings.dfp_show_topic_above_post_stream && settings.topic_above_post_stream_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_above_post_stream_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_above_post_stream_ad_sizes));
        googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_post_stream_code, [parseInt(splitWidthInt(settings.topic_above_post_stream_ad_sizes)), parseInt(splitHeightInt(settings.topic_above_post_stream_ad_sizes))], 'div-gpt-ad-topic-above-post-stream').addService(googletag.pubads());
      }
      if (settings.dfp_topic_above_suggested_code && !settings.dfp_show_topic_above_suggested && settings.topic_above_suggested_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.topic_above_suggested_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.topic_above_suggested_ad_sizes));
        googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_topic_above_suggested_code, [parseInt(splitWidthInt(settings.topic_above_suggested_ad_sizes)), parseInt(splitHeightInt(settings.topic_above_suggested_ad_sizes))], 'div-gpt-ad-topic-above-suggested').addService(googletag.pubads());
      }
      if (settings.dfp_post_bottom_code && !settings.dfp_show_post_bottom && settings.post_bottom_ad_sizes) {
        const_width = parseInt(splitWidthInt(settings.post_bottom_ad_sizes));
        const_height = parseInt(splitHeightInt(settings.post_bottom_ad_sizes));
        googletag.defineSlot('/' + settings.dfp_publisher_id + '/' + settings.dfp_post_bottom_code, [parseInt(splitWidthInt(settings.post_bottom_ad_sizes)), parseInt(splitHeightInt(settings.post_bottom_ad_sizes))], 'div-gpt-ad-post-bottom').addService(googletag.pubads());
      }

    // Page Level custom targeting goes here - needs an input section and also ad tags on the relevant pages      
      googletag.pubads().enableSingleRequest();
      googletag.enableServices();
    });
  });

  return _promise;
}


// Ember component - the class is the adblock and css
export default Ember.Component.extend({
  const_width: const_width,
  const_height: const_height,

  classNames: ['google-dfp-ad'],
  loadedGoogletag: false,

  // Part of the divID of the div part of the GPT
  divId: function() {
    return "div-gpt-ad-" + this.get('placement');
  }.property('placement'),

//settings.dfp_topic_list_top_custom_targeting_code
  _initGoogleDFP: function() {
    var self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set('loadedGoogletag', true);
    });
  }.on('didInsertElement')
});
