import loadScript from 'discourse/lib/load-script';

const const_width = 300;
const const_height = 250;

var _loaded = false,
    _promise = null;


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
    googletag.cmd.push(function() {
      if (settings.dfp_topic_list_top_code && !settings.dfp_show_topic_list_top) {
        googletag.defineSlot(settings.dfp_topic_list_top_code, [parseInt(settings.dfp_size_topic_list_top_width_code), parseInt(settings.dfp_size_topic_list_top_height_code)], 'div-gpt-ad-topic-list-top').addService(googletag.pubads());
      }
      if (settings.dfp_topic_above_post_stream_code && !settings.dfp_show_topic_above_post_stream) {
        googletag.defineSlot(settings.dfp_topic_above_post_stream_code, [parseInt(settings.dfp_size_topic_above_post_stream_width_code), parseInt(settings.dfp_size_topic_above_post_stream_height_code)], 'div-gpt-ad-topic-above-post-stream').addService(googletag.pubads());
      }
      if (settings.dfp_topic_above_suggested_code && !settings.dfp_show_topic_above_suggested) {
        googletag.defineSlot(settings.dfp_topic_above_suggested_code, [parseInt(settings.dfp_size_topic_above_suggested_width_code), parseInt(settings.dfp_size_topic_above_suggested_height_code)], 'div-gpt-ad-topic-above-suggested').addService(googletag.pubads());
      }
      if (settings.dfp_post_bottom_code && !settings.dfp_show_post_bottom) {
        googletag.defineSlot(settings.dfp_post_bottom_code, [parseInt(settings.dfp_size_post_bottom_width_code), parseInt(settings.dfp_size_post_bottom_height_code)], 'div-gpt-ad-post-bottom').addService(googletag.pubads());
      }
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

  _initGoogleDFP: function() {
    var self = this;
    loadGoogle(this.siteSettings).then(function() {
      self.set('loadedGoogletag', true);
    });
  }.on('didInsertElement')
});
