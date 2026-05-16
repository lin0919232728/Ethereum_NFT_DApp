"""
{project_name} — Main Application
app{XX}.nextstepbu.com
"""

import os
from datetime import datetime, timezone, timedelta

from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth

from pg_client import execute_query

# === Constants ===
APP_NAME = "app{XX}"
APP_VERSION = open("../VERSION").read().strip()
TZ = timezone(timedelta(hours=8))
PORT = int(os.environ.get("PORT", 3000))

ALLOWED_EMAILS = os.environ.get("ALLOWED_EMAILS", "").split(",")

# === App Setup ===
app = Flask(__name__, template_folder="../templates", static_folder="../static")
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-me")
CORS(app)

# Nginx 反代必須加 ProxyFix
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

# === OAuth ===
oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


# === Health Check ===
@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "app": APP_NAME,
        "version": APP_VERSION,
        "timestamp": datetime.now(TZ).isoformat(),
    }), 200


# === Auth Routes ===
@app.route("/login")
def login():
    if "user" in session:
        return redirect(url_for("index"))
    from flask import render_template
    return render_template("login.html")


@app.route("/auth/google")
def auth_google():
    redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI")
    return google.authorize_redirect(redirect_uri)


@app.route("/auth/callback")
def auth_callback():
    try:
        token = google.authorize_access_token()
        user_info = token.get("userinfo")
        email = user_info.get("email", "")

        if ALLOWED_EMAILS and email not in ALLOWED_EMAILS:
            return jsonify({"status": "error", "message": "無權限"}), 403

        session["user"] = {
            "email": email,
            "name": user_info.get("name", ""),
        }
        return redirect(url_for("index"))

    except Exception as e:
        app.logger.error(f"auth_callback error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": "登入失敗"}), 500


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# === Main Routes ===
@app.route("/")
def index():
    if "user" not in session:
        return redirect(url_for("login"))
    from flask import render_template
    return render_template("index.html", user=session["user"])


# === API Routes ===
# 新增 API 路由到此處，或拆成 routes/ 目錄用 Blueprint

if __name__ == "__main__":
    debug = os.environ.get("DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=PORT, debug=debug)
