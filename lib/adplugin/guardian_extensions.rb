# frozen_string_literal: true

module ::AdPlugin
  module GuardianExtensions
    def dfp_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.dfp_through_allowed_groups_map)
    end

    def adsense_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.adsense_through_allowed_groups_map)
    end

    def carbonads_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.carbonads_through_allowed_groups_map)
    end

    def amazon_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.amazon_through_allowed_groups_map)
    end

    def adbutler_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.adbutler_through_allowed_groups_map)
    end
  end
end
