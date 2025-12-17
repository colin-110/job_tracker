from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "User already exists"}, 400

    hashed_password = generate_password_hash(password)

    user = User(email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return {"message": "User created successfully"}, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return {"error": "Invalid email or password"}, 401

    access_token = create_access_token(identity=str(user.id))

    return {
        "message": "Login successful",
        "access_token": access_token
    }, 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    return {"user_id": user_id}
