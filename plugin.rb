# name: discourse-adplugin
# about: Ad Plugin for Discourse (dfp)
# version: 0.1
# authors: Vi and Sarah (Team Melbourne)

register_css <<CSS

.google-dfp-ad {
  padding: 3px;
  margin-bottom: 10px;
  clear: both;
}

.google-dfp-ad  .dfp-ad-unit {
  margin: 0 auto;
}

.google-dfp-ad .google-dfp-ad-label {
  width: 728px;
  margin: 0 auto;
}

.google-dfp-ad .google-dfp-ad-label h2 {
  margin: 4px 0 !important;
  color: #858a8c;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
}

CSS