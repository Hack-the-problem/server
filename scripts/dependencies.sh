# Install Node.js 18.x
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install NestJS CLI
sudo npm install -g @nestjs/cli

# Install dependencies
cd /home/ubuntu/htp-was
yarn install