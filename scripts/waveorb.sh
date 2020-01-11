# Install node and npm
until apt install -y nodejs npm; do sleep 1; done

# Update npm
npm i npm@latest -g

# Install waveorb server
mkdir -p /var/www
curl -s https://raw.githubusercontent.com/fugroup/waveorb-bin/master/server-linux -o /var/www/server-linux
chmod 755 /var/www/server-linux
