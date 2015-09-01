# Discourse-Adplugin

Ad plugin for Discourse forum.

## Installation

* Supported Discourse version: v1.4

* Supported Ad Platforms: Google Adsense and Doubleclick for Publishers
 
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

* Go to Admin > Settings > DFP Plugin / Adsense Plugin

# DFP


Input 3 parts - ad code (topmost box), width, height. And be sure to untick the disable box. Then, refresh the page for the inputs to take effect, and go to the ad location.

Usually google sizes tDOcso input are (width*height) 300*250 or 728*90 (best) respectively. Input your dfp ad code.

The namings in settings are with reference to the plugin outlets created by Discourse.

`dfp_topic_list_top_code`: ad will appear at the header of Discourse homepage

`dfp_topic_above_post_stream_code`: ad will appear at the header of all Discourse forum topics

`dfp_topic_above_suggested_code`: ad will appear at the footer above suggested topics of all Discourse forum topics

`dfp_post_bottom_code`: ad will appear on the Nth post (be sure to input N in the bottom-most box called 

`dfp_nth_post_code` and ensure your total number of posts in topic >=N. For example, if you input N = 4, the forum should have at least 4 replies/posts)



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

# Ad Sizes

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

* Mobile Ads will automatically default to 320*50.

## License

{{fill in here}}

TODO:
Non docker installation
Expand on the usage - dfp and adsense