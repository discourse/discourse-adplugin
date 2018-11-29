# Official Discourse Advertising Plugin

This is the official Discourse advertising plugin.  It allows advertisements to be served by supported advertising platforms for users with a Discourse forum.

**Authors**: 		[Sarah Ni](https://github.com/cyberkoi) & [Vi Nguyen](https://github.com/ladydanger)
**Version**: 			1.0.1
**Contributors**: See credits section below
**License**: 			MIT License
**Supported Discourse Version**: 1.4
**Supported Ad Platforms**:
* [Google Adsense](http://www.google.com.au/adsense/start/why-adsense.html)
* [Google Double Click for Publishers](https://www.google.com/dfp)
* [Amazon Affiliates](http://affiliate-program.amazon.com) - Banner and Product Link Ads
* [CodeFund](https://codefund.io) - Ethical Ad Platform for Developers


## Quick Start in 3 Steps

This quick start shows you how to install this plugin and use it.  Recommended if you have:

* A live discourse forum
* You have deployed your live forum using Docker.  If you're using Digital Ocean, it's likely that your forum is deployed on Docker.

For non-docker or local development installation (those with programming experience), see **Other Installation**.


### Step 1 - Install the Official Discourse Advertising Plugin


As seen in a [how-to on meta.discourse.org](https://meta.discourse.org/t/advanced-troubleshooting-with-docker/15927#Example:%20Install%20a%20plugin), simply **add the plugin's repository url to your container's app.yml file**:

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/discourse-adplugin.git
```
Rebuild the container

```
cd /var/discourse
git pull
./launcher rebuild app
```

### Step 2 - Configure Your Settings to Display Your Advertisments

There are 2 easy steps for configuring your Discourse settings to enable advertisements to display in your Discourse forum.

#### Step 2(a) - Choose Your Advertisement Platform

<ul>
<li>Navigate to the Admin section in your Discourse forum.</li>
<li>Click on Settings and a left vertical navigation bar should appear.</li>
<li>Choose your advertisement platform.</li>
<ul>
<li>Adsense - if using Adsense as your advertisement platform.</li>
<li>DFP - if using the DoubleClick for Publishers advertisement platform.</li>
<li>CodeFund - if using the CodeFund ethical advertisement platform.</li>
</ul>
</ul>

#### Step 2(b) - Input Your Details

1. Add in your publisher ID - your publisher ID can be obtained from your ad platform and can also be found in your ad tag (see pictures below).
2. Choose your trust level from the dropdown box.  This will only display ads to users with a certain level of trust.  For more details about trust levels go to the **Plugin Features** heading.
3. Get the Advertisement Tag from your Ad Platform - see the images below to see what a tag looks like.
4. Add parts of your ad code to Discourse's site settings for the locations you wish your ad to appear.  Refer to image for your ad platform to where parts of your ad tag should go.  For more detail about where the ad will appear
5. Choose Your Ad Size - this is the same size that you've put into your ad provider to create your ad.  Go to the **Plugin Features** heading to see a list of supported Ad sizes.

##### Adsense Advertisement Tag to Discourse's Site Settings

![](https://www.dropbox.com/sc/pguxq17zo2rovyd/AAD--LTH_IIgVhgczoaY1Ljva?dl=1)

##### DoubleClick for Publishers' Advertisement Tag to Discourse's Site Settings

![](https://www.dropbox.com/sc/0inoc1iduux0gsf/AADi8tfKX9S6Tx9S8RndcUE8a?dl=1)

##### Amazon Affiliates' Advertisement Tag to Discourse's Site Settings
Only for Product Link and Banner Ads.

![](https://www.dropbox.com/sc/l67fb5c3tl8bq3d/AAAAMmccMW3kkIeBR7cBdWoFa?dl=1)

##### CodeFund Embed Tag to Discourse's Site Settings

![CodeFund Instructions](https://s3-us-west-2.amazonaws.com/codesponsor/discourse-codefund-instructions.png)

### Step 3 - See Your Ad

Once you've configured your settings and your advertising platform has ads that are ready to serve, navigate to the page where you've inputted for the location and you should see ads.


## Plugin Features

In this section, we go into more detail on:
* Available Locations for Ad Display
* Ad Sizes Supported
* Trust Levels
* Languages Supported

### Available Locations for Ad Display

The following are available locations along with a description and an image showing their location within Discourse to display ads for all platforms.

| Location Name | Description |
| --- | --- |
| Topic List Top | Ad will appear at the header of Discourse homepage |
| Topic Above Post Stream | Ad will appear in the header of all Discourse forum topics |
| Topic Above Suggested | Ad will appear in the footer above suggested topics of all Discourse forum topics |
| Post Bottom & Nth Post | Ad will appear on the stipulated nth post within a topic.  So if you have 5 posts in a topic and you want the ad to display after on the 2nd post, put 2 in ```ad_platform_nth_post_code```. |


![](https://www.dropbox.com/sc/rm5bcn8c85niul1/AAAUVW-hn56XtCl_XTNlE19Ra?dl=1)

### Advertisement Sizes Supported

This plugin supports the following ad sizes for the following locations.

All locations except post bottom | Post bottom location | Mobile
--- | --- | ---
728 x 90 | 728 x 90 | 320 x 50
336 x 280 | 336 x 280 |
300 x 250 | 300 x 250 |
970 x 90 | 970 x 90 |
468 x 60 | 468 x 60 |
234 x 60 | 234 x 60 |
125 x 125 | |
180 x 150 | |
200 x 200 | |
250 x 250 | |


### Trust Levels

You can use the ```ad_platform_through_trust_level``` dropdown to disable ads for users above a certain trust levels. As a guide, choosing:

* 0 shows ads to users that are not logged in.
* 1 shows ads to users that are not logged in, and to new and basic users.
* 2 shows ads to members as well, but not to regulars and leaders.
* 3 shows ads to everyone, but not to leaders.
* 4 shows ads to everyone including leaders.

To find more about trust levels in Discourse, refer to [Discourse's posts on trust levels](https://meta.discourse.org/t/what-do-user-trust-levels-do/4924)

### Languages Supported

* Chinese (Simplified)
* English
* French
* Spanish

## Other Installation

There are two sets of installation instructions:

1. Non-Docker Installation - If you have experience with programming.  This will set up this plugin as a git submodule in your Discourse directory.
2. Local Development - If you want develop locally and have experience with programming.  This will set up this plugin as a symlinked file in Discourse's plugin directory.

If you already have a live Discourse forum up, please go to the Quick Start heading above.


### 1. Non-docker installation


* Run `bundle exec rake plugin:install repo=https://github.com/discourse/discourse-adplugin.git` in your discourse directory
* In development mode, run `bundle exec rake assets:clean`
* In production, recompile your assets: `bundle exec rake assets:precompile`
* Restart Discourse


### 2. Local Development Installation


* Clone the [Discourse Adplugin Repo](http://github.com/team-melbourne-rgsoc2015/discourse-adplugin) in a new local folder.
* Separately clone [Discourse Forum](https://github.com/discourse/discourse) in another local folder and [install Discourse](https://meta.discourse.org/t/beginners-guide-to-install-discourse-on-ubuntu-for-development/14727).
* In your terminal, go into Discourse folder navigate into the plugins folder.  Example ```cd ~/code/discourse/plugins```
* Create a symlink in this folder by typing the following into your terminal
:
```
ln -s ~/whereever_your_cloned_ad_plugin_path_is .
For example: ln -s ~/discourse-plugin-test .
```
* You can now make changes in your locally held Discourse Adplugin folder and see the effect of your changes when your run ```rails s``` in your locally held Discourse Forum files.


## Questions or Want to Contribute?

Open an Issue on this repository to start a chat.


## Credits

**Discourse.org**: 		Thanks to our amazing mentor [@eviltrout](https://github.com/eviltrout) and the wonderful [Discourse team!](http://www.discourse.org/)

**Our Coaches**: 					Very special thank you to our coaches and honorary coach - [@georg](https://github.com/georg), [@betaass](https://github.com/betaass), [@adelsmee](https://github.com/adelsmee), [@davich](https://github.com/davich), [@link664](https://github.com/link664), [@tomjadams](https://github.com/tomjadams), [@compactcode](https://github.com/compactcode), [@joffotron](https://github.com/joffotron), [@jocranford](https://github.com/jocranford), [@saramic](https://github.com/saramic), [@madpilot](https://github.com/madpilot), [@catkins](https://github.com/catkins)

**Rails Girls**: 			Thanks [@sareg0](https://github.com/sareg0) and the Rails Girls Team for the opportunity to participate in Rails Girls Summer of Code 2015.
<p>To create this plugin we referenced the <a href="https://github.com/discourse/discourse-google-dfp">original dfp plugin</a> (created by  <a href="https://github.com/search?q=neil+lalonde&ref=opensearch&type=Users">nlalonde</a>) and the <a href="https://meta.discourse.org/t/google-adsense-plugin/11763/133">adsense plugin</a>.</p>
