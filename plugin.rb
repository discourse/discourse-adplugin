# frozen_string_literal: true

# name: discourse-adplugin
# about: Allows admins to configure advertisements, and integrates with external ad platforms.
# meta_topic_id: 33734
# version: 1.2.5
# authors: Vi and Sarah (@ladydanger and @cyberkoi)
# url: https://github.com/discourse/discourse-adplugin

register_asset "stylesheets/adplugin.scss"

add_admin_route "admin.adplugin.house_ads.title", "houseAds"

enabled_site_setting :discourse_adplugin_enabled

module ::AdPlugin
  def self.plugin_name
    "discourse-adplugin".freeze
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
  require_dependency File.expand_path("../app/models/house_ad", __FILE__)
  require_dependency File.expand_path("../app/models/house_ad_setting", __FILE__)
  require_dependency File.expand_path("../app/controllers/house_ads_controller", __FILE__)
  require_dependency File.expand_path("../app/controllers/house_ad_settings_controller", __FILE__)
  require_dependency File.expand_path("../lib/adplugin/guardian_extensions", __FILE__)
  require_dependency "application_controller"

  reloadable_patch { Guardian.prepend ::AdPlugin::GuardianExtensions }

  add_to_serializer :site, :house_creatives do
    AdPlugin::HouseAdSetting.settings_and_ads(for_anons: scope.anonymous?)
  end

  add_to_serializer :topic_view, :tags_disable_ads do
    return false if !SiteSetting.tagging_enabled || !SiteSetting.no_ads_for_tags.present?
    return false if object.topic.tags.empty?
    !(SiteSetting.no_ads_for_tags.split("|") & object.topic.tags.map(&:name)).empty?
  end

  add_to_serializer :current_user, :show_dfp_ads do
    scope.show_dfp_ads?
  end

  add_to_serializer :current_user, :show_adsense_ads do
    scope.show_adsense_ads?
  end

  add_to_serializer :current_user, :show_carbon_ads do
    scope.show_carbon_ads?
  end

  add_to_serializer :current_user, :show_amazon_ads do
    scope.show_amazon_ads?
  end

  add_to_serializer :current_user, :show_adbutler_ads do
    scope.show_adbutler_ads?
  end

  add_to_serializer :current_user, :show_to_groups do
    scope.show_to_groups?
  end

  class ::AdstxtController < ::ApplicationController
    skip_before_action :preload_json, :check_xhr, :redirect_to_login_if_required

    def index
      raise Discourse::NotFound unless SiteSetting.ads_txt.present?

      render plain: SiteSetting.ads_txt
    end
  end

  class AdPlugin::Engine < ::Rails::Engine
    engine_name "adplugin"
    isolate_namespace AdPlugin
  end

  AdPlugin::Engine.routes.draw do
    root to: "house_ads#index"
    resources :house_creatives, only: %i[index show create update destroy], controller: "house_ads"
    resources :house_settings, only: [:update], controller: "house_ad_settings"
  end

  Discourse::Application.routes.append do
    get "/ads.txt" => "adstxt#index"
    mount ::AdPlugin::Engine, at: "/admin/plugins/pluginad", constraints: AdminConstraint.new
  end
end
