from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.decorators import admin_required
import services.projects_service as ps

projects_bp = Blueprint('projects', __name__)

@projects_bp.post('/')
@jwt_required()
@admin_required()
def create_project():
    data = request.get_json()
    if not data or not data.get('project_name') or not data.get('monthly_budget'):
        return jsonify({"msg": "Missing project_name or monthly_budget"}), 400
    
    project = ps.create_project(data)
    return jsonify(project), 201

@projects_bp.get('/')
@jwt_required()
@admin_required()
def get_projects():
    projects = ps.get_projects()
    return jsonify(projects), 200

@projects_bp.get('/<int:id>')
@jwt_required()
@admin_required()
def get_project(id):
    project = ps.get_project(id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    return jsonify(project), 200

@projects_bp.put('/<int:id>')
@jwt_required()
@admin_required()
def update_project(id):
    data = request.get_json()
    project = ps.update_project(id, data)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    return jsonify(project), 200

@projects_bp.delete('/<int:id>')
@jwt_required()
@admin_required()
def delete_project(id):
    success = ps.delete_project(id)
    if not success:
        return jsonify({"msg": "Project not found"}), 404
    return jsonify({"msg": "Project deleted"}), 200
