"""Layer 1 — Smoke Test: APP is alive"""

import os
import pytest
import requests

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")


def test_health_ok():
    """Health endpoint returns status ok"""
    r = requests.get(f"{BASE_URL}/health", timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert "app" in data
    assert "version" in data
