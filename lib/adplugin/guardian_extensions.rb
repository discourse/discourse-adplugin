# frozen_string_literal: true

module ::AdPlugin
  module GuardianExtensions
    def show_dfp_ads?
      self.user.in_any_groups?(SiteSetting.dfp_display_groups_map)
    end

    def show_adsense_ads?
      self.user.in_any_groups?(SiteSetting.adsense_display_groups_map)
    end

    def show_carbon_ads?
      self.user.in_any_groups?(SiteSetting.carbonads_display_groups_map)
    end

    def show_amazon_ads?
      self.user.in_any_groups?(SiteSetting.amazon_display_groups_map)
    end

    def show_adbutler_ads?
      self.user.in_any_groups?(SiteSetting.adbutler_display_groups_map)
    end
  end
end
