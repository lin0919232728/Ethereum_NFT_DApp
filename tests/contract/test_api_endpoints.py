"""Layer 2 — Contract Test: API endpoints behave as documented"""

import os
import pytest
import requests

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")


def test_health_response_format():
    """Health response must match API_REFERENCE.md format"""
    r = requests.get(f"{BASE_URL}/health", timeout=10)
    data = r.json()
    assert "status" in data
    assert data["status"] in ("ok", "error")


def test_error_response_format():
    """Error responses must use standard format"""
    # Hit a non-existent endpoint to trigger 404
    r = requests.get(f"{BASE_URL}/api/does-not-exist", timeout=10)
    if r.status_code in (400, 404, 500):
        data = r.json()
        assert "status" in data
        assert data["status"] == "error"
        assert "message" in data


# 新增 API 端點時，在此追加對應 Contract 測試
