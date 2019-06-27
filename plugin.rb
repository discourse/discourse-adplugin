# frozen_string_literal: true

# name: discourse-adplugin
# about: Ad Plugin for Discourse
# version: 1.2.3
# authors: Vi and Sarah (@ladydanger and @cyberkoi)
# url: https://github.com/discourse/discourse-adplugin

register_asset "stylesheets/adplugin.scss"

add_admin_route 'admin.adplugin.house_ads.title', 'houseAds'

module ::AdPlugin
  def self.plugin_name
    'discourse-adplugin'.freeze
  end

  def self.pstore_get(key)
    PluginStore.get(AdPlugin.plugin_name, key)
  end

  def self.pstore_set(key, value)
    PluginStore.set(AdPlugin.plugin_name, key, value)
  end

  def self.pstore_delete(key)
    PluginStore.remove(AdPlugin.plugin_name, key)
  end
end

after_initialize do
  require_dependency File.expand_path('../app/models/house_ad', __FILE__)
  require_dependency File.expand_path('../app/models/house_ad_setting', __FILE__)
  require_dependency File.expand_path('../app/controllers/house_ads_controller', __FILE__)
  require_dependency File.expand_path('../app/controllers/house_ad_settings_controller', __FILE__)
  require_dependency 'application_controller'

  add_to_serializer :site, :house_creatives do
    AdPlugin::HouseAdSetting.settings_and_ads
  end

  add_to_serializer :topic_view, :tags_disable_ads do
    return false if !SiteSetting.tagging_enabled || !SiteSetting.no_ads_for_tags.present?
    return false if object.topic.tags.empty?
    !(SiteSetting.no_ads_for_tags.split('|') & object.topic.tags.map(&:name)).empty?
  end

  class ::AdstxtController < ::ApplicationController
    skip_before_action :check_xhr

    def index
      raise Discourse::NotFound unless SiteSetting.ads_txt.present?

      render plain: SiteSetting.ads_txt
    end
  end

  class AdPlugin::Engine < ::Rails::Engine
    engine_name 'adplugin'
    isolate_namespace AdPlugin
  end

  AdPlugin::Engine.routes.draw do
    root to: 'house_ads#index'
    resources :house_ads, only: [:index, :show, :create, :update, :destroy]
    resources :house_ad_settings, only: [:update]
  end

  Discourse::Application.routes.append do
    get '/ads.txt' => "adstxt#index"
    mount ::AdPlugin::Engine, at: '/admin/plugins/adplugin', constraints: AdminConstraint.new
  end
end
