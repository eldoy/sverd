# Enable and start services
systemctl daemon-reload

# Start mongodb
systemctl enable mongod
systemctl restart mongod

# Start waveorb
systemctl enable $1@1
systemctl restart $1@1

# Start nginx
systemctl enable nginx
systemctl restart nginx
