import PostModel from 'discourse/models/post';

export default {
  name: 'extend-post-model',
  initialize() {
  	PostModel.reopen({
  	  postSpecificCount: function() {
   	    return this.get('post_number') % 2 === 0; 
  	  }.property('post_number')
  	});
  }
};
