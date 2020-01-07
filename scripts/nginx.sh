wget https://nginx.org/keys/nginx_signing.key
apt-key add nginx_signing.key
rm nginx_signing.key
printf "deb https://nginx.org/packages/mainline/debian/ `lsb_release -sc` nginx \ndeb-src https://nginx.org/packages/mainline/debian/ `lsb_release -sc` nginx \n" >> /etc/apt/sources.list.d/nginx_mainline.list
apt update
apt install -y nginx
# Other modules:
# nginx-module-geoip nginx-module-image-filter nginx-module-njs nginx-module-perl nginx-module-xslt