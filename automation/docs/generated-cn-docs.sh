#!/bin/bash
set -euo pipefail

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
helm-docs flex-cn-setup/pygluu/kubernetes/templates/helm/
rm -rf helmtemp
echo "Copying Helm chart Readme to helm-chart.md"
cp ./flex-cn-setup/pygluu/kubernetes/templates/helm/gluu/README.md ./docs/reference/kubernetes/helm-chart.md
echo "Adding keywords to helm-chart"
sed -i '1 s/^/---\ntags:\n  - administration\n  - reference\n  - kubernetes\n---\n/' ./docs/reference/kubernetes/helm-chart.md
echo "Copying docker-monolith main README.md to compose.md"
cp ./docker-jans-monolith/README.md  ./docs/install/docker-install/compose.md
echo "Copying docker images Readme to respective image md"
# cp docker files main README.md
docker_images="docker-casa docker-admin-ui docker-jans-monolith"
for image in $docker_images;do
  cp ./"$image"/README.md ./docs/reference/kubernetes/"$image".md
done
echo "cp docker-opendj main README.md"
wget https://raw.githubusercontent.com/GluuFederation/docker-opendj/5.0/README.md -O ./docs/reference/kubernetes/docker-opendj.md
sed -i '1 s/^/---\ntags:\n  - administration\n  - reference\n  - kubernetes\n - docker image\n---\n/' ./docs/reference/kubernetes/docker-opendj.md
