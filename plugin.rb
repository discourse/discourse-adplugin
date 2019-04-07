# name: discourse-adplugin
# about: Ad Plugin for Discourse
# version: 1.1.0
# authors: Vi and Sarah (@ladydanger and @cyberkoi)
# url: https://github.com/discourse/discourse-adplugin

register_asset "stylesheets/adplugin.scss"

after_initialize do
  require_dependency 'application_controller'
  class ::AdstxtController < ::ApplicationController
    skip_before_action :check_xhr

    def index
      raise Discourse::NotFound unless SiteSetting.adsense_ads_txt.present?

      render plain: SiteSetting.adsense_ads_txt
    end
  end

  Discourse::Application.routes.append do
    get '/ads.txt' => "adstxt#index"
  end

  if !SiteSetting.content_security_policy_script_src.split('|'.freeze).include?("http://cdn.carbonads.com")
    SiteSetting.content_security_policy_script_src = SiteSetting.content_security_policy_script_src+'|http://cdn.carbonads.com'
  end
  if !SiteSetting.content_security_policy_script_src.split('|'.freeze).include?("https://cdn.carbonads.com")
    SiteSetting.content_security_policy_script_src = SiteSetting.content_security_policy_script_src+'|https://cdn.carbonads.com'
  end
  if !SiteSetting.content_security_policy_script_src.split('|'.freeze).include?("http://srv.carbonads.net")
    SiteSetting.content_security_policy_script_src = SiteSetting.content_security_policy_script_src+'|http://srv.carbonads.net'
  end
  if !SiteSetting.content_security_policy_script_src.split('|'.freeze).include?("https://srv.carbonads.net")
    SiteSetting.content_security_policy_script_src = SiteSetting.content_security_policy_script_src+'|https://srv.carbonads.net'
  end
end
