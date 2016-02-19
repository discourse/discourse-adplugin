import PostModel from 'discourse/models/post';

export default {
  name: 'extend-post-model',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');

  	PostModel.reopen({
  	  postSpecificCountDFP: function() {
   	    return this.get('post_number') === parseInt(siteSettings.dfp_nth_post_code);
  	  }.property('post_number'),

  	  postSpecificCountAdsense: function() {
        return this.get('post_number') === parseInt(siteSettings.adsense_nth_post_code);
  	  }.property('post_number'),

      postSpecificCountAmazon: function() {
        return this.get('post_number') === parseInt(siteSettings.amazon_nth_post_code);
      }.property('post_number'),
  	});
  }
};
