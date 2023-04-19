# directory
cd /home/ubuntu/htp-was

# install package
nvm install 18.16.0
nvm use 18.16.0
node -v
yarn install
yarn build

# copy
pm2 start dist/main.js --name htp-was