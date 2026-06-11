from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from utils.decorators import admin_required, pm_required, supervisor_required
import services.issuances_service as is_svc
from database.models import User, Site

issuances_bp = Blueprint('issuances', __name__)

@issuances_bp.post('/')
@jwt_required()
@admin_required()
def create_issuance():
    data = request.get_json()
    if not data or not data.get('site_id') or not data.get('amount'):
        return jsonify({"msg": "Missing site_id or amount"}), 400
    
    # Get the user ID of the admin issuing the cash
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    
    issuance = is_svc.issue_cash(data, issued_by=user.id if user else None)
    return jsonify(issuance), 201

@issuances_bp.get('/')
@jwt_required()
@supervisor_required()
def get_issuances():
    claims = get_jwt()
    role = claims.get('role')
    
    site_id = request.args.get('site_id', type=int)
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')

    if role == 'admin':
        issuances = is_svc.get_issuances(site_id=site_id, from_date=from_date, to_date=to_date)
    elif role == 'project_manager':
        project_id = claims.get('project_id')
        sites = Site.query.filter_by(project_id=project_id).all()
        site_ids = [s.id for s in sites]
        
        # If PM specifically requests a site, verify it belongs to their project
        if site_id:
            if site_id not in site_ids:
                return jsonify({"msg": "Unauthorized to view this site's issuances"}), 403
            issuances = is_svc.get_issuances(site_id=site_id, from_date=from_date, to_date=to_date)
        else:
            issuances = is_svc.get_issuances(site_ids=site_ids, from_date=from_date, to_date=to_date)
    else: # supervisor
        my_site_id = claims.get('site_id')
        issuances = is_svc.get_issuances(site_id=my_site_id, from_date=from_date, to_date=to_date)
        
    return jsonify(issuances), 200

@issuances_bp.get('/<int:id>')
@jwt_required()
@supervisor_required()
def get_issuance(id):
    issuance = is_svc.get_issuance(id)
    if not issuance:
        return jsonify({"msg": "Issuance not found"}), 404
        
    claims = get_jwt()
    role = claims.get('role')
    
    if role == 'supervisor':
        if issuance['site_id'] != claims.get('site_id'):
            return jsonify({"msg": "Unauthorized"}), 403
    elif role == 'project_manager':
        project_id = claims.get('project_id')
        site = Site.query.get(issuance['site_id'])
        if not site or site.project_id != project_id:
            return jsonify({"msg": "Unauthorized"}), 403
            
    return jsonify(issuance), 200

@issuances_bp.put('/<int:id>')
@jwt_required()
@admin_required()
def update_issuance(id):
    data = request.get_json()
    issuance = is_svc.update_issuance(id, data)
    if not issuance:
        return jsonify({"msg": "Issuance not found"}), 404
    return jsonify(issuance), 200

@issuances_bp.delete('/<int:id>')
@jwt_required()
@admin_required()
def delete_issuance(id):
    success = is_svc.delete_issuance(id)
    if not success:
        return jsonify({"msg": "Issuance not found"}), 404
    return jsonify({"msg": "Issuance deleted"}), 200