from jans_aio.hooks import hookimpl


class FlexPlugin:
    @hookimpl
    def add_supervisor_programs(self):
        return {"admin-ui": {"mem_ratio": 0}}

    @hookimpl
    def add_nginx_includes(self):
        return {"admin-ui": ["location"]}
