from datetime import datetime
from sqlalchemy import func
from database.db import db
from database.models import CashIssuance

def issue_cash(data, issued_by=None):
    issue_date_str = data.get('issue_date')
    if issue_date_str:
        issue_date = datetime.strptime(issue_date_str, "%Y-%m-%d")
    else:
        issue_date = datetime.utcnow()

    issuance = CashIssuance(
        site_id=data.get('site_id'),
        amount=data.get('amount'),
        issue_date=issue_date,
        issued_by=issued_by
    )
    db.session.add(issuance)
    db.session.commit()
    return _format_issuance(issuance)

def get_issuances(site_id=None, from_date=None, to_date=None, site_ids=None):
    query = CashIssuance.query
    
    if site_id:
        query = query.filter(CashIssuance.site_id == site_id)
    if site_ids is not None:
        query = query.filter(CashIssuance.site_id.in_(site_ids))
    if from_date:
        fd = datetime.strptime(from_date, "%Y-%m-%d").date()
        query = query.filter(func.date(CashIssuance.issue_date) >= fd)
    if to_date:
        td = datetime.strptime(to_date, "%Y-%m-%d").date()
        query = query.filter(func.date(CashIssuance.issue_date) <= td)
        
    issuances = query.all()
    return [_format_issuance(i) for i in issuances]

def get_issuance(issuance_id):
    i = CashIssuance.query.get(issuance_id)
    if not i:
        return None
    return _format_issuance(i)

def update_issuance(issuance_id, data):
    issuance = CashIssuance.query.get(issuance_id)
    if not issuance:
        return None
    
    if 'site_id' in data:
        issuance.site_id = data['site_id']
    if 'amount' in data:
        issuance.amount = data['amount']
    if 'issue_date' in data:
        issuance.issue_date = datetime.strptime(data['issue_date'], "%Y-%m-%d")
        
    db.session.commit()
    return _format_issuance(issuance)

def delete_issuance(issuance_id):
    issuance = CashIssuance.query.get(issuance_id)
    if not issuance:
        return False
    
    db.session.delete(issuance)
    db.session.commit()
    return True

def _format_issuance(i):
    return {
        "id": i.id,
        "site_id": i.site_id,
        "amount": i.amount,
        "issue_date": i.issue_date.isoformat() if i.issue_date else None,
        "issued_by": i.issued_by,
        "created_at": i.created_at.isoformat() if i.created_at else None
    }
