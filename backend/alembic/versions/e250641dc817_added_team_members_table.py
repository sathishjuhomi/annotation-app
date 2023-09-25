"""added team_members table

Revision ID: e250641dc817
Revises: b940f5448880
Create Date: 2023-09-25 16:06:17.406273

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e250641dc817'
down_revision = 'b940f5448880'
branch_labels = None
depends_on = None
table_name = "team_members"


def upgrade():
    op.create_table(table_name,
                    sa.Column('id', sa.dialects.postgresql.UUID(
                        as_uuid=True),
                        primary_key=True),
                    sa.Column('team_id', sa.dialects.postgresql.UUID(as_uuid=True),
                              sa.ForeignKey('teams.id', ondelete='CASCADE'),
                              nullable=False),
                    sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True),
                              sa.ForeignKey('users.id', ondelete='CASCADE'),
                              nullable=False),
                    sa.Column('invited_by_id', sa.dialects.postgresql.UUID(as_uuid=True),
                              sa.ForeignKey('users.id', ondelete='CASCADE'),
                              nullable=True),
                    sa.Column('roles', sa.JSON, nullable=False),
                    sa.Column('t_create', sa.TIMESTAMP(timezone=True),
                              nullable=False,
                              server_default=sa.text("now()")),
                    sa.Column('t_update', sa.TIMESTAMP(timezone=True),
                              nullable=False,
                              server_default=sa.text("now()"),
                              onupdate=sa.text("now()")),
                    sa.Column('t_delete', sa.TIMESTAMP(
                        timezone=True), nullable=True)
                    )


def downgrade():
    op.drop_table(table_name, schema=None)
