# Set up firewall
until apt install -y ufw; do sleep 1; done
ufw default deny incoming
ufw default allow outgoing
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
