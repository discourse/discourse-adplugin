# name: discourse-adplugin
# about: Ad Plugin for Discourse
# version: 1.0.2
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
end
