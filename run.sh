#!/bin/bash
opt=$1

if [[ $opt = "up-dev" ]]; then
    docker-compose -f docker-compose.dev.yml up -d
elif [[ $opt = "down-dev" ]]; then
  docker-compose -f docker-compose.dev.yml down
else
  echo "Invalid command"
fi


