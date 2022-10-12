#!/bin/bash
set -eo pipefail

GLUU_FQDN=$1
GLUU_PERSISTENCE=$2
EXT_IP=$3

if [[ ! "$GLUU_FQDN" ]]; then
  read -rp "Enter Hostname [demoexample.gluu.org]:                           " GLUU_FQDN
fi
if [[ ! "$GLUU_PERSISTENCE" ]]; then
  read -rp "Enter persistence type [LDAP(NOT SUPPORTED YET)|MYSQL]:          " GLUU_PERSISTENCE
fi

if [[ -z $EXT_IP ]]; then
  EXT_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)
  if [[ -z $EXT_IP ]]; then
    read -rp "We couldn't detect your external ip. Please enter it manually: " EXT_IP
  fi
fi

sudo apt-get update
# Install Docker and Docker compose plugin
sudo apt-get remove docker docker-engine docker.io containerd runc -y || echo "Docker doesn't exist..installing.."
sudo apt-get update
sudo apt-get install \
  ca-certificates \
  curl \
  gnupg \
  lsb-release -y
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
WORKING_DIRECTORY=$PWD
# note that as we're pulling from a monorepo (with multiple project in it)
# we are using partial-clone and sparse-checkout to get the docker-flex-monolith code
rm -rf /tmp/flex || echo "/tmp/flex doesn't exist"
git clone --filter blob:none --no-checkout https://github.com/gluufederation/flex /tmp/flex \
    && cd /tmp/flex \
    && git sparse-checkout init --cone \
    && git checkout main \
    && git sparse-checkout set docker-flex-monolith \
    && cd "$WORKING_DIRECTORY"

if [[ $GLUU_PERSISTENCE == "MYSQL" ]]; then
    docker compose -f /tmp/flex/docker-flex-monolith/flex-mysql-compose.yml up -d
fi
echo "$EXT_IP $GLUU_FQDN" | sudo tee -a /etc/hosts > /dev/null
flex_status="unhealthy"
while true; do
    flex_status=$(docker inspect --format='{{json .State.Health.Status}}' docker-flex-monolith-flex-1) || echo "unhealthy"
    echo "$flex_status"
    if [ "$flex_status" == '"healthy"' ]; then
        break
    fi
    sleep 10
    echo "Waiting for the Janssen server to come up. Depending on the  resources it may take 3-5 mins for the services to be up."
done
echo "Will be ready in exactly 3 mins"
sleep 180
cat << EOF > testendpoints.sh
echo -e "Testing openid-configuration endpoint.. \n"
docker exec docker-flex-monolith-flex-1 curl -f -k https://localhost/.well-known/openid-configuration
echo -e "Testing scim-configuration endpoint.. \n"
docker exec docker-flex-monolith-flex-1 curl -f -k https://localhost/.well-known/scim-configuration
echo -e "Testing fido2-configuration endpoint.. \n"
docker exec docker-flex-monolith-flex-1 curl -f -k https://localhost/.well-known/fido2-configuration
docker exec docker-flex-monolith-flex-1 /opt/jans/jans-cli/config-cli.py --operation-id get-properties
EOF
sudo bash testendpoints.sh
echo -e "You may re-execute bash testendpoints.sh to do a quick test to check the configuration endpoints."
echo -e "Add the following record to your local computers' hosts file to engage with the services $EXT_IP $GLUU_FQDN"
echo -e "To clean up run:"
echo -e "docker compose -f /tmp/flex/docker-flex-monolith/mysql-docker-compose.yml down && rm -rf /tmp/flex"
