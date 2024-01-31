#!/bin/bash

while getopts b: flag
do
    case "${flag}" in
        b) bucket=${OPTARG};;
        *) echo "invalid flag ${flag}"; exit 1
    esac
done

echo "Restoring cache from ${bucket}"

# If there is a cache and the content is not older than a month
TIMESTAMP=$(gsutil cat "gs://${bucket}/web-cache/timestamp.txt" || echo 0)
SECONDS_IN_A_MONTH=2629743
if (( $(date +%s) - $TIMESTAMP < $SECONDS_IN_A_MONTH )); then
  gsutil -q -m cp "gs://${bucket}/web-cache/yarn_cache.tgz" /tmp
  mkdir -p "$YARN_CACHE"

  echo 'Restoring yarn cache'
  tar -xzf /tmp/yarn_cache.tgz -C "$YARN_CACHE"
  echo "$(ls -pR "$YARN_CACHE" | grep -v / | wc -l) files restored to $YARN_CACHE"
else
  if (( $TIMESTAMP == 0 )); then
    echo "Skipping cache restore: timestamp not found at gs://${bucket}/web-cache/timestamp.txt"
  else
    echo "Skipping cache restore: timestamp at gs://${bucket}/web-cache/timestamp.txt is older than a month"
  fi

fi
