export default Ember.Model.extend({

	PostSpecificCount: function() {
    	return this.get('post_number') % 5 === 0; 
  	}.property('post_number'),

})