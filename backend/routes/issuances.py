from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from utils.auth_utils import admin_required, manager_required
from services.issuances_service import (
    issue_cash, get_issuances, get_issuance, update_issuance, delete_issuance
)

issuances_bp = Blueprint("issuances", __name__)

@issuances_bp.post("/")
@jwt_required()
@admin_required()
def add_issuance_route():
    data = request.json
    if not data or not all(k in data for k in ("site_id", "supervisor_name", "amount")):
        return jsonify({"error": "Missing required fields"}), 400
    
    issuance = issue_cash(data)
    return jsonify({
        "id": issuance.id,
        "site_id": issuance.site_id,
        "supervisor_name": issuance.supervisor_name,
        "amount": issuance.amount,
        "issue_date": issuance.issue_date.strftime("%Y-%m-%d")
    }), 201

@issuances_bp.get("/")
@jwt_required()
@admin_required()
def get_all_issuances_route():
    site_id = request.args.get('site_id')
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')
    
    issuances = get_issuances(site_id=site_id, from_date=from_date, to_date=to_date)
    return jsonify([
        {
            "id": i.id,
            "site_id": i.site_id,
            "supervisor_name": i.supervisor_name,
            "amount": i.amount,
            "issue_date": i.issue_date.strftime("%Y-%m-%d")
        } for i in issuances
    ]), 200


@issuances_bp.get("/my-site")
@jwt_required()
@manager_required()
def get_my_site_issuances_route():
    claims = get_jwt()
    site_id = claims.get('site_id')
    issuances = get_issuances(site_id=site_id)
    return jsonify([
        {
            "id": i.id,
            "site_id": i.site_id,
            "supervisor_name": i.supervisor_name,
            "amount": i.amount,
            "issue_date": i.issue_date.strftime("%Y-%m-%d")
        } for i in issuances
    ]), 200

# Keep standard updates restricted to admin or maybe disabled entirely? Specs don't restrict update explicitly for admin, let's make it admin only
@issuances_bp.get("/<int:id>")
@jwt_required()
@admin_required()
def get_issuance_route(id):
    issuance = get_issuance(id)
    if not issuance:
        return jsonify({"error": "Issuance not found"}), 404
    return jsonify({
        "id": issuance.id,
        "site_id": issuance.site_id,
        "supervisor_name": issuance.supervisor_name,
        "amount": issuance.amount,
        "issue_date": issuance.issue_date.strftime("%Y-%m-%d")
    }), 200

@issuances_bp.put("/<int:id>")
@jwt_required()
@admin_required()
def edit_issuance_route(id):
    data = request.json
    issuance = update_issuance(id, data)
    if not issuance:
        return jsonify({"error": "Issuance not found"}), 404
    return jsonify({
        "message": "Issuance updated successfully",
        "issuance": {
            "id": issuance.id,
            "site_id": issuance.site_id,
            "supervisor_name": issuance.supervisor_name,
            "amount": issuance.amount,
            "issue_date": issuance.issue_date.strftime("%Y-%m-%d")
        }
    }), 200

@issuances_bp.delete("/<int:id>")
@jwt_required()
@admin_required()
def delete_issuance_route(id):
    success = delete_issuance(id)
    if not success:
        return jsonify({"error": "Issuance not found"}), 404
    return jsonify({"message": "Issuance deleted successfully"}), 200