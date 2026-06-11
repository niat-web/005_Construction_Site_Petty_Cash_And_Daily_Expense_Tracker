from datetime import datetime
from sqlalchemy import func
from database.db import db
from database.models import CashIssuance

def issue_cash(data):
    issue_date_str = data.get('issue_date')
    if issue_date_str:
        issue_date = datetime.strptime(issue_date_str, "%Y-%m-%d")
    else:
        issue_date = datetime.utcnow()

    issuance = CashIssuance(
        site_id=data.get('site_id'),
        supervisor_name=data.get('supervisor_name'),
        amount=data.get('amount'),
        issue_date=issue_date
    )
    db.session.add(issuance)
    db.session.commit()
    return issuance

def get_issuances(site_id=None, from_date=None, to_date=None):
    query = CashIssuance.query
    
    if site_id:
        query = query.filter(CashIssuance.site_id == site_id)
    if from_date:
        fd = datetime.strptime(from_date, "%Y-%m-%d").date()
        query = query.filter(func.date(CashIssuance.issue_date) >= fd)
    if to_date:
        td = datetime.strptime(to_date, "%Y-%m-%d").date()
        query = query.filter(func.date(CashIssuance.issue_date) <= td)
        
    return query.all()

def get_issuance(issuance_id):
    return CashIssuance.query.get(issuance_id)

def update_issuance(issuance_id, data):
    issuance = CashIssuance.query.get(issuance_id)
    if not issuance:
        return None
    
    if 'site_id' in data:
        issuance.site_id = data['site_id']
    if 'supervisor_name' in data:
        issuance.supervisor_name = data['supervisor_name']
    if 'amount' in data:
        issuance.amount = data['amount']
    if 'issue_date' in data:
        issuance.issue_date = datetime.strptime(data['issue_date'], "%Y-%m-%d")
        
    db.session.commit()
    return issuance

def delete_issuance(issuance_id):
    issuance = CashIssuance.query.get(issuance_id)
    if not issuance:
        return False
    db.session.delete(issuance)
    db.session.commit()
    return True
