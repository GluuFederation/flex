import os

from dateutil.parser import parse
from dockerfile_parse import DockerfileParser
from requests_html import HTMLSession
# This is a temp import until the dockerfile for the admin-ui starts using packages
import git


def should_update_build(last_build, new_build):
    def as_date(text):
        return parse(text, fuzzy_with_tokens=False)

    return as_date(new_build) > as_date(last_build)


def update_image(image, source_url_env, build_date_env):
    dfparser = DockerfileParser(f'../{image}')
    version = dfparser.labels["org.opencontainers.image.version"]
    try:
        base_url = os.path.dirname(dfparser.envs[source_url_env])
        pkg_url = os.path.basename(dfparser.envs[source_url_env])
    except KeyError:
        print(f'Docker image {image} does not contain any packages to update')
        return False
    session = HTMLSession()
    req = session.get(base_url)
    if not req.ok:
        return

    new_build = req.html.xpath(
        f"//a[contains(@href, '{pkg_url}')]/../following-sibling::td",
        first=True,
    ).text

    if should_update_build(dfparser.envs[build_date_env], new_build):
        print(f"Updating {image} {build_date_env} to {new_build}")
        # update Dockerfile in-place
        dfparser.envs[build_date_env] = new_build
    else:
        print(f"No updates found for {image} {build_date_env}")


# This is a temp function until the dockerfile for the admin-ui starts using packages
def update_git_commit():
    dfparser = DockerfileParser(f'docker-admin-ui')
    repo = git.Repo(".")
    commit = repo.head.commit
    dfparser.envs["ADMIN_UI_VERSION"] = str(commit)


def main():
    docker_image_folders = [name for name in os.listdir("../") if
                            os.path.isdir(os.path.join("../", name)) and "docker" in name]

    for image in docker_image_folders:
        try:
            update_image(image, "GLUU_SOURCE_URL", "GLUU_BUILD_DATE")
        except KeyError:
            print(f'Docker image {image} does not contain any packages to update')
            continue

    # This is a temp function until the dockerfile for the admin-ui starts using packages
    update_git_commit()


if __name__ == "__main__":
    main()
