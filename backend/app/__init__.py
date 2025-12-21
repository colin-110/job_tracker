from flask import Flask, request
from app.extensions import db, jwt


def create_app():
    app = Flask(__name__)

    # ------------------------
    # Config
    # ------------------------
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///job_tracker.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "dev-secret-key"

    # ------------------------
    # CORS headers
    # ------------------------
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # ------------------------
    # Init extensions
    # ------------------------
    db.init_app(app)
    jwt.init_app(app)

    # ------------------------
    # JWT: allow OPTIONS globally
    # ------------------------
    @jwt.unauthorized_loader
    def unauthorized_callback(reason):
        if request.method == "OPTIONS":
            return "", 200
        return {"error": "Missing or invalid token"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        if request.method == "OPTIONS":
            return "", 200
        return {"error": "Invalid token"}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        if request.method == "OPTIONS":
            return "", 200
        return {"error": "Token expired"}, 401

    # ------------------------
    # Blueprints
    # ------------------------
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from app.routes.applications import applications_bp
    app.register_blueprint(applications_bp)

    # ------------------------
    # Health check
    # ------------------------
    @app.route("/")
    def home():
        return {"message": "Backend is running"}

    return app
