#!/bin/sh
set -o errexit

source ./build.properties

echo "Pushing image (${DOCKER_IMAGE_REPOSITORY}:${DOCKER_IMAGE_TAG})..."
docker push ${DOCKER_IMAGE_REPOSITORY}:${DOCKER_IMAGE_TAG}
