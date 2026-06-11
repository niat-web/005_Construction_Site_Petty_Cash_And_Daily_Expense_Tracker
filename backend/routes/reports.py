from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from utils.decorators import admin_required, pm_required, supervisor_required
import services.report_service as rs
from database.models import Site

reports_bp = Blueprint('reports', __name__)

@reports_bp.get('/weekly')
@jwt_required()
@supervisor_required()
def get_weekly_report():
    claims = get_jwt()
    role = claims.get('role')
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    site_id = request.args.get('site_id', type=int)
    
    if not start_date or not end_date:
        return jsonify({"msg": "start_date and end_date are required (YYYY-MM-DD)"}), 400

    site_ids = None

    if role == 'admin':
        if site_id:
            site_ids = [site_id]
        else:
            site_ids = None # Get all sites
    elif role == 'project_manager':
        project_id = claims.get('project_id')
        sites = Site.query.filter_by(project_id=project_id).all()
        pm_site_ids = [s.id for s in sites]
        
        if site_id:
            if site_id not in pm_site_ids:
                return jsonify({"msg": "Unauthorized"}), 403
            site_ids = [site_id]
        else:
            site_ids = pm_site_ids
    else: # supervisor
        my_site_id = claims.get('site_id')
        site_ids = [my_site_id]
        
    data = rs.get_weekly_summary(site_ids, start_date, end_date)
    return jsonify(data), 200
