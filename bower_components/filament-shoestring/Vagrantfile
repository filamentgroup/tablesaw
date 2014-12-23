# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network "private_network", ip: "33.33.33.10"
  config.vm.network "forwarded_port", guest: 80, host: 4567

  config.vm.provision(:shell, :inline => <<-CMD)
    # exit on error
    set -e

    echo "Installing node and deps ..."
    if ! which node; then
      apt-get update
      apt-get install -y build-essential fontconfig
      apt-get install -y python-software-properties
      add-apt-repository ppa:chris-lea/node.js
      apt-get update
      apt-get install -y nodejs
    fi
    apt-get install -y vim

  CMD

  config.vm.provision(:shell, :inline => "cd /vagrant && npm install && npm test")
end
