#!/bin/bash
VERSION=%VERSION%
sha256sum flex_%VERSION%~ubuntu24.04_amd64.deb > flex_%VERSION%~ubuntu24.04_amd64.deb.sha256sum
sed -i 's/~/./g' flex_%VERSION%~ubuntu24.04_amd64.deb.sha256sum
