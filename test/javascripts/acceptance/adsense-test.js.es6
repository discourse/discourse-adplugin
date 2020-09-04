import { acceptance, updateCurrentUser } from "helpers/qunit-helpers";
import groupFixtures from "fixtures/group-fixtures";

acceptance("AdSense", {
  loggedIn: true,
  settings: {
    no_ads_for_groups: "47",
    no_ads_for_categories: "1",
    adsense_publisher_code: "MYADSENSEID",
    adsense_through_trust_level: 2,
    adsense_topic_list_top_code: "list_top_ad_unit",
    adsense_topic_list_top_ad_sizes: "728*90 - leaderboard",
    adsense_mobile_topic_list_top_code: "mobile_list_top_ad_unit",
    adsense_mobile_topic_list_top_ad_size: "300*250 - medium rectangle",
    adsense_post_bottom_code: "post_bottom_ad_unit",
    adsense_post_bottom_ad_sizes: "728*90 - leaderboard",
    adsense_mobile_post_bottom_code: "mobile_post_bottom_ad_unit",
    adsense_mobile_post_bottom_ad_size: "300*250 - medium rectangle",
    adsense_nth_post_code: 6,
    adsense_topic_above_post_stream_code: "above_post_stream_ad_unit",
    adsense_topic_above_post_stream_ad_sizes: "728*90 - leaderboard",
  },
  site: {
    house_creatives: {
      settings: {
        topic_list_top: "",
        topic_above_post_stream: "",
        topic_above_suggested: "",
        post_bottom: "",
        after_nth_post: 20,
      },
      creatives: {},
    },
  },
});

test("correct number of ads should show", async (assert) => {
  updateCurrentUser({ staff: false, trust_level: 1 });
  await visit("/t/280"); // 20 posts

  assert.equal(
    find(".google-adsense.adsense-topic-above-post-stream").length,
    1,
    "it should render 1 ad"
  );

  const ads = find(".google-adsense.adsense-post-bottom");
  assert.equal(ads.length, 3, "it should render 3 ads");
  assert.equal(
    find("#post_6 + .widget-connector").find(
      ".google-adsense.adsense-post-bottom"
    ).length,
    1,
    "ad after 6th post"
  );
  assert.equal(
    find("#post_12 + .widget-connector").find(
      ".google-adsense.adsense-post-bottom"
    ).length,
    1,
    "ad after 12th post"
  );
  assert.equal(
    find("#post_18 + .widget-connector").find(
      ".google-adsense.adsense-post-bottom"
    ).length,
    1,
    "ad after 18th post"
  );
});

test("no ads for trust level 3", async (assert) => {
  updateCurrentUser({ staff: false, trust_level: 3 });
  await visit("/t/280");
  assert.equal(
    find(".google-adsense.adsense-post-bottom").length,
    0,
    "it should render 0 ads"
  );
});

test("can omit ads based on groups", async (assert) => {
  updateCurrentUser({
    staff: false,
    trust_level: 1,
    groups: [groupFixtures["/groups/discourse.json"].group],
  });
  await visit("/t/280");
  assert.equal(
    find(".google-adsense.adsense-post-bottom").length,
    0,
    "it should render 0 ads"
  );
});

test("can omit ads based on category", async (assert) => {
  updateCurrentUser({ staff: false, trust_level: 1 });
  await visit("/t/28830");
  assert.equal(
    find(".google-adsense.adsense-topic-above-post-stream").length,
    0,
    "it should render 0 ads"
  );
});
