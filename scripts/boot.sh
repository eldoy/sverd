#!/bin/bash

# Change the welcome message
printf "... W_A_V_E_O_R_B ... \n" > /etc/motd

# Set environment
echo "EDITOR=vim" >> /etc/environment
echo "NODE_ENV=production" >> /etc/environment
echo "WAVEORB_PORT=443" >> /etc/environment
echo "WAVEORB_SSL_CERT=/etc/letsencrypt/live/waveorb.com/fullchain.pem" >> /etc/environment
echo "WAVEORB_SSL_KEY=/etc/letsencrypt/live/waveorb.com/privkey.pem" >> /etc/environment

# Set swappiness
sysctl vm.swappiness=10

# Install packages
until apt install -y nodejs npm zsh git ufw certbot; do sleep 1; done

# Install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh) --unattended"
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="norm"/g' /root/.zshrc
sed -i '/DISABLE_AUTO_UPDATE/s/^# //g' /root/.zshrc
chsh -s /usr/bin/zsh root

# Set up SSL certificate with Let's Encrypt
certbot certonly --standalone --agree-tos --no-eff-email --email hello@waveorb.com -d waveorb.com -d www.waveorb.com
# certbot renew
# /etc/letsencrypt/live/waveorb.com/fullchain.pem
# /etc/letsencrypt/live/waveorb.com/privkey.pem

# Install cronjobs
(crontab -l 2>/dev/null; echo "20 3 * * * certbot renew --noninteractive --post-hook 'systemctl restart waveorb@1'") | crontab -
# 20 3 * * * certbot renew --noninteractive --post-hook 'systemctl restart waveorb@1'

# Update npm
npm i npm@latest -g

# Install waveorb server
curl -s https://raw.githubusercontent.com/fugroup/waveorb-bin/master/server-linux -o /root/server-linux
chmod 755 /root/server-linux

# Set up systemd worker
printf "[Unit]\nDescription=Waveorb server\nAfter=network.target mongodb.service\nStartLimitInterval=0\n\n[Service]\nUser=root\nRestart=always\nRestartSec=10ms\nEnvironment=NODE_ENV=production\nEnvironment=WAVEORB_PORT=443\nEnvironment=WAVEORB_SSL_CERT=/etc/letsencrypt/live/waveorb.com/fullchain.pem\nEnvironment=WAVEORB_SSL_KEY=/etc/letsencrypt/live/waveorb.com/privkey.pem\nWorkingDirectory=/root\nExecStart=/usr/local/bin/waveorb serve\n\n[Install]\nWantedBy=multi-user.target\n" >> /etc/systemd/system/waveorb@.service

# Start server
systemctl daemon-reload
systemctl enable waveorb@1
systemctl start waveorb@1
# systemctl restart waveorb@1

# Set up firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22
# ufw allow 80
ufw allow 443
ufw enable
