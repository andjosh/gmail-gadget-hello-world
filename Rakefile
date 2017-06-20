# Inspired by https://github.com/soundcloudlabs/soundcloud-gmail-gadget
require 'rake'
require 'erb'

VENDOR_JS_FILES = %w(
)
TITLE           = "Hello World Google Gadget App"
VERSION         = '0.1.0'
DESCRIPTION     = "Say Hello World in Google Mail"

def vendor_js_files
  VENDOR_JS_FILES.map do |file|
    File.basename(file).tap do |out|
      `wget #{file} -O #{out}` unless File.exists?(out)
    end
  end
end

def save(in_files, out_file)
  File.open(out_file, "w") do |file|
    file.write merge(in_files)
  end
end

def merge(files)
  Array(files).map do |name|
    File.read(name).tap do |content|
      content.replace(ERB.new(content).result) if name =~ /\.erb/
    end
  end.join("\n\n")
end


namespace :gadget do
  task :prepare do |task|
    @in_path   = "gadget"
    @out_path  = "build/#{@in_path}"
    @js_files  = vendor_js_files + %W(#{@in_path}/main.js)
    @css_files = %W(#{@in_path}/style.css)
  end

  desc "Build the gadget and the xml files"
  task :build => :prepare do
    `mkdir -p #{@out_path}`
    @javascripts = merge(@js_files)
    @styles = merge(@css_files)
    @gadget = ERB.new(File.read("gadget/gadget.html.erb")).result
    save("#{@in_path}/gadget.xml.erb", "#{@out_path}/gadget.xml")
    save("#{@in_path}/application-manifest.xml.erb", "#{@out_path}/application-manifest.xml")
  end
end


task :clean do
  sh <<-END
    rm -rf build live *.js
  END
end

desc "Build all"
task :build_all => :clean do
  Rake::Task["gadget:build"].invoke
end

desc "Release all"
task :release_all do
  Rake::Task["gadget:build"].invoke
end

desc "Deploys gadget to live branch"
task :deploy => :release_all do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to deploy!"
    exit!
  end

  if `git fetch --tags && git tag`.split(/\n/).include?(VERSION)
    raise "Version #{VERSION} already deployed"
  end

  sh <<-END
    cp LICENSE VERSION CHANGES.md build/
    git checkout --track -b gh-pages origin/gh-pages
    git checkout gh-pages
    rm *.js
    rm -rf gadget
    mv -f build/* .
    git commit -a --allow-empty -m 'Release #{VERSION}'
    git push origin gh-pages
    git push origin --tags
    rm -rf gadget
    rm *.zip
    rm *.xpi
    git checkout master
  END
end

task :default => :build_all
