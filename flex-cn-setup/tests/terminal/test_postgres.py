import pytest


@pytest.mark.parametrize("given, expected", [
    ("", "postgres"),  # default
    ("random", "random"),
])
def test_postgres_namespace(monkeypatch, settings, given, expected):
    from pygluu.kubernetes.terminal.postgres import PromptPostgres

    monkeypatch.setattr("click.prompt", lambda x, default: given or expected)
    settings.set("installer-settings.postgres.install", True)
    settings.set("installer-settings.postgres.namespace", "")

    prompt = PromptPostgres(settings)
    prompt.prompt_postgres()
    assert settings.get("installer-settings.postgres.namespace") == expected


def test_prompt_postgres_install(monkeypatch, settings):
    from pygluu.kubernetes.terminal.postgres import PromptPostgres

    monkeypatch.setattr("click.confirm", lambda x, default: True)
    settings.set("installer-settings.postgres.namespace", "postgres")
    settings.set("installer-settings.postgres.install", "")
    prompt = PromptPostgres(settings)
    prompt.prompt_postgres()

    assert settings.get("installer-settings.postgres.install") == True
