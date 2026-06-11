from database.db import db
from database.models import Site, User

def create_site(data):
    site = Site(
        project_name=data.get('project_name'),
        site_code=data.get('site_code'),
        pm_name=data.get('pm_name'),
        monthly_budget=data.get('monthly_budget')
    )
    db.session.add(site)
    db.session.flush() # To get the site.id

    # Create manager user
    manager = User(
        username=data.get('site_code'),
        role='manager',
        site_id=site.id
    )
    # Default password configuration
    manager.set_password('default123')
    db.session.add(manager)
    
    db.session.commit()
    return site

def get_sites():
    return Site.query.all()

def get_site(site_id):
    return Site.query.get(site_id)

def update_site(site_id, data):
    site = Site.query.get(site_id)
    if not site:
        return None
    
    if 'project_name' in data:
        site.project_name = data['project_name']
    if 'site_code' in data:
        # Note: if site_code changes, maybe manager username should change? 
        # For now, just update site.
        site.site_code = data['site_code']
    if 'pm_name' in data:
        site.pm_name = data['pm_name']
    if 'monthly_budget' in data:
        site.monthly_budget = data['monthly_budget']
        
    db.session.commit()
    return site

def delete_site(site_id):
    site = Site.query.get(site_id)
    if not site:
        return False
        
    # delete associated manager first
    manager = User.query.filter_by(site_id=site_id).first()
    if manager:
        db.session.delete(manager)
        
    db.session.delete(site)
    db.session.commit()
    return True
