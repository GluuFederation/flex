#!/bin/bash
VERSION=%VERSION%
sed -i "s/%VER%/$VERSION/g" debian/changelog
cd flex-src
tar cvfz ../flex_%VERSION%.tar.gz *
cp -a ../debian .
tar cvfz ../flex_%VERSION%.orig.tar.gz *
debuild -us -uc
cd ..
chmod a+w flex_%VERSION%~ubuntu22.04_amd64.deb
