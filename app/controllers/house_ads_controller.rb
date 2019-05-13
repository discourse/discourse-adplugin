# frozen_string_literal: true

module ::AdPlugin
  class HouseAdsController < ::ApplicationController
    requires_plugin AdPlugin.plugin_name

    def index
      render_json_dump(
        house_ads: HouseAd.all.map(&:to_hash),
        settings: HouseAdSetting.all
      )
    end

    def show
      render_json_dump(house_ad: HouseAd.find(params[:id])&.to_hash)
    end

    def create
      ad = HouseAd.create(house_ad_params)
      if ad.valid?
        render_json_dump(house_ad: ad.to_hash)
      else
        render_json_error(ad)
      end
    end

    def update
      if ad = HouseAd.find(house_ad_params[:id])
        ad.update(house_ad_params)
      else
        ad = HouseAd.create(house_ad_params.except(:id))
      end

      if ad.valid?
        render_json_dump(house_ad: ad.to_hash)
      else
        render_json_error(ad)
      end
    end

    def destroy
      if ad = HouseAd.find(house_ad_params[:id])
        ad.destroy
      else
        render_json_error(I18n.t('not_found'), status: 404)
      end
    end

    private

    def house_ad_params
      params.permit(:id, :name, :html)
    end
  end
end
