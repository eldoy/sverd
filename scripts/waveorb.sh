# Install node and npm
until apt install -y nodejs npm; do sleep 1; done

# Update npm
npm i npm@latest -g

# Install waveorb server
mkdir -p $1
curl -s https://raw.githubusercontent.com/fugroup/waveorb-bin/master/server-linux -o $1/$2
chmod 755 $1/$2
