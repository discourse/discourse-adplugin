import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";

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

    assert
      .dom(".h-above-post-stream")
      .exists({ count: 1 }, "it should render ad at top of topic");

    assert
      .dom(".h-above-suggested")
      .exists({ count: 1 }, "it should render ad above suggested topics");

    assert
      .dom(".h-post")
      .exists({ count: 3 }, "it should render 3 ads between posts");

    assert
      .dom("#post_6 + .widget-connector .h-post")
      .exists({ count: 1 }, "ad after 6th post");

    assert
      .dom("#post_12 + .widget-connector .h-post")
      .exists({ count: 1 }, "ad after 12th post");

    assert
      .dom("#post_18 + .widget-connector .h-post")
      .exists({ count: 1 }, "ad after 18th post");

    await visit("/latest");

    assert
      .dom(".h-topic-list")
      .exists({ count: 1 }, "it should render ad above topic list");

    await visit("/latest");
    assert
      .dom(".h-between-topic-list")
      .exists({ count: 5 }, "it should render 5 ads between topics");

    await visit("/t/28830");

    assert
      .dom(".h-above-post-stream")
      .doesNotExist(
        "no ad above post stream because category is in no_ads_for_categories"
      );

    assert
      .dom(".h-post")
      .doesNotExist(
        "no ad between posts because category is in no_ads_for_categories"
      );

    assert
      .dom(".h-above-suggested")
      .doesNotExist(
        "no ad above suggested because category is in no_ads_for_categories"
      );

    await visit("/c/bug");

    assert
      .dom(".h-topic-list")
      .doesNotExist(
        "no ad above category topic list because category is in no_ads_for_categories"
      );
  });
});
