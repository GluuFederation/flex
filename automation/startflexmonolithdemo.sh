#!/bin/bash
set -eo pipefail

GLUU_FQDN=$1
GLUU_PERSISTENCE=$2
EXT_IP=$3
FLEX_BUILD_COMMIT=$4

if [[ ! "$GLUU_FQDN" ]]; then
  read -rp "Enter Hostname [demoexample.gluu.org]:                           " GLUU_FQDN
fi
if [[ ! "$GLUU_PERSISTENCE" ]]; then
  read -rp "Enter persistence type [MYSQL|PGSQL]:          " GLUU_PERSISTENCE
fi

if [[ -z $EXT_IP ]]; then
  EXT_IP=$(curl ipinfo.io/ip)
fi

if [[ -z $FLEX_BUILD_COMMIT ]]; then
  FLEX_BUILD_COMMIT="main"
fi


sudo apt-get update
# Install Docker and Docker compose plugin
sudo apt-get remove docker docker-engine docker.io containerd runc -y || echo "Docker doesn't exist..installing.."
sudo apt-get update
sudo apt-get install \
  ca-certificates \
  curl \
  gnupg \
  python3-pip \
  lsb-release \
  git -y
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
    && git checkout "$FLEX_BUILD_COMMIT" \
    && git sparse-checkout set docker-flex-monolith \
    && cd "$WORKING_DIRECTORY"

# -- Parse compose and docker file
sudo apt-get update
PIP_BREAK_SYSTEM_PACKAGES=1 pip3 install dockerfile-parse ruamel.yaml

# switching to version defined by FLEX_BUILD_COMMIT
if [[ "$FLEX_BUILD_COMMIT" ]]; then
  echo "Updating build commit in Dockerfile to $FLEX_BUILD_COMMIT"

  python3 -c "from dockerfile_parse import DockerfileParser ; dfparser = DockerfileParser('/tmp/flex/docker-flex-monolith') ; dfparser.envs['FLEX_SOURCE_VERSION'] = '$FLEX_BUILD_COMMIT'"

  # as FLEX_SOURCE_VERSION is changed, allow docker compose to rebuild image on-the-fly
  # and use the respective image instead of the default image
  python3 -c "from pathlib import Path ; import ruamel.yaml ; compose = Path('/tmp/flex/docker-flex-monolith/flex-mysql-compose.yml') ; yaml = ruamel.yaml.YAML() ; data = yaml.load(compose) ; data['services']['flex']['build'] = '.' ; del data['services']['flex']['image'] ; yaml.dump(data, compose)"

  python3 -c "from pathlib import Path ; import ruamel.yaml ; compose = Path('/tmp/flex/docker-flex-monolith/flex-postgres-compose.yml') ; yaml = ruamel.yaml.YAML() ; data = yaml.load(compose) ; data['services']['flex']['build'] = '.' ; del data['services']['flex']['image'] ; yaml.dump(data, compose)"
fi
# --
if [[ $GLUU_PERSISTENCE == "MYSQL" ]]; then
  bash /tmp/flex/docker-flex-monolith/up.sh mysql
elif [[ $GLUU_PERSISTENCE == "PGSQL" ]]; then
  bash /tmp/flex/docker-flex-monolith/up.sh postgres
fi
echo "$EXT_IP $GLUU_FQDN" | sudo tee -a /etc/hosts > /dev/null
flex_status="unhealthy"
# run loop for 5 mins
echo "Waiting for the Janssen server to come up. Depending on the  resources it may take 3-5 mins for the services to be up."
end=$((SECONDS+300))
while [ $SECONDS -lt $end ]; do
    flex_status=$(docker inspect --format='{{json .State.Health.Status}}' docker-flex-monolith-flex-1) || echo "unhealthy"
    echo "$flex_status"
    if [ "$flex_status" == '"healthy"' ]; then
        break
    fi
    sleep 10
    docker ps
    docker logs docker-flex-monolith-flex-1 || echo "Container is not starting..."
done
if [ "$flex_status" == '"unhealthy"' ]; then
    docker ps
    docker logs docker-flex-monolith-flex-1
    exit 1
fi
echo "Will be ready in exactly 3 mins"
sleep 180
cat << EOF > testendpoints.sh
echo -e "Testing openid-configuration endpoint.. \n"
docker exec docker-flex-monolith-flex-1 curl -f -k https://localhost/.well-known/openid-configuration
echo -e "Testing scim-configuration endpoint.. \n"
docker exec docker-flex-monolith-flex-1 curl -f -k https://localhost/.well-known/scim-configuration
echo -e "Testing fido2-configuration endpoint.. \n"
docker exec docker-flex-monolith-flex-1 curl -f -k https://localhost/.well-known/fido2-configuration
EOF
sudo bash testendpoints.sh
echo -e "You may re-execute bash testendpoints.sh to do a quick test to check the configuration endpoints."
echo -e "Add the following record to your local computers' hosts file to engage with the services $EXT_IP $GLUU_FQDN"
echo -e "To stop run:"
echo -e "/tmp/flex/docker-flex-monolith/down.sh mysql"
echo -e "or /tmp/flex/docker-flex-monolith/down.sh postgres"
echo -e "To restart run:"
echo -e "/tmp/flex/docker-flex-monolith/up.sh mysql"
echo -e "or /tmp/flex/docker-flex-monolith/up.sh postgres"
echo -e "To clean up run:"
echo -e "/tmp/flex/docker-flex-monolith/clean.sh mysql && rm -rf /tmp/flex"
echo -e "or /tmp/flex/docker-flex-monolith/clean.sh postgres && rm -rf /tmp/flex"
