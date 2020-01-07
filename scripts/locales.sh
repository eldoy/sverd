echo "UTC" > /etc/timezone && \
dpkg-reconfigure -f noninteractive tzdata && \
sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
echo 'LANG=en_US.UTF-8' > /etc/default/locale && \
dpkg-reconfigure --frontend=noninteractive locales && \
update-locale LANG=en_US.UTF-8

# echo "Europe/Oslo" > /etc/timezone && \
# dpkg-reconfigure -f noninteractive tzdata && \
# sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
# sed -i -e 's/# nb_NO.UTF-8 UTF-8/nb_NO.UTF-8 UTF-8/' /etc/locale.gen && \
# echo 'LANG="nb_NO.UTF-8"'>/etc/default/locale && \
# dpkg-reconfigure --frontend=noninteractive locales && \
# update-locale LANG=nb_NO.UTF-8