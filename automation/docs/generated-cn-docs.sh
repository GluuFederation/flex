#!/bin/bash
set -euo pipefail
# The below variable represents the top level directory of the repository
MAIN_DIRECTORY_LOCATION=$1
echo "Copies generated/duplicate cn docs such as the helm main readme to the main docs folder"

echo "Generating helm docs"
# echo "Install helm docs
mkdir helmtemp
cd helmtemp
HELM_DOCS_VERSION=$(curl "https://api.github.com/repos/norwoodj/helm-docs/releases/latest" | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/' | cut -c2-)
curl -sSL https://github.com/norwoodj/helm-docs/releases/download/v"${HELM_DOCS_VERSION}"/helm-docs_"${HELM_DOCS_VERSION}"_Linux_x86_64.tar.gz  -o helm-docs_"${HELM_DOCS_VERSION}"_Linux_x86_64.tar.gz
tar xvf helm-docs_"${HELM_DOCS_VERSION}"_Linux_x86_64.tar.gz
sudo cp helm-docs /usr/local/bin/
cd ..
# Generate Helm docs
helm-docs "$MAIN_DIRECTORY_LOCATION"/flex-cn-setup/pygluu/kubernetes/templates/helm/
rm -rf helmtemp
echo "Copying Helm chart Readme to helm-chart.md"
cp "$MAIN_DIRECTORY_LOCATION"/flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/README.md "$MAIN_DIRECTORY_LOCATION"/docs/reference/kubernetes/helm-chart.md
echo "Adding keywords to helm-chart"
sed -i '1 s/^/---\ntags:\n  - administration\n  - reference\n  - kubernetes\n---\n/' "$MAIN_DIRECTORY_LOCATION"/docs/reference/kubernetes/helm-chart.md
echo "Copying docker-monolith main README.md to compose.md"
cp "$MAIN_DIRECTORY_LOCATION"/docker-jans-monolith/README.md "$MAIN_DIRECTORY_LOCATION"/docs/install/docker-install/compose.md
echo "Copying docker images Readme to respective image md"
# cp docker files main README.md
docker_images="docker-casa docker-admin-ui docker-jans-monolith"
for image in $docker_images;do
  cp "$MAIN_DIRECTORY_LOCATION"/"$image"/README.md "$MAIN_DIRECTORY_LOCATION"/docs/reference/kubernetes/"$image".md
done
echo "cp docker-opendj main README.md"
wget https://raw.githubusercontent.com/GluuFederation/docker-opendj/5.0/README.md -O "$MAIN_DIRECTORY_LOCATION"/docs/reference/kubernetes/docker-opendj.md
sed -i '1 s/^/---\ntags:\n  - administration\n  - reference\n  - kubernetes\n - docker image\n---\n/' "$MAIN_DIRECTORY_LOCATION"/docs/reference/kubernetes/docker-opendj.md
echo "generated-cn-docs.sh executed successfully!"