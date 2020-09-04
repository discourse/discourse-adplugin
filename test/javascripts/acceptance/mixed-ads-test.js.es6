import { acceptance, updateCurrentUser } from "helpers/qunit-helpers";

acceptance("Mixed Ads", {
  loggedIn: true,
  settings: {
    house_ads_after_nth_post: 6,
    house_ads_frequency: 50,
    dfp_publisher_id: "MYdfpID",
    dfp_through_trust_level: 2,
    dfp_topic_list_top_code: "list_top_ad_unit",
    dfp_topic_list_top_ad_sizes: "728*90 - leaderboard",
    dfp_mobile_topic_list_top_code: "mobile_list_top_ad_unit",
    dfp_mobile_topic_list_top_ad_size: "300*250 - medium rectangle",
    dfp_post_bottom_code: "post_bottom_ad_unit",
    dfp_post_bottom_ad_sizes: "728*90 - leaderboard",
    dfp_mobile_post_bottom_code: "mobile_post_bottom_ad_unit",
    dfp_mobile_post_bottom_ad_size: "300*250 - medium rectangle",
    dfp_nth_post_code: 6,
  },
  site: {
    house_creatives: {
      settings: {
        topic_list_top: "Topic List",
        topic_above_post_stream: "Above Post Stream",
        topic_above_suggested: "Above Suggested",
        post_bottom: "Post",
        after_nth_post: 6,
      },
      creatives: {
        "Topic List": "<div class='h-topic-list'>TOPIC LIST</div>",
        "Above Post Stream":
          "<div class='h-above-post-stream'>ABOVE POST STREAM</div>",
        "Above Suggested":
          "<div class='h-above-suggested'>ABOVE SUGGESTED</div>",
        Post: "<div class='h-post'>BELOW POST</div>",
      },
    },
  },
});

test("correct ads show", async (assert) => {
  updateCurrentUser({ staff: false, trust_level: 1 });
  await visit("/t/280"); // 20 posts

  const houseAdsCount = find(".house-creative").length;
  const dfpAdsCount = find(".google-dfp-ad").length;

  assert.ok(houseAdsCount > 1);
  assert.ok(houseAdsCount < 4);
  assert.ok(dfpAdsCount > 1);
  assert.ok(dfpAdsCount < 4);

  await visit("/latest");
  assert.equal(
    find(".h-topic-list-top, .dfp-ad-topic-list-top").length,
    1,
    "it should render ad above topic list"
  );
});
