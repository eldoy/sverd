#!/bin/bash

# Install packages
apt update && apt upgrade && apt -y install nodejs npm

# Change the welcome message
printf "Welcome.\n" > /etc/motd
