# Install waveorb server
mkdir -p $1
curl -s https://raw.githubusercontent.com/fugroup/waveorb-bin/master/server-linux -o $1/$2
chmod 755 $1/$2
