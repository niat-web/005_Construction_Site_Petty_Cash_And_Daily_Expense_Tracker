from database.db import db
from database.models import User

def create_user(data, role):
    user = User(
        name=data.get('name'),
        username=data['username'],
        role=role,
        project_id=data.get('project_id'),
        site_id=data.get('site_id')
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return _format_user(user)

def get_users():
    users = User.query.all()
    return [_format_user(u) for u in users]

def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    return _format_user(user)

def update_user(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return None
    
    if 'name' in data:
        user.name = data['name']
    if 'username' in data:
        user.username = data['username']
    if 'password' in data:
        user.set_password(data['password'])
    if 'role' in data:
        user.role = data['role']
    if 'project_id' in data:
        user.project_id = data['project_id']
    if 'site_id' in data:
        user.site_id = data['site_id']
        
    db.session.commit()
    return _format_user(user)

def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return False
    db.session.delete(user)
    db.session.commit()
    return True

def _format_user(user):
    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "role": user.role,
        "project_id": user.project_id,
        "site_id": user.site_id,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }
