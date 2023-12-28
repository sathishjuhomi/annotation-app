"""added projects table

Revision ID: ca267d5341ca
Revises: 506cba3e908c
Create Date: 2023-12-26 15:16:04.885884

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ca267d5341ca'
down_revision = '506cba3e908c'
branch_labels = None
depends_on = None
table_name = "projects"


def upgrade():
    op.create_table(
        table_name,
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('project_name', sa.String(), nullable=False),
        sa.Column('project_type', sa.Enum('object detection', 'classification', 'instance segmentation', name='project_type_enum')),
        sa.Column('label', sa.ARRAY(sa.String()), nullable=True),
        sa.Column('team_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('teams.id'), nullable=False),
        sa.Column('created_by_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('updated_by_id', sa.dialects.postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('t_create', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column('t_update', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()"), onupdate=sa.text("now()")),
        sa.Column('t_delete', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.UniqueConstraint('project_name', name='project_name_key')
    )


def downgrade():
    op.drop_table('projects')
