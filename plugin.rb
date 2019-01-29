# name: discourse-adplugin
# about: Ad Plugin for Discourse
# version: 1.0.2
# authors: Vi and Sarah (@ladydanger and @cyberkoi)
# url: https://github.com/discourse/discourse-adplugin

register_css <<CSS

@import "common/foundation/variables";
@import "common/foundation/mixins";

.google-dfp-ad {
  padding: 3px 0;
  margin-bottom: 10px;
  clear: both;
}

.google-dfp-ad  .dfp-ad-unit {
  margin: 0 auto;
}

.google-adsense {
  padding: 3px 0;
  margin-bottom: 10px;
  clear: both;
}

.google-adsense.adsense-responsive {
  width: 100%;
}

.google-adsense .google-adsense-label {
  width: 728px;
  max-width: 100%;
  margin: 0 auto;
}

.google-adsense.adsense-responsive .google-adsense-label {
  width: 100%;
  text-align: center;
}

.google-adsense .adsense-unit {
  margin: 0 auto;
}

.google-adsense .google-adsense-label h2 {
  margin: 4px 0 !important;
  color: #858a8c;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
}

.google-adsense .google-adsense-content {
  margin: 0 auto;
}

.google-adsense.adsense-post-bottom {
  max-width: 735px;
  padding: 0 11px;
}

@media all
and (max-width : 775px) {
  .google-adsense.adsense-post-bottom {
    box-sizing: border-box;
    width: 100%;
  }
}

.amazon-product-links {
  padding: 3px;
  margin-bottom: 10px;
  clear: both;
}

.amazon-product-links  .amazon-unit {
  margin: 0 auto;
}

.amazon-product-links .amazon-product-links-label {
  width: 728px;
  margin: 0 auto;
}

.amazon-product-links .amazon-product-links-label h2 {
  margin: 4px 0 !important;
  color: #858a8c;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
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

.google-dfp-ad.dfp-ad-post-bottom {
  .google-dfp-ad-label, .dfp-ad-unit {
    margin: 0 0 0 52px;
  }
}

.codefund-wrapper {
  z-index: 1;
  font-family: system, "Helvetica Neue", Helvetica, Arial;
  font-size: 13px;
  box-sizing: border-box;
  width: 100%;
  line-height: 1.5;
  display: block;
  background-color: $primary-very-low;
  padding: 12px 11px;
  text-align: left;
  margin: 12px 0;
}

.codefund-wrapper .codefund-text {
  color: dark-light-choose($primary-medium, $secondary-medium);
  text-decoration: none;
  cursor: pointer;
}

.codefund-wrapper .codefund-text:hover {
  text-decoration: underline;
}

.codefund-wrapper .codefund-text strong {
  color: $primary;
}

.codefund-wrapper .codefund-powered-by:hover {
  text-decoration: underline;
}

.codefund-wrapper .codefund-label {
  margin-right: 4px;
  padding: 2px 6px;
  border-radius: 3px;
  background-color:  $tertiary;
  color: $secondary;
}

.codefund-wrapper .codefund-label:hover {
  text-decoration: none !important;
}

.codefund-wrapper .codefund-powered-by {
  text-decoration: none;
  color: dark-light-choose($primary-medium, $secondary-medium);
  float: right;
  font-size: 12px;
}

.codefund-wrapper .codefund-powered-by:hover {
  text-decoration: underline;
  cursor: pointer;
}

.codefund-wrapper.codefund-post-bottom {
  width: 757px;
  text-align: center;
}

CSS
