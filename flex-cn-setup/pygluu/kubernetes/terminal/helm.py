"""
pygluu.kubernetes.terminal.helm
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains helpers to interact with user's inputs for helm terminal prompts.

License terms and conditions for Gluu Cloud Native Edition:
https://www.apache.org/licenses/LICENSE-2.0
"""
import click


class PromptHelm:

    def __init__(self, settings):
        self.settings = settings

    def prompt_helm(self):
        """Prompts for helm installation and returns updated settings.

        :return:
        """
        if self.settings.get("installer-settings.releaseName") in ("None", ''):
            self.settings.set("installer-settings.releaseName",
                              click.prompt("Please enter Gluu helm name", default="gluu"))

        if self.settings.get("installer-settings.nginxIngress.releaseName") in (None, '') and \
                self.settings.get("installer-settings.aws.lbType") != "alb":
            self.settings.set("installer-settings.nginxIngress.releaseName",
                              click.prompt("Please enter nginx-ingress helm name",
                                           default="ningress"))

        if self.settings.get("installer-settings.nginxIngress.namespace") in (None, '') and self.settings.get(
                "installer-settings.aws.lbType") != "alb":
            self.settings.set("installer-settings.nginxIngress.namespace",
                              click.prompt("Please enter nginx-ingress helm namespace",
                                           default="ingress-nginx"))
