import { acceptance } from "helpers/qunit-helpers";
acceptance("Discourse Ad Plugin", { loggedIn: true });


test("Unknown URL", () => {
  expect(1);
  visit("/url-that-doesn't-exist");
  andThen(() => {
    ok(exists(".page-not-found"), "The not found content is present");
  });
});

test("Presence of adsense within the plugin", () => {
	expect(1);
	visit("/admin/site_settings/category/adsense_plugin");
	andThen(() => {
		equal(currentURL(), '/admin/site_settings/category/adsense_plugin', "adsense lives!");
		ok(!exists(".page-not-found"), "A page exists for adsense plugin");
	});
});