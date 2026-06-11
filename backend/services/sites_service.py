from database.db import db
from database.models import Site

def create_site(data):
    site = Site(
        project_id=data['project_id'],
        site_name=data['site_name'],
        site_code=data['site_code']
    )
    db.session.add(site)
    db.session.commit()
    return _format_site(site)

def get_sites():
    sites = Site.query.all()
    return [_format_site(s) for s in sites]

def get_sites_by_project(project_id):
    sites = Site.query.filter_by(project_id=project_id).all()
    return [_format_site(s) for s in sites]

def get_site(site_id):
    site = Site.query.get(site_id)
    if not site:
        return None
    return _format_site(site)

def update_site(site_id, data):
    site = Site.query.get(site_id)
    if not site:
        return None
    
    if 'project_id' in data:
        site.project_id = data['project_id']
    if 'site_name' in data:
        site.site_name = data['site_name']
    if 'site_code' in data:
        site.site_code = data['site_code']
        
    db.session.commit()
    return _format_site(site)

def delete_site(site_id):
    site = Site.query.get(site_id)
    if not site:
        return False
    
    # Optional: We could delete users associated or reassign them, but cascade will fail if not handled.
    # For now, just delete the site
    db.session.delete(site)
    db.session.commit()
    return True

def _format_site(site):
    return {
        "id": site.id,
        "project_id": site.project_id,
        "site_name": site.site_name,
        "site_code": site.site_code,
        "created_at": site.created_at.isoformat() if site.created_at else None,
        "updated_at": site.updated_at.isoformat() if site.updated_at else None
    }
