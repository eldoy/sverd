# https://computingforgeeks.com/how-to-install-mongodb-on-debian/

# Install mongodb
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org.list
apt update
until apt install -y mongodb-org; do sleep 1; done
