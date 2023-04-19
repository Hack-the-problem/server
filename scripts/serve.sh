# directory
cd /home/ubuntu/htp-was

# install package
sudo yarn build

# pm2
pm2 stop htp-was
pm2 start dist/main.js --name htp-was