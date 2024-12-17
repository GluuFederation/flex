#!/bin/bash
set -euo pipefail
echo "Modifies project files in preparation for a release"


modify_jans_commit_id() {
  # Copy the latest commit id and replace it inside the ENV `JANS_SOURCE_VERSION`
  LATEST_JANS_COMMIT=$(curl -s -H "Accept: application/vnd.github.VERSION.sha" "https://api.github.com/repos/JanssenProject/jans/commits/v$JANS_VERSION")
  egrep -lRZ --include=Dockerfile . | xargs -0 -l sed -i -e "s/ENV JANS_SOURCE_VERSION=.*/ENV JANS_SOURCE_VERSION=$LATEST_JANS_COMMIT/g"
  echo "Jans commit id updated successfully!"
}

modify_flex_commit_id() {
  # Search and replace `FLEX_SOURCE_VERSION` with the latest commit
  LATEST_FLEX_COMMIT=$(curl -s -H "Accept: application/vnd.github.VERSION.sha" "https://api.github.com/repos/GluuFederation/flex/commits/main")
  egrep -lRZ --include=Dockerfile . | xargs -0 -l sed -i -e "s/ENV FLEX_SOURCE_VERSION=.*/ENV FLEX_SOURCE_VERSION=$LATEST_FLEX_COMMIT/g"
  echo "Flex source version updated successfully!"
}

modify_version() {
  # modify app_info.json and python version files
  sed -i -e "s/\"JANS_BUILD\": \"-SNAPSHOT\"/\"JANS_BUILD\": \"\"/g" ./flex-linux-setup/flex_linux_setup/flex_setup.py
  egrep -lRZ --include=version.py . | xargs -0 -l sed -i -e "s/__version__ = \"$SETUP_VERSION-dev\"/__version__ = \"$SETUP_VERSION\"/g"
  egrep -lRZ --exclude=CONTRIBUTING.md . | xargs -0 -l sed -i -e "s/$SETUP_VERSION-SNAPSHOT/$SETUP_VERSION/g"
}

modify_helm_chart() {
  # Update chart `appVersion` `version` and image tags to the official prospected versions and tags.
  egrep -lRZ --include=Chart.yaml . | xargs -0 -l sed -i -e "s/appVersion: .*/appVersion: \"$VERSION\"/g"
  egrep -lRZ --include=Chart.yaml --exclude-dir=gluu-all-in-one . | xargs -0 -l sed -i -e "s/version: .*/version: $HELM_RELEASE/g" # This should be $VERSION
  egrep -lRZ --include=Chart.yaml --exclude-dir=gluu-all-in-one . | xargs -0 -l sed -i -e "s/:1.*_dev/:$JANS_VERSION-1/g"
  egrep -lRZ --include=values.yaml --exclude-dir=gluu-all-in-one . | xargs -0 -l sed -i -e "s/:1.*_dev/: $JANS_VERSION-1/g"
  # Update chart `appVersion` `version` and image tags to the official prospected versions and tags.
  egrep -lRZ --include=Chart.yaml --exclude-dir=gluu . | xargs -0 -l sed -i -e "s/version: .*/version: $JANS_VERSION/g"
  helm-docs ./charts --skip-version-footer
}

modify_version_files() {
  # Update versions files
  echo "$VERSION-1" > docker-flex-monolith/version.txt
  echo "$DOCKER_VERSION-1" > docker-flex-all-in-one/version.txt
  echo "$DOCKER_VERSION-1" > docker-admin-ui/version.txt
  echo "__version__ = \"$SETUP_VERSION\"" > flex-linux-setup/flex_linux_setup/version.py
  # bash json parse admin-ui/package.json file and replace version key
  jq '.version = $version' --arg version "$ADMIN_UI_VERSION" ./admin-ui/package.json > tmp.$$.json && mv tmp.$$.json admin-ui/package.json
}

# SNAPSHOT FUNCTIONS
modify_snapshot_version() {
  # Modify `./flex-linux-setup/flex_linux_setup/flex_setup.py` `JANS_BUILD` setting it to `"-SNAPSHOT"`
  sed -i -e "s/\"JANS_BUILD\": \"\"/\"JANS_BUILD\": \"-SNAPSHOT\"/g" ./flex-linux-setup/flex_linux_setup/flex_setup.py
  egrep -lRZ --include=version.py . | xargs -0 -l sed -i -e "s/__version__ = \"$SETUP_VERSION\"/__version__ = \"$NEXT_SETUP_VERSION\"/g"
}

modify_snapshot_helm_chart() {
  # Update chart `appVersion` `version` and image tags to the official prospected versions and tags.
  egrep -lRZ --include=Chart.yaml . | xargs -0 -l sed -i -e "s/appVersion: .*/appVersion: \"$NEXT_VERSION-dev\"/g"
  egrep -lRZ --include=Chart.yaml --exclude-dir=gluu-all-in-one . | xargs -0 -l sed -i -e "s/version: .*/version: $NEXT_HELM_RELEASE-dev/g" #This should be $NEXT_VERSION
  egrep -lRZ --include=Chart.yaml --exclude-dir=gluu-all-in-one . | xargs -0 -l sed -i -e "s/:1.*_dev/:$NEXT_JANS_VERSION_dev/g"
  egrep -lRZ --include=values.yaml --exclude-dir=gluu-all-in-one . | xargs -0 -l sed -i -e "s/:1.*_dev/: $NEXT_JANS_VERSION_dev/g"
  # Update chart `appVersion` `version` and image tags to the official prospected versions and tags.
  egrep -lRZ --include=Chart.yaml --exclude-dir=gluu . | xargs -0 -l sed -i -e "s/version: .*/version: $NEXT_JANS_VERSION/g"
  helm-docs ./charts --skip-version-footer
  egrep -lRZ --exclude=CONTRIBUTING.md --exclude-dir=workflows . | xargs -0 -l sed -i -e "s/$SETUP_VERSION/$NEXT_SETUP_VERSION-SNAPSHOT/g"
}

modify_snapshot_version_files() {
  echo "$NEXT_VERSION-dev" > docker-flex-monolith/version.txt
  echo "$NEXT_DOCKER_VERSION-dev" > docker-flex-all-in-one/version.txt
  echo "$NEXT_DOCKER_VERSION-dev" > docker-admin-ui/version.txt
  echo "__version__ = \"$NEXT_SETUP_VERSION\"" > flex-linux-setup/flex_linux_setup/version.py
  # bash json parse admin-ui/package.json file and replace version key
  jq '.version = $version' --arg version $NEXT_ADMIN_UI_VERSION ./admin-ui/package.json > tmp.$$.json && mv tmp.$$.json admin-ui/package.json

}
