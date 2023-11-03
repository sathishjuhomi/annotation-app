"""updated plan table

Revision ID: 4e575c076fd6
Revises: e250641dc817
Create Date: 2023-11-01 10:12:37.879350
"""

from alembic import op
import sqlalchemy as sa

# Enum types for payment types and billing periods
payment_type_enum = sa.Enum('recurring', 'one_time', name='payment_type_enum')
billing_period_enum = sa.Enum(
    'month', 'year', 'week', 'day', name='billing_period_enum')

# revision identifiers, used by Alembic.
revision = '4e575c076fd6'
down_revision = 'e250641dc817'
branch_labels = None
depends_on = None
table_name = "plans"


def upgrade():
    op.create_table(
        table_name,
        sa.Column('id', sa.dialects.postgresql.UUID(
            as_uuid=True), primary_key=True),
        sa.Column('plan_name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('price_id', sa.String(), nullable=False),
        sa.Column('currency', sa.String(3), nullable=False),
        sa.Column('payment_mode', sa.String(),
                  nullable=False, server_default='card'),
        sa.Column('payment_type', payment_type_enum, nullable=False),
        sa.Column('billing_period', billing_period_enum, nullable=True),
        sa.Column('interval_count', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean,
                  nullable=False, server_default='true'),
        sa.Column("is_deleted", sa.Boolean,
                  nullable=False, server_default='false'),
        sa.Column("deleted_by_id", sa.dialects.postgresql.UUID(
            as_uuid=True), nullable=True),
        sa.Column('t_create', sa.TIMESTAMP(timezone=True),
                  nullable=False, server_default=sa.text("now()")),
        sa.Column('t_update', sa.TIMESTAMP(timezone=True), nullable=False,
                  server_default=sa.text("now()"), onupdate=sa.text("now()")),
        sa.Column('t_delete', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("price_id", name="price_id_key"),
    )


def downgrade():
    op.drop_table(table_name, schema=None)
    op.execute("DROP TYPE payment_type_enum")
    op.execute("DROP TYPE billing_period_enum")
