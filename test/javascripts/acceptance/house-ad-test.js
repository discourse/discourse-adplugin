import {
  acceptance,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { test } from "qunit";
import { visit } from "@ember/test-helpers";

acceptance("House Ads", function (needs) {
  needs.user();
  needs.settings({
    no_ads_for_categories: "1",
    house_ads_after_nth_post: 6,
    house_ads_after_nth_topic: 3,
  });
  needs.site({
    house_creatives: {
      settings: {
        topic_list_top: "Topic List Top",
        topic_above_post_stream: "Above Post Stream",
        topic_above_suggested: "Above Suggested",
        post_bottom: "Post",
        topic_list_between: "Between Topic List",
        after_nth_post: 6,
        after_nth_topic: 6,
      },
      creatives: {
        "Topic List Top": "<div class='h-topic-list'>TOPIC LIST TOP</div>",
        "Above Post Stream":
          "<div class='h-above-post-stream'>ABOVE POST STREAM</div>",
        "Above Suggested":
          "<div class='h-above-suggested'>ABOVE SUGGESTED</div>",
        Post: "<div class='h-post'>BELOW POST</div>",
        "Between Topic List":
          "<div class='h-between-topic-list'>BETWEEN TOPIC LIST</div>",
      },
    },
  });

  test("correct ads show", async (assert) => {
    updateCurrentUser({ staff: false, trust_level: 1 });
    await visit("/t/280"); // 20 posts

    assert.equal(
      find(".h-above-post-stream").length,
      1,
      "it should render ad at top of topic"
    );

    assert.equal(
      find(".h-above-suggested").length,
      1,
      "it should render ad above suggested topics"
    );

    const ads = find(".h-post");
    assert.equal(ads.length, 3, "it should render 3 ads");
    assert.equal(
      find("#post_6 + .widget-connector").find(".h-post").length,
      1,
      "ad after 6th post"
    );
    assert.equal(
      find("#post_12 + .widget-connector").find(".h-post").length,
      1,
      "ad after 12th post"
    );
    assert.equal(
      find("#post_18 + .widget-connector").find(".h-post").length,
      1,
      "ad after 18th post"
    );

    await visit("/latest");
    assert.equal(
      find(".h-topic-list").length,
      1,
      "it should render ad above topic list"
    );

    /*
      Commenting this assertion for now.
      The code-review plugin overrides core's topic list template,
      so the between-topic-list connector is never injected.

      await visit("/latest");
      assert.equal(
        find(".h-between-topic-list").length,
        5,
        "it should render 5 ads"
      );
  */
    await visit("/t/28830");
    assert.equal(
      find(".h-above-post-stream").length,
      0,
      "no ad above post stream because category is in no_ads_for_categories"
    );
    assert.equal(
      find(".h-post").length,
      0,
      "no ad between posts because category is in no_ads_for_categories"
    );
    assert.equal(
      find(".h-above-suggested").length,
      0,
      "no ad above suggested because category is in no_ads_for_categories"
    );

    await visit("/c/bug");
    assert.equal(
      find(".h-topic-list").length,
      0,
      "no ad above category topic list because category is in no_ads_for_categories"
    );
  });
});
