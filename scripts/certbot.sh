# Set up SSL certificate with Let's Encrypt
email=$1
shift
options=$*

certbot certonly --nginx --agree-tos --no-eff-email --email $email $options

# Certificates are stored here:
# /etc/letsencrypt/live/waveorb.com/fullchain.pem
# /etc/letsencrypt/live/waveorb.com/privkey.pem
