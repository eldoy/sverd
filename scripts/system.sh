# Install system essentials
until apt install -y build-essential rsync; do sleep 1; done

# Change the welcome message
printf "ᚠᚢᚦᚬᚱᚴᚼᚾᛁᛅᛦᛋᛏᛒᛘᛚ\n" > /etc/motd

# Set environment
echo "LC_ALL=en_US.UTF-8" >> /etc/environment
echo "EDITOR=vim" >> /etc/environment
echo "NODE_ENV=production" >> /etc/environment

# Set hostname
echo "Setting hostname to $1"
echo $1 > /etc/hostname
hostnamectl set-hostname $1

# Set swappiness
sysctl vm.swappiness=10

# Set locale
echo "UTC" > /etc/timezone && \
dpkg-reconfigure -f noninteractive tzdata && \
sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
echo 'LANG=en_US.UTF-8' > /etc/default/locale && \
dpkg-reconfigure --frontend=noninteractive locales && \
update-locale LANG=en_US.UTF-8
