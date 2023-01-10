#!/bin/bash
set -euo pipefail

echo "Generate properties and feature flag documents from elements annotated with @DocFeatureFlag and @DocProperty"

# Compile jans-core to pick-up any changes in annotation processors


# Compile modules where classes that use these annotations exist.
# This will generate markdown files under target/classes directory


# Move markdown files to appropriate locations under documentation root 'doc'

