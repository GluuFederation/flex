import codecs
import os
import re
from setuptools import setup
from setuptools import find_packages


def find_version(*file_paths):
    here = os.path.abspath(os.path.dirname(__file__))
    with codecs.open(os.path.join(here, *file_paths), 'r') as f:
        version_file = f.read()
    version_match = re.search(r"^__version__ = ['\"]([^'\"]*)['\"]",
                              version_file, re.M)
    if version_match:
        return version_match.group(1)
    raise RuntimeError("Unable to find version string.")


setup(
    name="flex-linux-setup",
    version=find_version("flex_linux_setup/__init__.py"),
    url="",
    license="Apache",
    author="Janssen",
    author_email="",
    description="",
    long_description=__doc__,
    zip_safe=False,
    install_requires=['jans-setup @ git+https://github.com/JanssenProject/jans.git@main#egg=jans-setup&subdirectory=jans-linux-setup'],
    classifiers=[
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.6+",
    ],
    include_package_data=True,
    packages=['flex_linux_setup'],
    entry_points={
        "console_scripts": ["flex-linux-setup=flex_linux_setup.flex_setup:main"],
    },
)
