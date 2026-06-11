from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from utils.decorators import admin_required, pm_required, supervisor_required
import services.sites_service as ss

sites_bp = Blueprint('sites', __name__)

@sites_bp.post('/')
@jwt_required()
@admin_required()
def create_site():
    data = request.get_json()
    if not data or not data.get('project_id') or not data.get('site_name') or not data.get('site_code'):
        return jsonify({"msg": "Missing project_id, site_name, or site_code"}), 400
    
    site = ss.create_site(data)
    return jsonify(site), 201

@sites_bp.get('/')
@jwt_required()
@pm_required()
def get_sites():
    claims = get_jwt()
    if claims.get('role') == 'admin':
        sites = ss.get_sites()
    else:
        # Project manager only gets sites for their project
        project_id = claims.get('project_id')
        sites = ss.get_sites_by_project(project_id)
        
    return jsonify(sites), 200

@sites_bp.get('/<int:id>')
@jwt_required()
@supervisor_required()
def get_site(id):
    claims = get_jwt()
    site = ss.get_site(id)
    if not site:
        return jsonify({"msg": "Site not found"}), 404
        
    role = claims.get('role')
    if role == 'project_manager' and site['project_id'] != claims.get('project_id'):
        return jsonify({"msg": "Unauthorized access to site"}), 403
    elif role == 'supervisor' and site['id'] != claims.get('site_id'):
        return jsonify({"msg": "Unauthorized access to site"}), 403
        
    return jsonify(site), 200

@sites_bp.put('/<int:id>')
@jwt_required()
@admin_required()
def update_site(id):
    data = request.get_json()
    site = ss.update_site(id, data)
    if not site:
        return jsonify({"msg": "Site not found"}), 404
    return jsonify(site), 200

@sites_bp.delete('/<int:id>')
@jwt_required()
@admin_required()
def delete_site(id):
    success = ss.delete_site(id)
    if not success:
        return jsonify({"msg": "Site not found"}), 404
    return jsonify({"msg": "Site deleted"}), 200