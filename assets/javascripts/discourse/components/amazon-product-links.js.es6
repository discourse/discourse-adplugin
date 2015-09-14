import loadScript from 'discourse/lib/load-script';

var amazon_code = '';
var amazon_width = '';
var amazon_height = '';
var amazon_mobile_width = 320;
var amazon_mobile_height = 50;
var user_input = '';
var currentUser = Discourse.User.current();
var product_type = 'Product/Easy Banner Link';
var recommended_type = 'Native Shopping Ad - Recommended';
var custom_type = 'Native Shopping Ad - Custom';
var search_type = 'Native Shopping Ad - Search';
var urlCode = '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US'
var adunit0 = 'adunit0'

function splitWidthInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

function splitHeightInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

var _loaded = false,
    _promise = null;


function loadAmazon(settings) {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  // The Amazon SRC using Discourse.org loadScript
  var amazon_aff = document.createElement('script');
  amazon_aff.src = '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US';
  _promise = loadScript(amazon_aff, { scriptTag: true }).then(function() {
    _loaded = true;
    if (window.amazon_aff === undefined) {
      console.log('amazon tag is undefined!');
    }
    // pushing that script if someone select Native Shopping Ad as a category
    // At this point, it should go to amazon product links.hbs and serve the ads.
    amazon_aff.cmd.push(function() {
      if (settings.amazon_topic_list_top_ad_category === "Native Shopping Ad - Recommended") {
    };

    });
  });

  return _promise;
}


/*window.onload = function() {

// Reinitialize script so that the ad can reload
  // var amazon_aff = document.createElement('script'); amazon_aff.type = 'text/javascript'; amazon_aff.async = true;
  // amazon_aff.src = '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US';

  if (Discourse.SiteSettings.amazon_topic_list_top_ad_category === "Native Shopping Ad - Recommended") {
    user_input = Discourse.SiteSettings.amazon_topic_list_top_src_code;
  };
  var amazon_aff = document.createElement('script'); amazon_aff.type = 'text/javascript'; amazon_aff.async = true;
  amazon_aff.src = '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(amazon_aff, s);
   
};
*/
if (Discourse.SiteSettings.amazon_topic_list_top_src_code) {
  if (Discourse.SiteSettings.amazon_topic_list_top_ad_category === 'Product/Easy Banner Link' && !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.amazon_through_trust_level))) {
    user_input = Discourse.SiteSettings.amazon_topic_list_top_src_code;
    amazon_width = parseInt(Discourse.SiteSettings.amazon_topic_list_top_ad_width_code);
    amazon_height = parseInt(Discourse.SiteSettings.amazon_topic_list_top_ad_height_code);
  } 
  //if (Discourse.Mobile.mobileView && Discourse.SiteSettings.adsense_mobile_topic_list_top_code) {
  //  data["topic-list-top"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_list_top_code;
  //}
}


/*      amazon_tracking_id_code: "Choose Tracking ID Code"
        amazon_region_code: "Choose the Generic Amazon Marketplace Region"
        amazon_topic_list_top_src_code: "Input your Src code"
        amazon_topic_list_top_title_code: "Input your Ad Description"
        amazon_topic_list_top_ad_width_code: "Choose your ad width"
        amazon_topic_list_top_ad_height_code: "Choose your ad height"
        amazon_topic_list_top_custom_product_id_code: "Input relevant ad codes"
        amazon_topic_list_top_link_id_code: "Input your Link ID"
        amazon_topic_list_top_ad_mode_code: "Choose either manual (custom), auto (recommended), search (search)"
        amazon_topic_list_top_fallback_mode_value_code: "Input value that corresponds to type: search"
        amazon_topic_list_top_row_ads_code: "Input number of ad display rows"
        amazon_topic_list_top_default_category_code: "Input default category"
        amazon_topic_list_top_search_phrase_code: "Input search phrase"
        amazon_nth_post_code: "Choose the Nth position for your ad to show"
        amazon_through_trust_level: "Input trust level" */

// Ember component - the class is the adblock and css
export default Ember.Component.extend({
  amazon_width: amazon_width,
  amazon_height: amazon_height,
  amazon_mobile_width: amazon_mobile_width,
  amazon_mobile_height: amazon_mobile_height,
  user_input: user_input,
  product_type: product_type,
  recommended_type: recommended_type,
  search_type: search_type,
  custom_type: custom_type,
  urlCode: urlCode,
  adunit0: adunit0,

  classNames: ['amazon-product-links'],
  loadedAmazontag: false,

  _initAmazon: function() {
    var self = this;
    loadAmazon(this.siteSettings).then(function() {
      self.set('loadedAmazontag', true);
    });
  }.on('didInsertElement'),

  // // Part of the divID of the div part of Amazon
  // divId: function() {
  //   return "amzn_assoc_ad_div_" + this.get('adunit0') + "_0";
  // }.property('adunit0'),

  adWrapperStyle: function() {
    return `width: ${this.get('amazon_width')}px; height: ${this.get('amazon_height')}px;`.htmlSafe();
  }.property('amazon_width', 'amazon_height'),

  adWrapperStyleMobile: function() {
    return `width: ${this.get('amazon_mobile_width')}px; height: ${this.get('amazon_mobile_height')}px;`.htmlSafe();
  }.property('amazon_mobile_width', 'amazon_mobile_height'),

  srcCode: function() {
    return `${this.get('urlCode')}`.htmlSafe();
  }.property('urlCode'),

  userInput: function() {
    return `${this.get('user_input')}`.htmlSafe();
  }.property('user_input'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.amazon_through_trust_level));
  }.property('trust_level'),

  typeProductCategory: function() {
    return Discourse.SiteSettings.amazon_topic_list_top_ad_category === this.get('product_type');
  }.property('product_type'),

  typeRecommendedCategory: function() {
    return Discourse.SiteSettings.amazon_topic_list_top_ad_category === this.get('recommended_type');
  }.property('recommended_type'),

  typeSearchCategory: function() {
    return Discourse.SiteSettings.amazon_topic_list_top_ad_category === this.get('search_type');
  }.property('search_type'),

  typeCustomCategory: function() {
    return Discourse.SiteSettings.amazon_topic_list_top_ad_category === this.get('custom_type');
  }.property('custom_type'),
});