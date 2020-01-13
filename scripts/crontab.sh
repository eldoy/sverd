# Install cronjobs
(crontab -l 2>/dev/null; echo "20 3 * * * certbot renew --noninteractive --post-hook 'systemctl restart $1@1'") | crontab -
