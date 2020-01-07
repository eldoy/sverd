# Install brotli
wget https://nginx.org/download/nginx-1.17.7.tar.gz
tar zxvf nginx-1.17.7.tar.gz
rm nginx-1.17.7.tar.gz

git clone https://github.com/google/ngx_brotli.git
cd ngx_brotli && git submodule update --init && cd ~
cd ~/nginx-1.17.7

apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev

./configure --with-compat --add-dynamic-module=../ngx_brotli
make modules
cp objs/*.so /etc/nginx/modules
chmod 644 /etc/nginx/modules/*.so

cd ~
rm -rf ~/nginx-1.17.7

# Install nginx package
wget https://nginx.org/keys/nginx_signing.key
apt-key add nginx_signing.key
rm nginx_signing.key
printf "deb https://nginx.org/packages/mainline/debian/ `lsb_release -sc` nginx \ndeb-src https://nginx.org/packages/mainline/debian/ `lsb_release -sc` nginx \n" >> /etc/apt/sources.list.d/nginx_mainline.list
apt update
apt install -y nginx
# Other modules:
# nginx-module-geoip nginx-module-image-filter nginx-module-njs nginx-module-perl nginx-module-xslt
