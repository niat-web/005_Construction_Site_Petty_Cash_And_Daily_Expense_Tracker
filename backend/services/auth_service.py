from database.db import db
from database.models import User
from flask_jwt_extended import create_access_token

def authenticate_user(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        additional_claims = {
            "role": user.role,
            "site_id": user.site_id,
            "project_id": user.project_id
        }
        access_token = create_access_token(identity=user.username, additional_claims=additional_claims)
        return {
            "access_token": access_token,
            "role": user.role,
            "site_id": user.site_id,
            "project_id": user.project_id
        }
    return None

def change_password(username, old_password, new_password):
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(old_password):
        return False
    user.set_password(new_password)
    db.session.commit()
    return True
