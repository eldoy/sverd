# https://computingforgeeks.com/how-to-install-mongodb-on-debian/

apt -y install gnupg2
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org.list
apt update
apt -y install mongodb-org
apt info mongodb-org

systemctl enable --now mongod
systemctl restart mongod
