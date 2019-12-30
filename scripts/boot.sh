#!/bin/bash

# Change the welcome message
printf "... W_A_V_E_O_R_B ... \n" > /etc/motd

# Set environment
echo "WAVEORB_PORT=80" >> /etc/environment
echo "NODE_ENV=production" >> /etc/environment

# Set swappiness
sysctl vm.swappiness=10

# Install packages
until apt install -y nodejs npm; do sleep 1; done

# Update npm
npm i npm@latest -g

# Install waveorb server
curl -s https://raw.githubusercontent.com/fugroup/waveorb-bin/master/server-linux -o /root/server-linux
chmod 755 /root/server-linux

# Set up systemd worker
printf "[Unit]\nDescription=Waveorb server\nAfter=network.target\n\n[Service]\nUser=root\nEnvironment=NODE_ENV=production\nEnvironment=WAVEORB_PORT=80\nWorkingDirectory=/root\nExecStart=/root/server-linux\n\n[Install]\nWantedBy=multi-user.target\n" > /etc/systemd/system/waveorb@.service

# Start server
systemctl daemon-reload
systemctl enable waveorb@1
systemctl start waveorb@1
