#!/bin/bash

while getopts b: flag
do
    case "${flag}" in
        b) bucket=${OPTARG};;
        *) echo "invalid flag ${flag}"; exit 1
    esac
done

tar -czf /tmp/yarn_cache.tgz -C "$YARN_CACHE" .
echo "$(tar -tvzf /tmp/yarn_cache.tgz | wc -l) files copied from $YARN_CACHE"

echo "Saving dependencies to gs://${bucket}/web-cache/"
gsutil -q -m cp /tmp/yarn_cache.tgz "gs://${bucket}/web-cache/"

echo "Saving timestamp to gs://${bucket}/web-cache/"
date +%s | gsutil -q cp - "gs://${bucket}/web-cache/timestamp.txt"
