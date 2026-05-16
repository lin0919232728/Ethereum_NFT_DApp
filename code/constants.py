"""
Constants — Fixed values used across the application.
State names must match STATE_DEFINITIONS.md exactly.
"""


class TaskStatus:
    """Pipeline task status — 7 types, must match STATE_DEFINITIONS.md"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    COMPLETED_EMPTY = "completed_empty"
    FAILED = "failed"
    SKIPPED = "skipped"
    NOT_APPLICABLE = "not_applicable"

    ALL = [PENDING, RUNNING, COMPLETED, COMPLETED_EMPTY, FAILED, SKIPPED, NOT_APPLICABLE]
