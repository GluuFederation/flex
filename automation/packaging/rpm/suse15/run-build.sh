#!/bin/bash

VERSION=$(echo "%VERSION%" | awk -F '-' {'print $1'})
REL=$(echo "%VERSION%" | sed "s/^${VERSION}//g" | sed "s/^-//g")
current_dir=$PWD
sed -i "s/%VER%/$VERSION/g" flex.spec
if [ -z "$REL" ]; then
        RELEASE="suse15"
else
        RELEASE="$REL.suse15"
fi
sed -i "s/%RELEASE%/$RELEASE/g" flex.spec
rpmbuild_path="$current_dir/rpmbuild"
mkdir -p "$rpmbuild_path"/{BUILD,BUILDROOT,RPMS,SOURCES,SPECS,SRPMS}
specfile=flex.spec
cp "$current_dir"/$specfile "$rpmbuild_path"/SPECS/.
mv flex-src flex-"$VERSION"
tar cvfz flex-"$VERSION".tar.gz flex-"$VERSION"
cp flex-"$VERSION".tar.gz "$rpmbuild_path"/SOURCES/.
rm -rf rpmbuild/RPMS/x86_64/*
rpmbuild -bb --define "_topdir $rpmbuild_path" "$rpmbuild_path"/SPECS/$specfile
chmod a+w rpmbuild/RPMS/x86_64/flex-"$VERSION"-"$RELEASE".x86_64.rpm
chmod a+w rpmbuild/RPMS/x86_64
