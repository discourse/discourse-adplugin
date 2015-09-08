import { acceptance } from "helpers/qunit-helpers";
acceptance("Discourse Ad Plugin", { loggedIn: true });

// Play around test for presence of page
test("Presence of adsense within the plugin", () => {
	expect(1);
	visit("/admin/site_settings/category/adsense_plugin");

	andThen(() => {
		equal(currentURL(), '/admin/site_settings/category/adsense_plugin', "adsense lives!");
		ok(!exists(".page-not-found"), "A page exists for adsense plugin");
	});
});


// Test to fill in publisher id and save it.
test("Presence of adsense within the plugin", () => {
	visit("/admin/site_settings/category/adsense_plugin");
	fillIn(".site-settings.adsense_publisher_id input[type=text]", "12345");
	click('.save something');
	
	andThen(() => {
		ok(exists('something'), 'it displays the saved id');
	})
});


//click(".user-field input[type=checkbox]");
//fillIn(".user-field input[type=text]:first", "Barky");