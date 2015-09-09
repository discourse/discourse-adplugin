import { acceptance } from "helpers/qunit-helpers";
acceptance("Discourse Ad Plugin", { loggedIn: true });

// Put in this URL when testing: http://localhost:3000/qunit?module=Acceptance%3A%20Discourse%20Ad%20Plugin

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
	visit("/admin/plugins/adsense_plugin");
	return pauseTest();
	fillIn(".input-setting-string", "12345");

	click('.ok');
	
	andThen(() => {
		equal(currentURL(), "/admin/site_settings/category/adsense_plugin");
		ok(exists('something'), 'it displays the saved id');
	})
});


// In rake routes it's /admin/site_settings/category/:id, admin/site_settings#index

//click(".user-field input[type=checkbox]");
//fillIn(".user-field input[type=text]:first", "Barky");


// input id="ember3390" class="ember-view ember-text-field input-setting-string" placeholder type="text"

// for search it's
// input id="search-term" class="ember-view ember-text-field" placeholder="search topics, posts, users, or categories" type="text"



// fillIn('#search-term', 'dev');
// Input id=search-term

// {{search-text-field value=searchService.term id="search-term"}}
// app/assets/javascripts/discourse/templates/components/search-menu.hbs 
// {{input type="text" value=searchTerm class="input-xxlarge search no-blur" action="search"}}


// discourse/test/javascripts/acceptance/category-edit-test.js.es6
// fillIn('#edit-text-color', '#ff0000');
// click('.edit-category'); 
// <button id="ember2613" class="ember-view btn-default edit category" title="Save Category">Save Category</button>

// button#ember2613.ember-view.btn-default.edit-category.btn

// click('#save-category'); > button id: save-category button#save-category
// in elements:
// <button id="save-category" class="ember-view btn-primary btn"
// title="Save Category">Save Category</button>

// button#save-category.ember-view.btn-primary.btn

// So the difference is: # is the id while the . is a class of the button.
