var amazon_code = '';
var amazon_width = '';
var amazon_height = '';
var amazon_mobile_width = 320;
var amazon_mobile_height = 50;
var user_input = Discourse.SiteSettings.amazon_topic_list_top_code;
var currentUser = Discourse.User.current();

function splitWidthInt(value) {
    var str = value.substring(0, 3);
    return str.trim();
}

function splitHeightInt(value) {
    var str = value.substring(4, 7);
    return str.trim();
}

if (Discourse.SiteSettings.amazon_topic_list_top_code) {
  if (!((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.amazon_through_trust_level))) {
    user_input = Discourse.SiteSettings.amazon_topic_list_top_code;
    amazon_width = parseInt(splitWidthInt(Discourse.SiteSettings.amazon_topic_list_top_ad_sizes));
    amazon_height = parseInt(splitHeightInt(Discourse.SiteSettings.amazon_topic_list_top_ad_sizes));
  } 
  //if (Discourse.Mobile.mobileView && Discourse.SiteSettings.adsense_mobile_topic_list_top_code) {
  //  data["topic-list-top"]["ad_mobile_code"] = Discourse.SiteSettings.adsense_mobile_topic_list_top_code;
  //}
}

// Ember component - the class is the adblock and css
export default Ember.Component.extend({
  amazon_width: amazon_width,
  amazon_height: amazon_height,
  amazon_mobile_width: amazon_mobile_width,
  amazon_mobile_height: amazon_mobile_height,
  user_input: user_input,

  classNames: ['amazon-product-links'],

  adWrapperStyle: function() {
    return `width: ${this.get('amazon_width')}px; height: ${this.get('amazon_height')}px;`.htmlSafe();
  }.property('amazon_width', 'amazon_height'),

  adWrapperStyleMobile: function() {
    return `width: ${this.get('amazon_mobile_width')}px; height: ${this.get('amazon_mobile_height')}px;`.htmlSafe();
  }.property('amazon_mobile_width', 'amazon_mobile_height'),

  userInput: function() {
    return `${this.get('user_input')}`.htmlSafe();
  }.property('user_input'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.amazon_through_trust_level));
  }.property('trust_level'),

});