from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Application
from datetime import datetime

applications_bp = Blueprint("applications", __name__)

@applications_bp.route("/applications", methods=["POST"])
@jwt_required()
def create_application():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    company = data.get("company")
    role = data.get("role")
    applied_date = data.get("applied_date")

    if not company or not role or not applied_date:
        return {"error": "Missing fields"}, 400

    application = Application(
        company=company,
        role=role,
        applied_date=datetime.strptime(applied_date, "%Y-%m-%d"),
        user_id=user_id
    )

    db.session.add(application)
    db.session.commit()

    return {"message": "Application created"}, 201

@applications_bp.route("/applications", methods=["GET"])
@jwt_required()
def get_applications():
    user_id = int(get_jwt_identity())

    applications = Application.query.filter_by(user_id=user_id).all()

    result = []
    for app in applications:
        result.append({
            "id": app.id,
            "company": app.company,
            "role": app.role,
            "status": app.status,
            "applied_date": app.applied_date.isoformat()
        })

    return jsonify(result)

@applications_bp.route("/applications/<int:app_id>", methods=["PUT"])
@jwt_required()
def update_application(app_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    application = Application.query.filter_by(
        id=app_id,
        user_id=user_id
    ).first()

    if not application:
        return {"error": "Application not found"}, 404

    if "status" in data:
        application.status = data["status"]

    db.session.commit()

    return {"message": "Application updated"}

@applications_bp.route("/applications/<int:app_id>", methods=["DELETE"])
@jwt_required()
def delete_application(app_id):
    user_id = int(get_jwt_identity())

    application = Application.query.filter_by(
        id=app_id,
        user_id=user_id
    ).first()

    if not application:
        return {"error": "Application not found"}, 404

    db.session.delete(application)
    db.session.commit()

    return {"message": "Application deleted"}
