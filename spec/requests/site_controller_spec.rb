# frozen_string_literal: true

require "rails_helper"

RSpec.describe SiteController do
  fab!(:user) { Fabricate(:user) }

  let!(:anon_ad) do
    AdPlugin::HouseAd.create(
      name: "anon-ad",
      html: "<div>ANON</div>",
      visible_to_logged_in_users: false,
      visible_to_anons: true,
    )
  end

  let!(:logged_in_ad) do
    AdPlugin::HouseAd.create(
      name: "logged-in-ad",
      html: "<div>LOGGED IN</div>",
      visible_to_logged_in_users: true,
      visible_to_anons: false,
    )
  end

  let!(:everyone_ad) do
    AdPlugin::HouseAd.create(
      name: "everyone-ad",
      html: "<div>EVERYONE</div>",
      visible_to_logged_in_users: true,
      visible_to_anons: true,
    )
  end

  before { AdPlugin::HouseAdSetting.update("topic_list_top", "logged-in-ad|anon-ad|everyone-ad") }

  describe "#site" do
    context "when logged in" do
      before { sign_in(user) }

      it "only includes ads that are visible to logged in users" do
        get "/site.json"
        expect(response.parsed_body["house_creatives"]["creatives"].keys).to contain_exactly(
          "logged-in-ad",
          "everyone-ad",
        )
      end
    end

    context "when anonymous" do
      it "only includes ads that are visible to anonymous users" do
        get "/site.json"
        expect(response.parsed_body["house_creatives"]["creatives"].keys).to contain_exactly(
          "anon-ad",
          "everyone-ad",
        )
      end

      it "invalidates cache when an ad is updated" do
        get "/site.json"
        expect(response.parsed_body["house_creatives"]["creatives"].keys).to contain_exactly(
          "anon-ad",
          "everyone-ad",
        )

        anon_ad.visible_to_anons = false
        anon_ad.save

        get "/site.json"
        expect(response.parsed_body["house_creatives"]["creatives"].keys).to contain_exactly(
          "everyone-ad",
        )
      end
    end
  end
end
