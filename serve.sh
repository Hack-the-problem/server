# unzip files
cd /home/ubuntu/htp-was
tar xvzf htp-was.tar.gz

# install package
yarn install

# copy
pm2 start dist/main.js --name htp-was