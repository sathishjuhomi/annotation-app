"""added subscriptions table

Revision ID: 506cba3e908c
Revises: 094cbf8a77f3
Create Date: 2023-11-08 16:17:13.278890

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '506cba3e908c'
down_revision = '4e575c076fd6'
branch_labels = None
depends_on = None
table_name = "subscriptions"


def upgrade():
    # Create the 'subscriptions' table
    op.create_table(
        table_name,
        sa.Column('id', sa.dialects.postgresql.UUID(
            as_uuid=True), primary_key=True),
        sa.Column('user_id', sa.dialects.postgresql.UUID(
            as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('team_id', sa.dialects.postgresql.UUID(
            as_uuid=True), sa.ForeignKey('teams.id'), nullable=False),
        sa.Column('subscription_id', sa.String(), nullable=True),
        sa.Column('price_id', sa.String(), sa.ForeignKey(
            'plans.price_id'), nullable=True),
        sa.Column('payment_status', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean,
                  server_default='true', nullable=True),
        sa.Column('t_create', sa.TIMESTAMP(timezone=True),
                  nullable=False, server_default=sa.text("now()")),
        sa.Column('t_update', sa.TIMESTAMP(timezone=True), nullable=False,
                  server_default=sa.text("now()"), onupdate=sa.text("now()")),
        sa.Column('t_delete', sa.TIMESTAMP(timezone=True), nullable=True),
    )


def downgrade():
    # Drop the 'subscriptions' table
    op.drop_table('subscriptions')
