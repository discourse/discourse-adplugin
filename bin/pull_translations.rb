#!/usr/bin/env ruby

# Usage:
#   bundle install
#   bundle exec bin/pull_translations.rb
#
# To choose which languages to update, list them as arguments:
#   bundle exec bin/pull_translations.rb he uk

require 'translations_manager'

YML_DIRS = ['config/locales'].map { |d| File.expand_path(d) }
YML_FILE_PREFIXES = ['server', 'client']

TranslationsManager::TransifexUpdater.new(YML_DIRS, YML_FILE_PREFIXES, *ARGV).perform
