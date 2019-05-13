# frozen_string_literal: true

module ::AdPlugin
  class HouseAdSetting
    DEFAULTS = {
      topic_list_top: '',
      topic_above_post_stream: '',
      topic_above_suggested: '',
      post_bottom: ''
    }

    def self.all
      settings = DEFAULTS.dup

      PluginStoreRow.where(plugin_name: AdPlugin.plugin_name)
        .where("key LIKE 'ad-setting:%'")
        .each do |psr|
          settings[psr.key[11..-1].to_sym] = psr.value
        end

      settings
    end

    def self.settings_and_ads
      settings = AdPlugin::HouseAdSetting.all
      ad_names = settings.values.map { |v| v.split('|') }.flatten.uniq
      ads = AdPlugin::HouseAd.all.select { |ad| ad_names.include?(ad.name) }
      {
        settings: settings.merge(
          after_nth_post: SiteSetting.house_ads_after_nth_post,
          house_ads_frequency: SiteSetting.house_ads_frequency
        ),
        creatives: ads.inject({}) { |h, ad| h[ad.name] = ad.html; h }
      }
    end

    def self.update(setting_name, value)
      unless DEFAULTS.keys.include?(setting_name.to_sym)
        raise Discourse::NotFound
      end

      ad_names = value&.split('|') || []

      if value && ad_names.any? { |v| v !~ HouseAd::NAME_REGEX }
        raise Discourse::InvalidParameters
      end

      unless ad_names.empty?
        ad_names = (HouseAd.all.map(&:name) & ad_names)
      end

      new_value = ad_names.join('|')

      if value.nil? || new_value == DEFAULTS[setting_name.to_sym]
        AdPlugin::pstore_delete("ad-setting:#{setting_name}")
      else
        AdPlugin::pstore_set("ad-setting:#{setting_name}", new_value)
      end

      publish_settings
    end

    def self.publish_settings
      MessageBus.publish('/site/house-creatives', settings_and_ads)
    end
  end
end
