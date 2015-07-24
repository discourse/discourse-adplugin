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
Now you are done.


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
* Add DFP link into code boxes, input width and height based on Google Ad Ad units
* If you wish to disable the ad, tick ad disabling box

# Ad Providers Supported

* Google DFP

## License

GPL v2

TO-DO:

* Publisher ID support 
* Add size restrictions in ad slot inventory + size input fields
* Trust levels
* More ad providers 
