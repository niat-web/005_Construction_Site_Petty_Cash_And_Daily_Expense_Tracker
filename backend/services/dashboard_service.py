from datetime import datetime
from sqlalchemy import func
from database.models import CashIssuance, Expense, Project, Site

def get_admin_dashboard():
    total_projects = Project.query.count()
    total_sites = Site.query.count()
    
    issuances = CashIssuance.query.all()
    total_cash_issued = sum(i.amount for i in issuances)
    
    expenses = Expense.query.all()
    total_spent = sum(e.amount for e in expenses)
    
    balance = total_cash_issued - total_spent
    
    return {
        "total_projects": total_projects,
        "total_sites": total_sites,
        "total_cash_issued": total_cash_issued,
        "total_spent": total_spent,
        "balance": balance
    }

def get_pm_dashboard(project_id):
    project = Project.query.get(project_id)
    if not project:
        return None
        
    sites = Site.query.filter_by(project_id=project_id).all()
    total_sites = len(sites)
    
    site_ids = [s.id for s in sites]
    
    issuances = CashIssuance.query.filter(CashIssuance.site_id.in_(site_ids)).all() if site_ids else []
    issued = sum(i.amount for i in issuances)
    
    issuance_ids = [i.id for i in issuances]
    expenses = Expense.query.filter(Expense.cash_issuance_id.in_(issuance_ids)).all() if issuance_ids else []
    spent = sum(e.amount for e in expenses)
    
    return {
        "project_name": project.project_name,
        "total_sites": total_sites,
        "issued": issued,
        "spent": spent,
        "balance": issued - spent
    }

def get_supervisor_dashboard(site_id):
    site = Site.query.get(site_id)
    if not site:
        return None
        
    target_date = datetime.utcnow().date()

    # Get today's issuances
    issuances = CashIssuance.query.filter(
        CashIssuance.site_id == site_id,
        func.date(CashIssuance.issue_date) == target_date
    ).all()
    
    issued_today = sum(i.amount for i in issuances)
    
    # Get all issuances to find today's expenses
    all_issuances = CashIssuance.query.filter_by(site_id=site_id).all()
    all_issuance_ids = [i.id for i in all_issuances]
    
    expenses = Expense.query.filter(
        Expense.cash_issuance_id.in_(all_issuance_ids),
        func.date(Expense.expense_time) == target_date
    ).all() if all_issuance_ids else []
    
    spent_today = sum(e.amount for e in expenses)
    
    return {
        "site_name": site.site_name,
        "issued_today": issued_today,
        "spent_today": spent_today,
        "balance": issued_today - spent_today
    }
