# Official Discourse Advertising Plugin

This is the official Discourse advertising plugin.  It allows advertisements to be served by supported advertising platforms for users with a Discourse forum.

**Authors**: 		[cyberkoi](https://github.com/cyberkoi) (insert_web_page) and [ladydanger](https://github.com/ladydanger) (insert_web_page) :heart:		
**Contributors**: 					See credits section below		
**License**: 			MIT License		
**Supported Discourse Version**: 1.4	
**Supported Ad Platforms**:    
* [Google Adsense](http://www.google.com.au/adsense/start/why-adsense.html)
* [Google Double Click for Publishers](https://www.google.com/dfp)


## Quick Start in 3 Steps

This quick start shows you how to install this plugin and use it.  Recommended if you have:

* A live discourse forum 
* You have deployed that forum using Docker.  Most people using Digital Ocean will have deployed Discourse using Docker. 

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
          - git clone https://github.com/team-melbourne-rgsoc2015/discourse-adplugin.git
```
Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```

### Step 2 - Configure Your Settings to Display Your Advertisments

There are 2 easy steps for configuring your Discourse settings to enable advertisements to display in your Discourse forum.

#### Step 2(a) - Choose Your Advertisement Platform

* Navigate to the Admin section in your Discourse forum.
* Click on Settings and a left vertical navigation bar should appear.
* Choose your advertisement platform by clicking on "Adsense Plugin" if using Adsense as your advertisement platform and/or click "DFP Plugin" if using the DoubleClick for Publishers advertisement platform.


#### Step 2(b) - Input Your Details

1. Add in your publisher ID - your publisher ID can be obtained from your ad platform and can also be found in your ad tag (see pictures below).
2. Choose your trust level from the dropdown box.  This will only display ads to users with a certain level of trust.  For more details about trust levels go to the **Plugin Features** heading.
3. Get the Advertisement Tag from your Ad Platform - see the images below to see what a tag looks like.
4. Add parts of your ad code to Discourse's site settings for the locations you wish your ad to appear.  Refer to image for your ad platform to where parts of your ad tag should go.  For more detail about where the ad will appear
5. Choose Your Ad Size - this is the same size that you've put into your ad provider to create your ad.  Go to the **Plugin Features** heading to see a list of supported Ad sizes.
6. To disable your ad (and not have it display), click on the disable button.

##### Adsense Advertisement Tag to Discourse's Site Settings

![](https://www.dropbox.com/sc/pguxq17zo2rovyd/AAD--LTH_IIgVhgczoaY1Ljva?dl=1)

##### DoubleClick for Publishers' Advertisement Tag to Discourse's Site Settings

![](https://www.dropbox.com/sc/0inoc1iduux0gsf/AADi8tfKX9S6Tx9S8RndcUE8a?dl=1)


### Step 3 - See Your Ad

Once you've configured your settings and your advertising platform has ads that are ready to serve, navigate to the page where you've inputted for the location and you should see ads.


## Plugin Features

In this section, we go into more detail on:
* Available Locations for Ad Display
* Ad Sizes Supported
* Trust Levels

### Available Locations for Ad Display

The following are available locations along with a description and an image showing their location within Discourse to display ads for all platforms.

Location Name | Description | Image of Location
--- | --- | ---
Topic List Top | Ad will appear at the header of Discourse homepage | [Topic list top](https://www.dropbox.com/sc/cpm9i6jj5dtivjc/AACmgp6qxI-8kMp3F2VVWsvba?dl=1) 
Topic Above Post Stream | Ad will appear in the header of all Discourse forum topics | [Topic above post stream](https://www.dropbox.com/sc/1ze0dikrmkfj0wg/AADMGWGVsECEOwZdnmSLGkhZa?dl=1)
Topic Above Suggested | Ad will appear in the footer above suggested topics of all Discourse forum topics | [Topic above suggested](https://www.dropbox.com/sc/y3p2iqwggb5he0e/AAAbrTqZCAYgIhIYE4necmfXa?dl=1)
Post Bottom & Nth Post | Ad will appear on the stipulated nth post within a topic.  So if you have 5 posts in a topic and you want the ad to display after on the 2nd post, put 2 in ```ad_platform_nth_post_code```.  | [Post bottom](https://www.dropbox.com/sc/pguxq17zo2rovyd/AAD--LTH_IIgVhgczoaY1Ljva?dl=1)


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
* 2 shows ads to regular users as well, but not to leaders and elders.
* 3 shows ads to everyone but elders.
* 4 shows ads to everyone including elders.

To find more about trust levels in Discourse, refer to [Discourse's posts on trust levels](https://meta.discourse.org/t/what-do-user-trust-levels-do/4924/7)


## Other Installation

There are two sets of installation instructions:

1. Non-Docker Installation - If you have experience with programming.  This will set up this plugin as a git submodule in your Discourse directory.
2. Local Development - If you want develop locally and have experience with programming.  This will set up this plugin as a symlinked file in Discourse's plugin directory.

If you already have a live Discourse forum up, please go to the Quick Start heading above.


### 1. Non-docker installation


* Run `bundle exec rake plugin:install repo=http://github.com/team-melbourne-rgsoc2015/discourse-adplugin` in your discourse directory
* In development mode, run `bundle exec rake assets:clean`
* In production, recompile your assets: `bundle exec rake assets:precompile`
* Restart Discourse


### 2. Local Development Installation


* Clone the [Discourse Adplugin Repo](http://github.com/team-melbourne-rgsoc2015/discourse-adplugin) in a new local folder.
* Separately clone [Discourse Forum](https://github.com/discourse/discourse) in another local folder.
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

**Discourse.org**: 		Thanks to our mentor [@eviltrout](https://github.com/eviltrout) and the wonderful [Discourse team!](http://www.discourse.org/)

**Our Coaches**: 					Very special thank you to our coaches and honorary coach - [@georg](https://github.com/georg), [@betaass](https://github.com/betaass), [@adelsmee](https://github.com/adelsmee), [@davich](https://github.com/davich), [@link664](https://github.com/link664), [@tomjadams](https://github.com/tomjadams), [@compactcode](https://github.com/compactcode), [@joffotron](https://github.com/joffotron), [@jocranford](https://github.com/jocranford), [@saramic](https://github.com/saramic), [@madpilot](https://github.com/madpilot), [@catkins](https://github.com/catkins)

**Rails Girls**: 			Thanks [@sareg0](https://github.com/sareg0) and the Rails Girls Team for the opportunity to participate in Rails Girls Summer of Code 2015.

 




