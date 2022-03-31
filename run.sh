#!/bin/bash
opt=$1

if [[ $opt = "up-dev" ]]; then
    docker-compose -f docker-compose.dev.yml up -d
elif [[ $opt = "down-dev" ]]; then
  docker-compose -f docker-compose.dev.yml down
elif [[ $opt = "up-dev-build" ]]; then
  docker-compose -f docker-compose.dev.yml build
  docker-compose -f docker-compose.dev.yml up --force-recreate -d
elif [[ $opt = "up-debug" ]]; then
    docker-compose -f docker-compose.debug.yml up -d
elif [[ $opt = "up-debug-build" ]]; then
  docker-compose -f docker-compose.debug.yml build
  docker-compose -f docker-compose.debug.yml up --force-recreate -d
elif [[ $opt = "down-debug" ]]; then
  docker-compose -f docker-compose.debug.yml down
elif [[ $opt = "up-pro" ]]; then
    docker-compose -f docker-compose.yml up -d
elif [[ $opt = "down-pro" ]]; then
  docker-compose -f docker-compose.yml down
elif [[ $opt = "up-pro-build" ]]; then
  docker-compose -f docker-compose.yml build
  docker-compose -f docker-compose.yml up --force-recreate -d
else
  echo "Invalid command"
fi


