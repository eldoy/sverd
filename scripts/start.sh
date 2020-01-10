# Enable and start services
systemctl daemon-reload

# Start mongodb
systemctl enable mongod
systemctl start mongod

# Start waveorb
systemctl enable waveorb@1
systemctl start waveorb@1

# Start nginx
systemctl enable nginx
systemctl start nginx
