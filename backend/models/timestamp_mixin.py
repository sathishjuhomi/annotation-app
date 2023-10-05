from sqlalchemy import Column, TIMESTAMP, text


class TimestampMixIn:
    t_create = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")
    )
    t_update = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("now()"),
        onupdate=text("now()"),
    )
    t_delete = Column(TIMESTAMP(timezone=True))
