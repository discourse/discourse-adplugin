import adSlot from "./ad-slot";

const PostBottomAd = <template>
  {{adSlot
    placement="post-bottom"
    category=@model.topic.category.slug
    postNumber=@model.post_number
  }}
</template>;

export default PostBottomAd;
