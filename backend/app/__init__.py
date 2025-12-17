from flask import Flask
from app.extensions import db

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///job_tracker.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def home():
        return {"message": "Backend with DB is running"}

    return app

from flask import Flask
from app.extensions import db, jwt

def create_app():
    app = Flask(__name__)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response


    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///job_tracker.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "dev-secret-key"

    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    from app.routes.applications import applications_bp
    app.register_blueprint(applications_bp)


    @app.route("/")
    def home():
        return {"message": "Backend with JWT is running"}

    return app
