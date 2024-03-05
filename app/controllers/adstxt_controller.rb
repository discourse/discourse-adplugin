# frozen_string_literal: true
#
class AdstxtController < ::ApplicationController
  requires_plugin AdPlugin.plugin_name

  skip_before_action :preload_json, :check_xhr, :redirect_to_login_if_required

  def index
    raise Discourse::NotFound unless SiteSetting.ads_txt.present?

    render plain: SiteSetting.ads_txt
  end
end
