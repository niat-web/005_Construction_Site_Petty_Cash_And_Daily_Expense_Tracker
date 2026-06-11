from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from utils.decorators import admin_required, pm_required, supervisor_required
import services.expenses_service as es
from database.models import User, Site, CashIssuance

expenses_bp = Blueprint('expenses', __name__)

@expenses_bp.post('/')
@jwt_required()
@supervisor_required()
def create_expense():
    claims = get_jwt()
    role = claims.get('role')
    
    # Only supervisors can create expenses
    if role != 'supervisor':
        return jsonify({"msg": "Only supervisors can create expenses"}), 403
        
    data = request.get_json()
    if not data or not data.get('cash_issuance_id') or not data.get('amount') or not data.get('category'):
        return jsonify({"msg": "Missing required fields"}), 400
        
    # Validate the issuance belongs to the supervisor's site
    issuance = CashIssuance.query.get(data.get('cash_issuance_id'))
    if not issuance:
        return jsonify({"msg": "Issuance not found"}), 404
        
    if issuance.site_id != claims.get('site_id'):
        return jsonify({"msg": "You can only add expenses to issuances for your site"}), 403
        
    username = get_jwt_identity()
    user = User.query.filter_by(username=username).first()
    
    expense, is_shortfall, balance = es.add_expense(data, created_by=user.id if user else None)
    
    response = {
        "expense": expense,
        "current_balance": balance
    }
    if is_shortfall:
        response["negative_balance"] = True
        response["message"] = "Cash shortfall detected"
        
    return jsonify(response), 201

@expenses_bp.get('/')
@jwt_required()
@supervisor_required()
def get_expenses():
    claims = get_jwt()
    role = claims.get('role')
    site_id = request.args.get('site_id', type=int)

    if role == 'admin':
        expenses = es.get_expenses(site_id=site_id)
    elif role == 'project_manager':
        project_id = claims.get('project_id')
        sites = Site.query.filter_by(project_id=project_id).all()
        site_ids = [s.id for s in sites]
        
        if site_id:
            if site_id not in site_ids:
                return jsonify({"msg": "Unauthorized"}), 403
            expenses = es.get_expenses(site_id=site_id)
        else:
            expenses = es.get_expenses(site_ids=site_ids)
    else: # supervisor
        my_site_id = claims.get('site_id')
        expenses = es.get_expenses(site_id=my_site_id)
        
    return jsonify(expenses), 200

@expenses_bp.put('/<int:id>')
@jwt_required()
@supervisor_required()
def update_expense(id):
    claims = get_jwt()
    role = claims.get('role')
    
    if role != 'supervisor':
        return jsonify({"msg": "Only supervisors can update expenses"}), 403
        
    expense_data = es.get_expense(id)
    if not expense_data:
        return jsonify({"msg": "Expense not found"}), 404
        
    issuance = CashIssuance.query.get(expense_data['cash_issuance_id'])
    if not issuance or issuance.site_id != claims.get('site_id'):
        return jsonify({"msg": "Unauthorized"}), 403
        
    data = request.get_json()
    expense, is_shortfall, balance = es.update_expense(id, data)
    
    response = {
        "expense": expense,
        "current_balance": balance
    }
    if is_shortfall:
        response["negative_balance"] = True
        response["message"] = "Cash shortfall detected"
        
    return jsonify(response), 200

@expenses_bp.delete('/<int:id>')
@jwt_required()
@supervisor_required()
def delete_expense(id):
    claims = get_jwt()
    role = claims.get('role')
    
    if role != 'supervisor':
        return jsonify({"msg": "Only supervisors can delete expenses"}), 403
        
    expense_data = es.get_expense(id)
    if not expense_data:
        return jsonify({"msg": "Expense not found"}), 404
        
    issuance = CashIssuance.query.get(expense_data['cash_issuance_id'])
    if not issuance or issuance.site_id != claims.get('site_id'):
        return jsonify({"msg": "Unauthorized"}), 403
        
    success, balance = es.delete_expense(id)
    if not success:
        return jsonify({"msg": "Failed to delete"}), 500
        
    return jsonify({"msg": "Expense deleted", "current_balance": balance}), 200