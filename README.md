# Official Discourse Advertising Plugin

This is the official Discourse advertising plugin.  It allows advertisements to be served by supported advertising platforms for users with a Discourse forum.

**Supported Discourse Version**: 1.4</p>
**Supported Ad Platforms**: 

* [Google Adsense](http://www.google.com.au/adsense/start/why-adsense.html)
* [Google Double Click for Publishers](https://www.google.com/dfp)


## Quick Start in 3 Steps

This quick start shows you how to install this plugin and use it.  Recommended if you have:

* A live discourse forum 
* You have deployed that forum using Docker.  Most people using Digital Ocean will have deployed Discourse using Docker. 

For installation for non-docker or local development (those with programming experience), see Other Installation.


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


#### Step 2(b)(i) - Input Your Details (Adsense)

* Insert Image + Explain the code in the provided tag from ad provider.


#### Step 2(b)(ii) - Input Your Details (DoubleClick for Publishers)

* Insert Image + Explain the code in the provided tag from ad provider.


// TO BE FIXED START
Add GIFS, Images
✘ this is a cross
✓ this is a tick
After installation users likely want to:
- Choose platform - DONE
- Input ad codes + do a few other things. - DFP in detail with custom targeting - write guide on this.
- Display ad.



Input 3 parts - ad code (topmost box), width, height. And be sure to untick the disable box. Then, refresh the page for the inputs to take effect, and go to the ad location.

Usually google sizes to input are (width*height) 300*250 or 728*90 (best) respectively. Input your dfp ad code.

The namings in settings are with reference to the plugin outlets created by Discourse.

`dfp_topic_list_top_code`: ad will appear at the header of Discourse homepage

`dfp_topic_above_post_stream_code`: ad will appear at the header of all Discourse forum topics

`dfp_topic_above_suggested_code`: ad will appear at the footer above suggested topics of all Discourse forum topics

`dfp_post_bottom_code`: ad will appear on the Nth post (be sure to input N in the bottom-most box called 

`dfp_nth_post_code` and ensure your total number of posts in topic >=N. For example, if you input N = 4, the forum should have at least 4 replies/posts)
// TO BE FIXED END


* Finally, if you wish to disable the ad, tick ad disabling box

### Step 3 - See Your Ad

Once you've configured your settings and your advertising platform has ads that are ready to serve, navigate to the page where you've inputted for the location and you should see ads.  For example, a Discourse forum serving ads looks like this:

INSERT_IMAGE_HERE



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



## Advertisement Sizes Supported

This plugin supports the following ad sizes for the following locations.

All locations except post bottom | Post bottom location | Mobile
--- | --- | ---
728 x 90 | 728 x 90 | 320 x 50 
336 x 280 | 960 x 90 |
300 x 250 | 468 x 60 |
960 x 90 | 234 x 60 |
468 x 60 | |
234 x 60 | |
125 x 125 | |
180 x 150 | |
200 x 200 | |
250 x 250 | | 


## Questions or Want to Contribute?

Open an Issue on this repository to start a chat.  

Issues and Pull Requests are greatly appreciated.  Bear in mind that when submitting feature requests, if it's not something that most people will use, it probably won't get merged.


## Credits

Discourse.org - Thanks to our mentor @eviltrout and the Discourse team - @LIST_OUT_THEIR_GITHUB_HANDLE
Rails Girls - Thanks @sareg0 and the Rails Girls Team.
Our Coaches - @LIST_OUT_THEIR_GITHUB_HANDLE


## License

TBC: GPL v2 or MIT

