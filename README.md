# Discourse-Adplugin

Ad plugin for Discourse forum.

## Installation

* Supported Discourse version: v1.4

### Special Installation Instructions for RGSoC Coaches

* You would have already gotten the discourse to load locally.  If not, do that first.  You can find instructions [here](https://github.com/team-melbourne-rgsoc2015/discoursetest-avn).
* Then clone this repo in a new local folder.
* In the terminal, go into your discourse folder and then into plugins.  Example ```cd ~/code/discourse/plugins```
* Create a symlink in this folder and do that by doing:

```
ln -s ~/whereever_your_cloned_ad_plugin_path_is .

For example: ln -s ~/discourse-plugin-test .

```
Now you are done.  See 'Usage' heading for sample ad codes that you can input.


### Non-docker installation

* Run `bundle exec rake plugin:install repo=http://github.com/team-melbourne-rgsoc2015/discourse-adplugin` in your discourse directory
* In development mode, run `bundle exec rake assets:clean`
* In production, recompile your assets: `bundle exec rake assets:precompile`
* Restart Discourse

### Docker installation

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
* Rebuild the container

```
cd /var/docker
git pull
./launcher rebuild app
```


## Usage

* Go to Admin > Settings > Ad Plugin
* Add DFP link into code boxes, input width and height based on Google Ad Ad units.  Here are some sample ad codes that you can put in the input into the settings.  But remember:
⋅⋅* Each slot requires a different sample ad code.  That means, you cannot put the same ad sample ad codes multiple times in different slots.  They won't appear.  
⋅⋅* Don't click on the ad.  
⋅⋅* On the last stroke of midnight, the magic will wear off. Make sure you leave the ball before then. 

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

GPL v2

TO-DO:

* Fix up the image loading issue in Readme.
* Publisher ID support 
* Trust levels
* More ad providers!
