from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from utils.auth_utils import admin_required, manager_required
from services.sites_service import (
    create_site, get_sites, get_site, update_site, delete_site
)

sites_bp = Blueprint("sites", __name__)

@sites_bp.get("/")
@jwt_required()
@admin_required()
def get_all_sites_route():
    sites = get_sites()
    return jsonify([
        {
            "id": s.id,
            "project_name": s.project_name,
            "site_code": s.site_code,
            "pm_name": s.pm_name,
            "monthly_budget": s.monthly_budget
        } for s in sites
    ]), 200

@sites_bp.get("/<int:id>")
@jwt_required()
@admin_required()
def get_site_route(id):
    site = get_site(id)
    if not site:
        return jsonify({"error": "Site not found"}), 404
    return jsonify({
        "id": site.id,
        "project_name": site.project_name,
        "site_code": site.site_code,
        "pm_name": site.pm_name,
        "monthly_budget": site.monthly_budget
    }), 200

@sites_bp.post("/")
@jwt_required()
@admin_required()
def add_site_route():
    data = request.json
    if not data or not all(k in data for k in ("project_name", "site_code", "pm_name", "monthly_budget")):
        return jsonify({"error": "Missing required fields"}), 400
    
    site = create_site(data)
    return jsonify({
        "id": site.id,
        "project_name": site.project_name,
        "site_code": site.site_code,
        "pm_name": site.pm_name,
        "monthly_budget": site.monthly_budget
    }), 201

@sites_bp.put("/<int:id>")
@jwt_required()
@admin_required()
def edit_site_route(id):
    data = request.json
    site = update_site(id, data)
    if not site:
        return jsonify({"error": "Site not found"}), 404
    return jsonify({
        "message": "Site updated successfully",
        "site": {
            "id": site.id,
            "project_name": site.project_name,
            "site_code": site.site_code,
            "pm_name": site.pm_name,
            "monthly_budget": site.monthly_budget
        }
    }), 200

@sites_bp.delete("/<int:id>")
@jwt_required()
@admin_required()
def delete_site_route(id):
    success = delete_site(id)
    if not success:
        return jsonify({"error": "Site not found"}), 404
    return jsonify({"message": "Site deleted successfully"}), 200


@sites_bp.get("/my-site")
@jwt_required()
@manager_required()
def get_my_site_route():
    claims = get_jwt()
    site_id = claims.get('site_id')
    site = get_site(site_id)
    if not site:
        return jsonify({"error": "Site not found"}), 404
        
    return jsonify({
        "id": site.id,
        "project_name": site.project_name,
        "site_code": site.site_code,
        "pm_name": site.pm_name,
        "monthly_budget": site.monthly_budget
    }), 200