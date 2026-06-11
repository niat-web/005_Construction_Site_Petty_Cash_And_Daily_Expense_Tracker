from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') == 'admin':
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Admin access required"), 403
        return decorator
    return wrapper

def pm_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') in ['admin', 'project_manager']:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Project Manager access required"), 403
        return decorator
    return wrapper

def supervisor_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') in ['admin', 'project_manager', 'supervisor']:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Supervisor access required"), 403
        return decorator
    return wrapper
