# frozen_string_literal: true

module ::AdPlugin
  class HouseAd
    include ActiveModel::Validations

    attr_accessor :id, :name, :html

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
    end

    def self.from_hash(h)
      ad = self.new
      ad.name = h[:name]
      ad.html = h[:html]
      ad.id = h[:id].to_i if h[:id]
      ad
    end

    def self.create(attrs)
      ad = from_hash(attrs)
      ad.save
      ad
    end

    def self.alloc_id
      DistributedMutex.synchronize('adplugin-house-ad-id') do
        max_id = AdPlugin.pstore_get("ad:_id")
        max_id = 1 unless max_id
        AdPlugin.pstore_set("ad:_id", max_id + 1)
        max_id
      end
    end

    def self.find(id)
      if r = AdPlugin::pstore_get("ad:#{id}")
        from_hash(r)
      else
        nil
      end
    end

    def self.all
      PluginStoreRow.where(plugin_name: AdPlugin.plugin_name)
        .where("key LIKE 'ad:%'")
        .where("key != 'ad:_id'")
        .map do |psr|
          from_hash(PluginStore.cast_value(psr.type_name, psr.value))
        end.sort_by { |ad| ad.id }
    end

    def save
      if self.valid?
        self.id = self.class.alloc_id if self.id.to_i <= 0
        AdPlugin::pstore_set("ad:#{id}", to_hash)
        self.class.publish_if_ads_enabled
        true
      else
        false
      end
    end

    def update(attrs)
      self.name = attrs[:name]
      self.html = attrs[:html]
      self.save
    end

    def to_hash
      {
        id: @id,
        name: @name,
        html: @html
      }
    end

    def destroy
      AdPlugin::pstore_delete("ad:#{id}")
      self.class.publish_if_ads_enabled
    end

    def self.publish_if_ads_enabled
      if AdPlugin::HouseAdSetting.all.any? { |_, adsToShow| !adsToShow.blank? }
        AdPlugin::HouseAdSetting.publish_settings
      end
    end

  end
end
