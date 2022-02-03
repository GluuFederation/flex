import fnmatch
import os
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


def clean_keys(values_dict: {}) -> None:
    for key, value in values_dict.items():
        try:
            if value:
                continue
            del main_values_file_parser[key]
        except KeyError:
            logger.info("Key {} has been removed previously or does not exist".format(key))


main_dir = "./charts/janssen/"

# load original values.yaml
yaml = ruamel.yaml.YAML()
yaml.indent(mapping=4, sequence=4, offset=2)
yaml.preserve_quotes = True
main_values_file = Path(main_dir + "values.yaml").resolve()
with open(main_values_file, "r") as f:

    y = f.read()
    main_values_file_parser = yaml.load(y)

non_janssen_yaml = ruamel.yaml.YAML()
non_janssen_yaml.indent(mapping=4, sequence=4, offset=2)
non_janssen_yaml.preserve_quotes = True
# load keys to be cleaned from original values.yaml
with open (Path("./automation/janssen_helm_chart/non_janssen.yaml").resolve(), "r") as f:
    non_janssen = f.read()
    non_janssen_keys = non_janssen_yaml.load(non_janssen)
# generate janssen values yaml
clean_keys(main_values_file_parser)
clean_keys(main_values_file_parser["global"])
clean_keys(main_values_file_parser["global"]["istio"])
clean_keys(main_values_file_parser["config"])
clean_keys(main_values_file_parser["config"]["configmap"])
clean_keys(main_values_file_parser["nginx-ingress"]["ingress"])
yaml.dump(main_values_file_parser, main_values_file)

# load Chart.yaml and clean it from non janssen charts
chart_yaml = ruamel.yaml.YAML()
chart_yaml.indent(mapping=4, sequence=4, offset=2)
chart_yaml.preserve_quotes = True
main_chart_file = Path(main_dir + "Chart.yaml").resolve()
with open (main_chart_file, "r") as f:
    chart = f.read()
    chart_keys = chart_yaml.load(chart)

non_janssen_charts = ["jackrabbit", "admin-ui", "oxshibboleth", "oxpassport", "casa", "cn-istio-ingress"]
chart_dependencies = []
for chart in chart_keys["dependencies"]:
    if chart["name"] not in non_janssen_charts:
        chart_dependencies.append(chart)
chart_keys["dependencies"] = chart_dependencies
chart_keys["appVersion"] = "1.0.0"
chart_yaml.dump(chart_keys, main_chart_file)


def main():
    find_replace(main_dir, "support@gluu.org", "support@jans.io", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/oxd", "https://github.com/JanssenProject/jans/jans-client-api", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/gluu-server/reference/container-configs/",
                 "https://github.com/JanssenProject/jans/docker-jans-configurator", "*.*")
    find_replace(main_dir, "https://www.gluu.org", "https://jans.io", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/gluu-server", "https://jans.io", "*.*")
    find_replace(main_dir, "demoexample.gluu.org", "demoexample.jans.io", "*.*")
    find_replace(main_dir, "https://gluu.org/docs/gluu-server/favicon.ico",
                 "https://github.com/JanssenProject/jans/raw/main/docs/logo/janssen%20project%20favicon%20transparent%2050px%2050px.png",
                 "*.*")
    find_replace(main_dir, "Gluu", "Janssen", "*.*")
    find_replace(main_dir, "gluu", "janssen", "*.*")
    find_replace(main_dir, "5.0.0", "1.0.0", "*.*")
    find_replace(main_dir, "5.0.2", "1.0.0-beta.15", "*.*")


if __name__ == "__main__":
    main()
