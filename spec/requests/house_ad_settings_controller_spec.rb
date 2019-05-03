require 'rails_helper'

describe AdPlugin::HouseAdSettingsController do
  let(:admin) { Fabricate(:admin) }

  before do
    AdPlugin::HouseAd.create(name: "Banner", html: "<p>Banner</p>")
  end

  describe "update" do
    let(:valid_params) { { value: 'Banner' } }

    it "error if not logged in" do
      put '/admin/plugins/adplugin/house_ad_settings/topic_list_top.json', params: valid_params
      expect(response.status).to eq(404)
    end

    it "error if not staff" do
      sign_in(Fabricate(:user))
      put '/admin/plugins/adplugin/house_ad_settings/topic_list_top.json', params: valid_params
      expect(response.status).to eq(404)
    end

    context "logged in as admin" do
      before do
        sign_in(admin)
      end

      it "changes the setting" do
        put '/admin/plugins/adplugin/house_ad_settings/topic_list_top.json', params: valid_params
        expect(response.status).to eq(200)
        expect(AdPlugin::HouseAdSetting.all[:topic_list_top]).to eq(valid_params[:value])
      end

      it "errors on invalid setting name" do
        put '/admin/plugins/adplugin/house_ad_settings/nope-nope.json', params: valid_params
        expect(response.status).to eq(404)
      end

      it "errors on invalid setting value" do
        put '/admin/plugins/adplugin/house_ad_settings/topic_list_top.json', params: valid_params.merge(value: "Banner|<script>")
        expect(response.status).to eq(400)
      end
    end
  end
end
