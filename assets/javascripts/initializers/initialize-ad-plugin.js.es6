import PostModel from 'discourse/models/post';
import { withPluginApi } from 'discourse/lib/plugin-api';

export default {
  name: 'initialize-ad-plugin',
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

    withPluginApi('0.1', api => {
      api.decorateWidget('post:after', dec => {
        return dec.connect({
          templateName: 'connectors/post-bottom/discourse-adplugin',
          context: 'model'
        });
      });
    });
  }
};
