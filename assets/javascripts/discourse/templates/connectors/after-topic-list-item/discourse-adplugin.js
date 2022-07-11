import { slotContenders } from "discourse/plugins/discourse-adplugin/discourse/components/ad-slot";

export default {
  shouldRender(args, component) {
    return (
      slotContenders(
        component.site,
        component.siteSettings,
        "topic-list-between",
        args.index
      ).length === 0
    );
  },
};
