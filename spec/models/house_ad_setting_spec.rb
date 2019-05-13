# frozen_string_literal: true

require 'rails_helper'

describe AdPlugin::HouseAdSetting do
  let(:defaults) { AdPlugin::HouseAdSetting::DEFAULTS }

  describe '#all' do
    subject { AdPlugin::HouseAdSetting.all }

    it "returns defaults when nothing has been set" do
      expect(subject).to eq(defaults)
    end

    it "returns defaults and overrides" do
      AdPlugin::pstore_set('ad-setting:topic_list_top', 'Banner')
      expect(subject[:topic_list_top]).to eq('Banner')
      expect(subject.except(:topic_list_top)).to eq(
        defaults.except(:topic_list_top)
      )
    end
  end

  describe '#update' do
    before do
      AdPlugin::HouseAd.create(name: "Banner", html: "<p>Banner</p>")
      AdPlugin::HouseAd.create(name: "Donate", html: "<p>Donate</p>")
    end

    it "can set override for the first time" do
      expect {
        AdPlugin::HouseAdSetting.update(:topic_list_top, 'Banner|Donate')
      }.to change { PluginStoreRow.count }.by(1)
      expect(AdPlugin::HouseAdSetting.all[:topic_list_top]).to eq('Banner|Donate')
    end

    it "can update an existing override" do
      AdPlugin::pstore_set('ad-setting:topic_list_top', 'Banner')
      expect {
        AdPlugin::HouseAdSetting.update(:topic_list_top, 'Banner|Donate')
      }.to_not change { PluginStoreRow.count }
      expect(AdPlugin::HouseAdSetting.all[:topic_list_top]).to eq('Banner|Donate')
    end

    it "removes ad names that don't exist" do
      AdPlugin::HouseAdSetting.update(:topic_list_top, 'Coupon|Banner|Donate')
      expect(AdPlugin::HouseAdSetting.all[:topic_list_top]).to eq('Banner|Donate')
    end

    it "can reset to default" do
      AdPlugin::pstore_set('ad-setting:topic_list_top', 'Banner')
      expect {
        AdPlugin::HouseAdSetting.update(:topic_list_top, '')
      }.to change { PluginStoreRow.count }.by(-1)
      expect(AdPlugin::HouseAdSetting.all[:topic_list_top]).to eq('')
    end

    it "raises error on invalid setting name" do
      expect {
        AdPlugin::HouseAdSetting.update(:nope, 'Click Me')
      }.to raise_error(Discourse::NotFound)
      expect(AdPlugin::pstore_get('ad-setting:nope')).to be_nil
    end

    it "raises error on invalid value" do
      expect {
        AdPlugin::HouseAdSetting.update(:topic_list_top, '<script>')
      }.to raise_error(Discourse::InvalidParameters)
      expect(AdPlugin::HouseAdSetting.all[:topic_list_top]).to eq('')
    end
  end
end
