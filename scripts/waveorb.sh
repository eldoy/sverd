# Install node and npm
until apt install -y nodejs npm; do sleep 1; done

# Update npm
npm i npm@latest -g

# Install waveorb server
curl -s https://raw.githubusercontent.com/fugroup/waveorb-bin/master/server-linux -o /var/www/server-linux
chmod 755 /var/www/server-linux

# Set up systemd worker
# printf "[Unit]\nDescription=Waveorb server\nAfter=network.target mongodb.service\nStartLimitInterval=0\n\n[Service]\nUser=root\nRestart=always\nRestartSec=10ms\nEnvironment=NODE_ENV=production\nWorkingDirectory=/var/www\nExecStart=/var/www/server-linux\n\n[Install]\nWantedBy=multi-user.target\n" >> /etc/systemd/system/waveorb@.service
