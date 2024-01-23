# frozen_string_literal: true

module ::AdPlugin
  module GuardianExtension
    def dfp_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.dfp_through_allowed_groups_map)
    end

    def adsense_show_to_through_allowed_groups?
      self.user.in_any_groups?(SiteSetting.adsense_through_allowed_groups_map)
    end
  end
end
