from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import authenticate_user, change_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/login')
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    result = authenticate_user(username, password)
    if not result:
        return jsonify({"msg": "Bad username or password"}), 401

    return jsonify(result), 200

@auth_bp.post('/change-password')
@jwt_required()
def change_pwd():
    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    
    if not old_password or not new_password:
        return jsonify({"msg": "Missing old or new password"}), 400

    username = get_jwt_identity()
    success = change_password(username, old_password, new_password)
    
    if success:
        return jsonify({"msg": "Password changed successfully"}), 200
    else:
        return jsonify({"msg": "Incorrect old password"}), 400
