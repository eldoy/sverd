# Install zsh
until apt -y install zsh git; do sleep 1; done
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh) --unattended"
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="norm"/g' /root/.zshrc
sed -i '/DISABLE_AUTO_UPDATE/s/^# //g' /root/.zshrc
chsh -s /usr/bin/zsh root
