import { acceptance } from "helpers/qunit-helpers";
acceptance("Discourse Ad Plugin", { loggedIn: true });

test("DFP and Adsense Button Appears on Site Settings", () => {
  visit("/admin/site_settings/category/adsense_plugin");

  andThen(() => {
    fillIn('#login-account-name', 'eviltrout');
  //   ok(!exists('.tentacle'), "the tentacle is not shown yet");
  // });

  // click('#show-tentacle');

  // andThen(() => {
  //   ok(exists('.tentacle'), "the tentacle wants to rule the world!");
  // });
});


// Test if dfp and adsense button appear on site settings
// Test if AAdsense ad loads
// Test if DFP ad loads