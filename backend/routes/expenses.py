from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from utils.auth_utils import admin_required, manager_required
from services.expenses_service import (
    add_expense, get_expenses, get_expense, update_expense, delete_expense
)
from services.issuances_service import get_issuance

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.post("/")
@jwt_required()
@manager_required()
def add_expense_route():
    data = request.json
    if not data or not all(k in data for k in ("issuance_id", "category", "amount")):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Validation: Manager can only create expenses for issuances belonging to their site
    claims = get_jwt()
    site_id = claims.get('site_id')
    issuance = get_issuance(data['issuance_id'])
    if not issuance or issuance.site_id != site_id:
        return jsonify({"error": "Invalid issuance_id for your site"}), 403

    expense, shortfall_warning, balance = add_expense(data)
    
    response_data = {
        "id": expense.id,
        "issuance_id": expense.issuance_id,
        "category": expense.category,
        "amount": expense.amount,
        "description": expense.description,
        "receipt_url": expense.receipt_url,
        "expense_time": expense.expense_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    
    if shortfall_warning:
        response_data["negative_balance"] = True
        response_data["message"] = "Cash shortfall detected"
        response_data["current_balance"] = balance

    return jsonify(response_data), 201

@expenses_bp.get("/")
@jwt_required()
@manager_required()
def get_manager_expenses_route():
    claims = get_jwt()
    site_id = claims.get('site_id')
    expenses = get_expenses(site_id=site_id)
    return jsonify([
        {
            "id": e.id,
            "issuance_id": e.issuance_id,
            "category": e.category,
            "amount": e.amount,
            "description": e.description,
            "receipt_url": e.receipt_url,
            "expense_time": e.expense_time.strftime("%Y-%m-%d %H:%M:%S")
        } for e in expenses
    ]), 200

@expenses_bp.get("/<int:id>")
@jwt_required()
@manager_required()
def get_manager_expense_route(id):
    claims = get_jwt()
    site_id = claims.get('site_id')
    expense = get_expense(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    issuance = get_issuance(expense.issuance_id)
    if not issuance or issuance.site_id != site_id:
        return jsonify({"error": "Access denied"}), 403

    return jsonify({
        "id": expense.id,
        "issuance_id": expense.issuance_id,
        "category": expense.category,
        "amount": expense.amount,
        "description": expense.description,
        "receipt_url": expense.receipt_url,
        "expense_time": expense.expense_time.strftime("%Y-%m-%d %H:%M:%S")
    }), 200

@expenses_bp.put("/<int:id>")
@jwt_required()
@manager_required()
def edit_expense_route(id):
    claims = get_jwt()
    site_id = claims.get('site_id')
    expense = get_expense(id)
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
        
    issuance = get_issuance(expense.issuance_id)
    if not issuance or issuance.site_id != site_id:
        return jsonify({"error": "Access denied"}), 403

    data = request.json
    updated_expense, shortfall_warning, balance = update_expense(id, data)
    
    response_data = {
        "message": "Expense updated successfully",
        "expense": {
            "id": updated_expense.id,
            "issuance_id": updated_expense.issuance_id,
            "category": updated_expense.category,
            "amount": updated_expense.amount,
            "description": updated_expense.description,
            "receipt_url": updated_expense.receipt_url,
            "expense_time": updated_expense.expense_time.strftime("%Y-%m-%d %H:%M:%S")
        }
    }
    
    if shortfall_warning:
        response_data["negative_balance"] = True
        response_data["warning"] = "Cash shortfall detected"
        response_data["current_balance"] = balance

    return jsonify(response_data), 200

@expenses_bp.delete("/<int:id>")
@jwt_required()
@manager_required()
def delete_expense_route(id):
    claims = get_jwt()
    site_id = claims.get('site_id')
    expense = get_expense(id)
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
        
    issuance = get_issuance(expense.issuance_id)
    if not issuance or issuance.site_id != site_id:
        return jsonify({"error": "Access denied"}), 403

    success = delete_expense(id)
    return jsonify({"message": "Expense deleted successfully"}), 200

# ADMIN routes for expenses
from flask import Blueprint

# Using same blueprint, but with different prefix in spec: /api/admin/expenses
# So we map it directly:
@expenses_bp.get("/all")
@jwt_required()
@admin_required()
def get_admin_expenses_route():
    expenses = get_expenses()
    return jsonify([
        {
            "id": e.id,
            "issuance_id": e.issuance_id,
            "category": e.category,
            "amount": e.amount,
            "description": e.description,
            "receipt_url": e.receipt_url,
            "expense_time": e.expense_time.strftime("%Y-%m-%d %H:%M:%S")
        } for e in expenses
    ]), 200