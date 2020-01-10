# Set up SSL certificate with Let's Encrypt
until apt install -y certbot; do sleep 1; done
certbot certonly --standalone --agree-tos --no-eff-email --email hello@waveorb.com -d waveorb.com -d www.waveorb.com
# certbot renew
# /etc/letsencrypt/live/waveorb.com/fullchain.pem
# /etc/letsencrypt/live/waveorb.com/privkey.pem

# Install cronjobs
(crontab -l 2>/dev/null; echo "20 3 * * * certbot renew --noninteractive --post-hook 'systemctl restart waveorb@1'") | crontab -
# 20 3 * * * certbot renew --noninteractive --post-hook 'systemctl restart waveorb@1'
