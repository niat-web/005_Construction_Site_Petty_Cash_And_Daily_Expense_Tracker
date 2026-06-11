from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from utils.decorators import admin_required, pm_required, supervisor_required
import services.dashboard_service as ds

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.get('/admin')
@jwt_required()
@admin_required()
def get_admin_dash():
    data = ds.get_admin_dashboard()
    return jsonify(data), 200

@dashboard_bp.get('/project')
@jwt_required()
@pm_required()
def get_pm_dash():
    claims = get_jwt()
    # If admin calls this, they need to provide a project ID? 
    # Or maybe it's strictly for PMs for their assigned project.
    if claims.get('role') == 'admin':
        return jsonify({"msg": "Admin should use /admin dashboard or provide project_id (not implemented)"}), 400
        
    project_id = claims.get('project_id')
    data = ds.get_pm_dashboard(project_id)
    if not data:
        return jsonify({"msg": "Project not found"}), 404
    return jsonify(data), 200

@dashboard_bp.get('/site')
@jwt_required()
@supervisor_required()
def get_supervisor_dash():
    claims = get_jwt()
    if claims.get('role') != 'supervisor':
        return jsonify({"msg": "Please use specific role dashboards"}), 400
        
    site_id = claims.get('site_id')
    data = ds.get_supervisor_dashboard(site_id)
    if not data:
        return jsonify({"msg": "Site not found"}), 404
    return jsonify(data), 200
