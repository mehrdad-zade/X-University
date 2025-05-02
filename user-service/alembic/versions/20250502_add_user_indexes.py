"""add user indexes

Revision ID: add_user_indexes
Revises: 0001_initial
Create Date: 2025-05-02 12:34:56.789012
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_user_indexes'
down_revision = '0001_initial'
branch_labels = None
depends_on = None

def upgrade():
    op.create_index("ix_users_email",    "users", ["email"])
    op.create_index("ix_users_role",     "users", ["role"])
    op.create_index("ix_users_language", "users", ["language"])

def downgrade():
    op.drop_index("ix_users_language", table_name="users")
    op.drop_index("ix_users_role",     table_name="users")
    op.drop_index("ix_users_email",    table_name="users")
