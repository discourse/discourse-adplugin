# frozen_string_literal: true

require "rails_helper"

describe AdPlugin::HouseAdsController do
  let(:admin) { Fabricate(:admin) }

  let!(:ad) do
    AdPlugin::HouseAd.create(
      name: "Banner",
      html: "<p>Banner</p>",
      visible_to_anons: true,
      visible_to_logged_in_users: false,
    )
  end

  describe "#update" do
    context "when used by admins" do
      before { sign_in(admin) }

      it "updates an existing ad" do
        put "/admin/plugins/pluginad/house_creatives/#{ad.id}.json",
            params: {
              name: ad.name,
              html: ad.html,
              visible_to_anons: "false",
              visible_to_logged_in_users: "true",
            }
        expect(response.status).to eq(200)
        expect(response.parsed_body["house_ad"].symbolize_keys).to eq(
          id: ad.id,
          name: ad.name,
          html: ad.html,
          visible_to_anons: false,
          visible_to_logged_in_users: true,
        )

        ad_copy = AdPlugin::HouseAd.find(ad.id)
        expect(ad_copy.name).to eq(ad.name)
        expect(ad_copy.html).to eq(ad.html)
        expect(ad_copy.visible_to_anons).to eq(false)
        expect(ad_copy.visible_to_logged_in_users).to eq(true)
      end
    end

    context "when used by non-admins" do
      before { sign_in(Fabricate(:user)) }

      it "can't update ads" do
        put "/admin/plugins/pluginad/house_creatives/#{ad.id}.json",
            params: {
              name: "non sense goes here",
              html: "blah <h4cked>",
              visible_to_anons: "false",
              visible_to_logged_in_users: "true",
            }
        expect(response.status).to eq(404)

        ad_copy = AdPlugin::HouseAd.find(ad.id)
        expect(ad_copy.name).to eq(ad.name)
        expect(ad_copy.html).to eq(ad.html)
        expect(ad_copy.visible_to_anons).to eq(true)
        expect(ad_copy.visible_to_logged_in_users).to eq(false)
      end
    end
  end
end
