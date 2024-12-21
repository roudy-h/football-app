#/bin/bash

#sudo kill -9 $(sudo lsof -t -i:8010)
#sudo kill -9 $(sudo lsof -t -i:8020)
#sudo kill -9 $(sudo lsof -t -i:8030)
#sudo kill -9 $(sudo lsof -t -i:8040)
#sudo kill -9 $(sudo lsof -t -i:8050)

sudo killall node
sudo killall mongod-x64-ubuntu-6.0.9