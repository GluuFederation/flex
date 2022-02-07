.DEFAULT_GOAL := develop

develop:
        /usr/bin/env python3 setup.py develop

install:
        pip3 install .

uninstall:
        pip3 uninstall flex-linux-setup -y

zipapp:
        shiv --compressed -o flex-linux-setup.pyz -p '/usr/bin/env python3' -e flex_linux_setup.flex_setup:main . --no-cache
