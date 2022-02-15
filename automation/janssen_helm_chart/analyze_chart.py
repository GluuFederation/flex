import fnmatch
import os
import json
from pathlib import Path

from helpers import get_logger
import ruamel.yaml

logger = get_logger("cn-analyze-chart   ")


def find_replace(directory, find, replace, filepatterm):
    for path, _dirs, files in os.walk(os.path.abspath(directory)):
        for filename in fnmatch.filter(files, filepatterm):
            filepath = os.path.join(path, filename)
            with open(filepath) as f:
                s = f.read()
            s = s.replace(find, replace)
            with open(filepath, "w") as f:
                f.write(s)


# TODO: THIS FUNCTION NEEDS TO BE CLEANED AND SHOULD DEDUCE KEYS RECURSIVELY
def clean_keys(values_dict: {}, parent_key="", second_parent_key="") -> None:
    for key, value in values_dict.items():
        try:
            if value == "None":
                if second_parent_key:
                    del main_values_file_parser[parent_key][second_parent_key][key]
                elif parent_key:
                    del main_values_file_parser[parent_key][key]
                else:
                    del main_values_file_parser[key]
                logger.info(f"Removed {key}")
        except KeyError:
            logger.info("Key {} has been removed previously or does not exist".format(key))


main_dir = "./charts/janssen/"

# load original values.yaml
yaml = ruamel.yaml.YAML()
yaml.indent(mapping=2, sequence=4, offset=2)
yaml.preserve_quotes = True
main_values_file = Path(main_dir + "values.yaml").resolve()
with open(main_values_file, "r") as f:
    y = f.read()
    main_values_file_parser = yaml.load(y)

non_janssen_yaml = ruamel.yaml.YAML()
non_janssen_yaml.indent(mapping=4, sequence=4, offset=2)
non_janssen_yaml.preserve_quotes = True
# load keys to be cleaned from original values.yaml
with open(Path("./automation/janssen_helm_chart/non_janssen.yaml").resolve(), "r") as f:
    non_janssen = f.read()
    non_janssen_keys = non_janssen_yaml.load(non_janssen)
# generate janssen values yaml
clean_keys(non_janssen_keys)
clean_keys(non_janssen_keys["global"], parent_key="global")
clean_keys(non_janssen_keys["global"]["istio"], parent_key="global", second_parent_key="istio")
clean_keys(non_janssen_keys["config"], parent_key="config")
clean_keys(non_janssen_keys["nginx-ingress"]["ingress"], parent_key="nginx-ingress", second_parent_key="ingress")
yaml.dump(main_values_file_parser, main_values_file)

# load Chart.yaml and clean it from non janssen charts
chart_yaml = ruamel.yaml.YAML()
chart_yaml.indent(mapping=4, sequence=4, offset=2)
chart_yaml.preserve_quotes = True
main_chart_file = Path(main_dir + "Chart.yaml").resolve()
with open(main_chart_file, "r") as f:
    chart = f.read()
    chart_keys = chart_yaml.load(chart)

non_janssen_charts = ["admin-ui", "oxshibboleth", "oxpassport", "casa", "cn-istio-ingress"]
chart_dependencies = []
for chart in chart_keys["dependencies"]:
    if chart["name"] not in non_janssen_charts:
        chart_dependencies.append(chart)
chart_keys["dependencies"] = chart_dependencies
chart_keys["appVersion"] = "1.0.0"
chart_yaml.dump(chart_keys, main_chart_file)

# remove keys from values.schema.json
main_values_schema_file = Path(main_dir + "values.schema.json").resolve()
with open(main_values_schema_file, "r") as f:
    values_schema = json.load(f)
# admin-ui
del values_schema["properties"]["admin-ui"]
del values_schema["definitions"]["admin-ui-enabled"]
# Casa
del values_schema["properties"]["casa"]
del values_schema["definitions"]["casa-enabled"]
# oxpassport
del values_schema["properties"]["oxpassport"]
del values_schema["definitions"]["oxpassport-enabled"]
# oxshibboleth
del values_schema["properties"]["oxshibboleth"]
del values_schema["definitions"]["oxshibboleth-enabled"]
# misc global options
for k, v in non_janssen_keys["global"].items():
    if k == "istio":
        del values_schema["properties"]["global"]["properties"]["istio"]["properties"]["ingress"]
        continue
    try:
        del values_schema["properties"]["global"]["properties"][k]
        logger.info(f"Removed {k}")
    except KeyError:
        logger.info("Key {} has been removed previously or does not exist".format(k))

del values_schema["allOf"][values_schema["allOf"].index({'$ref': '#/definitions/oxshibboleth-enabled'})]
del values_schema["allOf"][values_schema["allOf"].index({'$ref': '#/definitions/oxpassport-enabled'})]
del values_schema["allOf"][values_schema["allOf"].index({'$ref': '#/definitions/admin-ui-enabled'})]
del values_schema["allOf"][values_schema["allOf"].index({'$ref': '#/definitions/casa-enabled'})]

for k, v in non_janssen_keys["nginx-ingress"]["ingress"].items():
    try:
        del values_schema["properties"]["nginx-ingress"]["properties"]["ingress"]["properties"][k]
        logger.info(f"Removed {k}")
    except KeyError:
        logger.info("Key {} has been removed previously or does not exist".format(k))
    try:
        del values_schema["definitions"]["nginx-ingress-enabled"]["then"]["properties"]["nginx-ingress"]["properties"]["ingress"]["properties"][k]
        logger.info(f"Removed {k}")
    except KeyError:
        logger.info("Key {} has been removed previously or does not exist".format(k))


with open(main_values_schema_file, 'w+') as file:
    json.dump(values_schema, file, indent=2)


def main():
    find_replace(main_dir, "support@gluu.org", "support@jans.io", "*.*")
    find_replace(main_dir, "https://github.com/GluuFederation/flex/flex-cn-setup",
                 "https://github.com/JanssenProject/jans/charts/janssen", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/oxd", "https://github.com/JanssenProject/jans/jans-client-api", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/gluu-server/reference/container-configs/",
                 "/docker-jans-configurator", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/gluu-server/favicon.ico",
                 "https://github.com/JanssenProject/jans/raw/main/docs/logo/janssen_project_favicon_transparent_50px_50px.png",
                 "*.*")
    find_replace(main_dir, "https://gluu.org/docs/gluu-server", "https://jans.io", "*.*")
    find_replace(main_dir, "demoexample.gluu.org", "demoexample.jans.io", "*.*")
    find_replace(main_dir, "https://www.gluu.org", "https://jans.io", "*.*")
    find_replace(main_dir, "Gluu", "Janssen", "*.*")
    find_replace(main_dir, "gluu", "janssen", "*.*")
    find_replace(main_dir, "5.0.0", "1.0.0", "*.*")
    find_replace(main_dir, "5.0.2", "1.0.0-beta.14", "*.*")
    find_replace(main_dir, "janssenfederation/opendj:1.0.0", "gluufederation/opendj:5.0.0", "*.*")


if __name__ == "__main__":
    main()
