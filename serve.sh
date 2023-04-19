# directory
cd /home/ubuntu/htp-was

# install package
nvm use 18.16.0
yarn install
yarn build

# copy
pm2 start dist/main.js --name htp-was