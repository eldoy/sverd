# Set up SSL certificate with Let's Encrypt
email=$1
shift
domains=$*
until apt install -y certbot; do sleep 1; done

certbot certonly --standalone --agree-tos --no-eff-email --email $email $domains

# Certificates are stored here:
# /etc/letsencrypt/live/waveorb.com/fullchain.pem
# /etc/letsencrypt/live/waveorb.com/privkey.pem
