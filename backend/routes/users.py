from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.decorators import admin_required
import services.users_service as us

users_bp = Blueprint('users', __name__)

@users_bp.post('/project-manager')
@jwt_required()
@admin_required()
def create_pm():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password') or not data.get('project_id'):
        return jsonify({"msg": "Missing username, password or project_id"}), 400
    
    user = us.create_user(data, role='project_manager')
    return jsonify(user), 201

@users_bp.post('/supervisor')
@jwt_required()
@admin_required()
def create_supervisor():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password') or not data.get('site_id'):
        return jsonify({"msg": "Missing username, password or site_id"}), 400
    
    user = us.create_user(data, role='supervisor')
    return jsonify(user), 201

@users_bp.get('/')
@jwt_required()
@admin_required()
def get_users():
    users = us.get_users()
    return jsonify(users), 200

@users_bp.put('/<int:id>')
@jwt_required()
@admin_required()
def update_user(id):
    data = request.get_json()
    user = us.update_user(id, data)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user), 200

@users_bp.delete('/<int:id>')
@jwt_required()
@admin_required()
def delete_user(id):
    success = us.delete_user(id)
    if not success:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"msg": "User deleted"}), 200
