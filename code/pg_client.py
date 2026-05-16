"""
PostgreSQL client — connection pool + query helpers.
All DB operations must go through this module.

IMPORTANT: connect_timeout=5 is mandatory.
Without it, psycopg2.connect() blocks indefinitely on TCP stall while
holding ThreadedConnectionPool._lock, freezing ALL pool operations and
causing the entire Flask app to hang (see INC-017 / DL-015).
"""

import os
import psycopg2
import psycopg2.pool
from contextlib import contextmanager
from psycopg2.extras import RealDictCursor

_pool = None


def get_pool():
    global _pool
    if _pool is None:
        _pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=os.environ.get("DATABASE_URL"),
            connect_timeout=5,        # prevents TCP stall from freezing the pool
            keepalives=1,
            keepalives_idle=30,
            keepalives_interval=10,
            keepalives_count=3,
        )
    return _pool


@contextmanager
def get_db():
    """Borrow a connection from the pool; auto-return on exit."""
    pool = get_pool()
    conn = pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        try:
            conn.rollback()
        except Exception:
            pass
        raise
    finally:
        broken = getattr(conn, "closed", False)
        pool.putconn(conn, close=bool(broken))


def execute_query(sql: str, params=None) -> list:
    """Execute a SELECT or DML query. Returns list of dicts."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params)
            if cur.description:
                return [dict(row) for row in cur.fetchall()]
            return []


def execute_many(sql: str, params_list: list) -> None:
    """Execute a DML query with multiple parameter sets."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.executemany(sql, params_list)
