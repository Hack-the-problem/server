# directory
cd /home/ubuntu/htp-was

# install package
sudo yarn build

# copy
pm2 start dist/main.js --name htp-was