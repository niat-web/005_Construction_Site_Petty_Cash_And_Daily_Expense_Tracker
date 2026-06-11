from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from utils.auth_utils import admin_required, manager_required
from services.dashboard_service import get_dashboard

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("/site/<int:site_id>")
@jwt_required()
@admin_required()
def get_site_dashboard_admin(site_id):
    try:
        dashboard = get_dashboard(site_id)
        return jsonify(dashboard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@dashboard_bp.get("/my-site")
@jwt_required()
@manager_required()
def get_my_site_dashboard():
    claims = get_jwt()
    site_id = claims.get('site_id')
    try:
        dashboard = get_dashboard(site_id)
        return jsonify(dashboard), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
