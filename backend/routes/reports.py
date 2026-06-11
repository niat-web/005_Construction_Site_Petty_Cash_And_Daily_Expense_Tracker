from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from utils.auth_utils import admin_required, manager_required
from services.report_service import get_weekly_summary

reports_bp = Blueprint("reports", __name__)

@reports_bp.get("/weekly")
@jwt_required()
def get_weekly_summary_route():
    # If admin, they can query any site via site_id query param
    # If manager, they can only query their own site
    claims = get_jwt()
    role = claims.get('role')
    
    site_id_str = request.args.get('site_id')
    
    if role == 'manager':
        site_id = claims.get('site_id')
    else:
        if not site_id_str:
            return jsonify({"error": "site_id query parameter is required for admin"}), 400
        site_id = int(site_id_str)
        
    start_date = request.args.get('week_start')
    end_date = request.args.get('week_end')
    
    if not start_date or not end_date:
        return jsonify({"error": "week_start and week_end query parameters are required"}), 400
        
    try:
        summary = get_weekly_summary(site_id, start_date, end_date)
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
