# frozen_string_literal: true

module ::AdPlugin
  class HouseAd
    include ActiveModel::Validations

    attr_accessor :id, :name, :html, :visible_to_logged_in_users, :visible_to_anons

    NAME_REGEX = /\A[[:alnum:]\s\.,'!@#$%&\*\-\+\=:]*\z/i

    validates :name, presence: true, format: { with: NAME_REGEX }
    validates :html, presence: true

    validate do
      if self.class.all.any? { |ad| ad.id != self.id && ad.name.downcase == self.name.downcase }
        errors.add(:name, :taken) # unique name
      end
    end

    def initialize
      @name = "New Ad"
      @html = "<div class='house-ad'>New Ad</div>"
      @visible_to_logged_in_users = true
      @visible_to_anons = true
    end

    def self.from_hash(h)
      ad = self.new
      ad.name = h[:name]
      ad.html = h[:html]
      ad.id = h[:id].to_i if h[:id]
      if h.key?(:visible_to_logged_in_users)
        ad.visible_to_logged_in_users = h[:visible_to_logged_in_users]
      end
      ad.visible_to_anons = h[:visible_to_anons] if h.key?(:visible_to_anons)
      ad
    end

    def self.create(attrs)
      ad = from_hash(attrs)
      ad.save
      ad
    end

    def self.alloc_id
      DistributedMutex.synchronize("adplugin-house-ad-id") do
        max_id = AdPlugin.pstore_get("ad:_id")
        max_id = 1 unless max_id
        AdPlugin.pstore_set("ad:_id", max_id + 1)
        max_id
      end
    end

    def self.find(id)
      if r = AdPlugin.pstore_get("ad:#{id}")
        from_hash(r)
      else
        nil
      end
    end

    def self.all
      PluginStoreRow
        .where(plugin_name: AdPlugin.plugin_name)
        .where("key LIKE 'ad:%'")
        .where("key != 'ad:_id'")
        .map { |psr| from_hash(PluginStore.cast_value(psr.type_name, psr.value)) }
        .sort_by { |ad| ad.id }
    end

    def self.all_for_anons
      self.all.select(&:visible_to_anons)
    end

    def self.all_for_logged_in_users
      self.all.select(&:visible_to_logged_in_users)
    end

    def save
      if self.valid?
        self.id = self.class.alloc_id if self.id.to_i <= 0
        AdPlugin.pstore_set("ad:#{id}", to_hash)
        Site.clear_anon_cache!
        self.class.publish_if_ads_enabled
        true
      else
        false
      end
    end

    def update(attrs)
      self.name = attrs[:name]
      self.html = attrs[:html]
      if attrs.key?(:visible_to_logged_in_users)
        self.visible_to_logged_in_users = attrs[:visible_to_logged_in_users]
      end
      self.visible_to_anons = attrs[:visible_to_anons] if attrs.key?(:visible_to_anons)
      self.save
    end

    def to_hash
      {
        id: @id,
        name: @name,
        html: @html,
        visible_to_logged_in_users: @visible_to_logged_in_users,
        visible_to_anons: @visible_to_anons,
      }
    end

    def destroy
      AdPlugin.pstore_delete("ad:#{id}")
      Site.clear_anon_cache!
      self.class.publish_if_ads_enabled
    end

    def self.publish_if_ads_enabled
      if AdPlugin::HouseAdSetting.all.any? { |_, adsToShow| !adsToShow.blank? }
        AdPlugin::HouseAdSetting.publish_settings
      end
    end
  end
end
