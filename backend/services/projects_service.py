from database.db import db
from database.models import Project

def create_project(data):
    project = Project(
        project_name=data['project_name'],
        monthly_budget=data['monthly_budget']
    )
    db.session.add(project)
    db.session.commit()
    return {
        "id": project.id,
        "project_name": project.project_name,
        "monthly_budget": project.monthly_budget
    }

def get_projects():
    projects = Project.query.all()
    return [
        {
            "id": p.id,
            "project_name": p.project_name,
            "monthly_budget": p.monthly_budget
        } for p in projects
    ]

def get_project(project_id):
    p = Project.query.get(project_id)
    if not p:
        return None
    return {
        "id": p.id,
        "project_name": p.project_name,
        "monthly_budget": p.monthly_budget
    }

def update_project(project_id, data):
    p = Project.query.get(project_id)
    if not p:
        return None
    if 'project_name' in data:
        p.project_name = data['project_name']
    if 'monthly_budget' in data:
        p.monthly_budget = data['monthly_budget']
    db.session.commit()
    return {
        "id": p.id,
        "project_name": p.project_name,
        "monthly_budget": p.monthly_budget
    }

def delete_project(project_id):
    p = Project.query.get(project_id)
    if not p:
        return False
    db.session.delete(p)
    db.session.commit()
    return True
