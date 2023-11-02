"""added customer table

Revision ID: 094cbf8a77f3
Revises: 4e575c076fd6
Create Date: 2023-11-01 11:20:15.681601
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '094cbf8a77f3'
down_revision = '4e575c076fd6'
branch_labels = None
depends_on = None
table_name = "customers"


def upgrade():
    op.create_table(
        table_name,
        sa.Column('id', sa.dialects.postgresql.UUID(
            as_uuid=True), primary_key=True),
        sa.Column('user_id', sa.dialects.postgresql.UUID(
            as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('customer_id', sa.String(), nullable=False),
        sa.Column('customer_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('address', sa.JSON, nullable=False),
        sa.Column('payment_status', sa.String(), nullable=False),
        sa.Column('price_id', sa.String(), sa.ForeignKey(
            'plans.price_id'), nullable=True),
        sa.Column('subscription_id', sa.String(), nullable=True),
        sa.Column('invoice_id', sa.String(), nullable=True),
        sa.Column("is_active", sa.Boolean,
                  nullable=False, server_default='false'),
        sa.Column("is_deleted", sa.Boolean,
                  nullable=False, server_default='false'),
        sa.Column("deleted_by_id", sa.dialects.postgresql.UUID(
            as_uuid=True), nullable=True),
        sa.Column('t_create', sa.TIMESTAMP(timezone=True),
                  nullable=False, server_default=sa.text("now()")),
        sa.Column('t_update', sa.TIMESTAMP(timezone=True), nullable=False,
                  server_default=sa.text("now()"), onupdate=sa.text("now()")),
        sa.Column('t_delete', sa.TIMESTAMP(timezone=True), nullable=True)
    )


def downgrade():
    op.drop_table(table_name, schema=None)
