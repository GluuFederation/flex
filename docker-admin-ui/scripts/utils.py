from datetime import datetime
from datetime import UTC


def utcnow():
    return datetime.now(UTC)


def generalized_time_utc(dtime=None):
    """Calculate LDAP generalized time."""
    if not dtime:
        dtime = utcnow()
    return dtime.strftime("%Y%m%d%H%M%SZ")
