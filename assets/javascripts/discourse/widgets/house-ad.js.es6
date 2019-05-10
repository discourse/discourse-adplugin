import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";

createWidget("house-ad", {
  tagName: "",

  html(attrs) {
    console.log('house-ad');

    if (attrs.postNumber % 10 === 0) {
      return h(
        "div.house-creative.house-post-bottom",
        h(
          "a.h-create.h-socks",
          { href: "#", target: "_blank" },
          h(
            "div.container",
            h(
              "div.tall-image",
              h("img", {
                src:
                  "http://localhost:3000/uploads/default/original/1X/14844d926f49c3de68a91188661173f694e6b8bc.jpeg"
              })
            )
          )
        )
      );
    } else {
      return '';
    }
  }
});
