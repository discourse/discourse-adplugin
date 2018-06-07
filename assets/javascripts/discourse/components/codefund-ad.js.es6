var _loaded = false,
    _promise = null,
    currentUser = Discourse.User.current(),
    propertyId = Discourse.SiteSettings.codefund_property_code;

function loadCodeFund() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }
  
  if (_promise) {
    return _promise;
  }

  const url = 'https://codefund.io/t/s/' + propertyId + '/details.json';

  _promise = new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.onreadystatechange = handler;
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();

    function handler() {
      if (this.readyState === this.DONE) {
        _loaded = true;
        
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
        }
      }
    };
  });

  return _promise;
}


export default Ember.Component.extend({
  classNameBindings: [':codefund-ad', 'classForSlot', 'isResponsive:codefund-responsive'],
  propertyId: propertyId,
  adRequested: false,
  adDetails: {},

  _triggerAds() {
    this.set('adRequested', true);
    loadCodeFund().then((data) => {
      _loaded = false;
      _promise = null;
      this.set('adDetails', data);
      this.set('adRequested', false);
    }).catch(error => console.log(error));
  },

  didInsertElement() {
    this._super();

    if (!this.get('showAd')) { return; }

    if (this.get('listLoading')) { return; }

    Ember.run.scheduleOnce('afterRender', this, this._triggerAds);
  },

  waitForLoad: function() {
    if (this.get('adRequested')) { return; } // already requested that this ad unit be populated
    if (!this.get('listLoading')) {
      Ember.run.scheduleOnce('afterRender', this, this._triggerAds);
    }
  }.observes('listLoading'),

  checkTrustLevels: function() {
    return !((currentUser) && (currentUser.get('trust_level') > Discourse.SiteSettings.codefund_through_trust_level));
  }.property('trust_level'),

  showAd: function() {
    return Discourse.SiteSettings.codefund_property_code && this.get('checkTrustLevels');
  }.property('checkTrustLevels'),

  displayPostBottom: function() {
    return this.get('placement') === 'post-bottom';
  }.property('placement'),

  displayTopicAbovePostStream: function() {
    return this.get('placement') === 'topic-above-post-stream';
  }.property('placement'),

  displayTopicAboveSuggested: function() {
    return this.get('placement') === 'topic-above-suggested';
  }.property('placement'),

  displayTopicListTop: function() {
    return this.get('placement') === 'topic-list-top';
  }.property('placement')

});
