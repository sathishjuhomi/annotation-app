"""added teams table

Revision ID: b940f5448880
Revises: 2dd458174473
Create Date: 2023-09-22 11:25:55.879104

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b940f5448880'
down_revision = '2dd458174473'
branch_labels = None
depends_on = None
table_name = "teams"


def upgrade():
    op.create_table(
        table_name,
        sa.Column("id", sa.dialects.postgresql.UUID(
            as_uuid=True), nullable=False),
        sa.Column("team_name", sa.String(), nullable=False),
        sa.Column(
            "created_by_id",
            sa.dialects.postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=True,
        ),
        sa.Column(
            "t_create",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "t_update",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
            onupdate=sa.text("now()"),
        ),
        sa.Column("t_delete", sa.TIMESTAMP(timezone=True)),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("team_name", name="team_name_key"),
    )


def downgrade():
    op.drop_table(table_name, schema=None)
