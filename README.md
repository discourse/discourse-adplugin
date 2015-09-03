# Official Discourse Advertising Plugin

This is the official Discourse advertising plugin.  It allows advertisements to be served by supported advertising platforms for users with a Discourse forum.

**Supported Discourse Version**: 1.4
**Supported Ad Platforms**: [Google Adsense](http://www.google.com.au/adsense/start/why-adsense.html), [Google Double Click for Publishers](https://www.google.com/dfp)


## Installation

There are three sets of installation instructions:

1. **Docker Installation - Recommended ** - If you have a live Discourse forum and minimal programming experience.
2. Non-Docker Installation - If you have experience with programming.  This will set up this plugin as a git submodule in your Discourse directory.
3. Local Development - If you want develop locally and have experience with programming.  This will set up this plugin as a symlinked file in Discourse's plugin directory.

* Supported Discourse version: v1.4


### 1. Docker Installation - Recommended

As seen in a [how-to on meta.discourse.org](https://meta.discourse.org/t/advanced-troubleshooting-with-docker/15927#Example:%20Install%20a%20plugin), simply **add the plugin's repo url to your container's app.yml file**:

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

### 2. Non-docker installation

* Run `bundle exec rake plugin:install repo=http://github.com/team-melbourne-rgsoc2015/discourse-adplugin` in your discourse directory
* In development mode, run `bundle exec rake assets:clean`
* In production, recompile your assets: `bundle exec rake assets:precompile`
* Restart Discourse


### 3. Local Development Installation

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



## Usage


Note TODO:
After installation users likely want to:
- Choose platform.
- Input ad codes + do a few other things. - DFP in detail with custom targeting - write guide on this.
- Display ad.


* Go to Admin > Settings > Ad Plugin
* Add DFP link into code boxes, input width and height based on Google Ad Ad units.  Here are some sample ad codes that you can put in the input into the settings.  But remember:
⋅⋅* Each slot requires a different sample ad code.  That means, you cannot put the same ad sample ad codes multiple times in different slots.  They won't appear.  
⋅⋅* Don't click on the ad.  
⋅⋅* On the last stroke of midnight, the magic will wear off. Make sure you leave the ball before then. 

*Please test both plugins individually* - don't symlink both together, instead test them in isolation. 

Input 3 parts - ad code (topmost box), width, height. And be sure to untick the disable box. Then, refresh the page for the inputs to take effect, and go to the ad location.

Usually google sizes to input are (width*height) 300*250 or 728*90 (best) respectively. Input your dfp ad code.

The namings in settings are with reference to the plugin outlets created by Discourse.

`dfp_topic_list_top_code`: ad will appear at the header of Discourse homepage

`dfp_topic_above_post_stream_code`: ad will appear at the header of all Discourse forum topics

`dfp_topic_above_suggested_code`: ad will appear at the footer above suggested topics of all Discourse forum topics

`dfp_post_bottom_code`: ad will appear on the Nth post (be sure to input N in the bottom-most box called 

`dfp_nth_post_code` and ensure your total number of posts in topic >=N. For example, if you input N = 4, the forum should have at least 4 replies/posts)



### Sample DFP Ad Codes:
1. /142953540/PostandCourier/Postandcourier.com/News/Leaderboard_Bottom
2. /6355419/Travel/Europe/France/Paris
3. /1047893/kv_home_bigbox1

This is how it looks like when you put it in site settings.
(Images here aren't showing atm - but you can go to [this link to see the ad codes and what the ads look like when they're loaded](https://meta.discourse.org/t/rails-girls-soc-banter/26875/53)).

![](https://www.dropbox.com/sc/cyouv2pis3o4gx4/ad-codes-p1.png?dl=1)

![](https://www.dropbox.com/sc/5z7sl2hdmtzv1ho/ad-codes-p2.png?dl=1)

This is how the ads should display is all is working fine.... (ads also change so don't worry if your ads look different).

**Location: Topic list top**
![](https://www.dropbox.com/sc/cbu0otlt2zl5kdw/ad-display-1-discovery-list.png?dl=1)

**Location: Topic top**
![](https://www.dropbox.com/sc/cdx0duqkco7rs8s/ad-display-2-topic-top.png?dl=1)

**Location: Above Suggested Topic**
![](https://www.dropbox.com/sc/cnkialxmcfust55/ad-display-3-above-suggested.png?dl=1)



* Finally, if you wish to disable the ad, tick ad disabling box

# Ad Providers Supported

* Google DFP

# Potential Ad Sizes

Restricted container:
Max H: 300 or lower of ad,  W: 1000 left align.

Topic list top, Topic top, Above Suggested
-	728*90
-	336*280
-	300*250
-	960*90
-	468*60
-	234*60
-	125*125
-	180*150
-	200*200
-	250*250

Post Bottom
Max H: 90 or lower of ad,  W: 1000 left align.

-	728*90
-	960*90
-	468*60
-	234*60

## License

GPL v2 or MIT?

