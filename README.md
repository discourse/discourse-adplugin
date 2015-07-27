# Discourse-Adplugin

Ad plugin for Discourse forum.

## Installation

* Supported Discourse version: v1.4

### Special Intallation Instructions for RGSoC Coaches

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

![](https://www.dropbox.com/s/cyouv2pis3o4gx4/ad-codes-p1.png?dl=0)

![](https://www.dropbox.com/s/5z7sl2hdmtzv1ho/ad-codes-p2.png?dl=0)

This is how the ads should display is all is working fine.... (ads also change so don't worry if your ads look different).

**Location: Topic list top**
![](https://www.dropbox.com/s/cbu0otlt2zl5kdw/ad-display-1-discovery-list.png?dl=0)

**Location: Topic top**
![](https://www.dropbox.com/s/cdx0duqkco7rs8s/ad-display-2-topic-top.png?dl=0)


**Location: Above Suggested Topic**
![](https://www.dropbox.com/s/cnkialxmcfust55/ad-display-3-above-suggested.png?dl=0)



* Finally, if you wish to disable the ad, tick ad disabling box

# Ad Providers Supported

* Google DFP

## License

GPL v2

TO-DO:

* Publisher ID support 
* Add size restrictions in ad slot inventory + size input fields
* Trust levels
* More ad providers 
