#!/bin/bash
set -euo pipefail
# The below variable represents the top level directory of the repository
MAIN_DIRECTORY_LOCATION=$1
echo "Generate properties and feature flag documents from elements annotated with @DocFeatureFlag and @DocProperty"

# Compile jans-core to pick-up any changes in annotation processors


# Compile modules where classes that use these annotations exist.
# This will generate markdown files under target/classes directory
mvn -q -f "$MAIN_DIRECTORY_LOCATION"/casa/pom.xml clean compile

# Move markdown files to appropriate locations under documentation root 'doc'
# Sample commands to move generated files are given below. Properties files and feature flag doc files
# will be generated automatically when annotations are added to respective modules. Use commands like
# samples below to place files in appropriate documentation site directory.

#mv -f casa/config/target/classes/casaconfig-properties.md reference/json-config/properties
#mv -f casa/app/target/classes/casa-properties.md reference/json-config/properties
