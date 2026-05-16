FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY pyproject.toml ./
RUN pip install uv && uv pip install --system -r pyproject.toml 2>/dev/null || \
    pip install flask flask-cors authlib psycopg2-binary werkzeug requests

# Copy application
COPY code/ ./code/
COPY templates/ ./templates/
COPY static/ ./static/
COPY VERSION ./

EXPOSE 3000

CMD ["python", "code/app.py"]
