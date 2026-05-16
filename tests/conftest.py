"""
Shared pytest fixtures for all test layers.
"""

import os
import pytest

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")


@pytest.fixture
def base_url():
    return BASE_URL


@pytest.fixture
def api_headers():
    """Common headers for API requests"""
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
