# Enable and start services
systemctl daemon-reload

# Start mongodb
systemctl enable mongod
systemctl restart mongod

# Start waveorb
systemctl enable appserver@1
systemctl restart appserver@1

# Start nginx
systemctl enable nginx
systemctl restart nginx
