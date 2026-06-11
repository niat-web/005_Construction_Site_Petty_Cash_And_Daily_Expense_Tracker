from datetime import datetime
from sqlalchemy import func
from database.models import CashIssuance, Expense

def get_weekly_summary(site_id, start_date_str, end_date_str):
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    issuances = CashIssuance.query.filter(
        CashIssuance.site_id == site_id,
        func.date(CashIssuance.issue_date) >= start_date,
        func.date(CashIssuance.issue_date) <= end_date
    ).all()
    
    total_issued = sum(i.amount for i in issuances)
    issuance_ids = [i.id for i in issuances]
    
    total_spent = 0
    category_totals = {}
    
    if issuance_ids:
        expenses = Expense.query.filter(Expense.issuance_id.in_(issuance_ids)).all()
        total_spent = sum(e.amount for e in expenses)
        for e in expenses:
            category_totals[e.category] = category_totals.get(e.category, 0) + e.amount
            
    surplus = total_issued - total_spent
    
    return {
        "total_issued": total_issued,
        "total_spent": total_spent,
        "surplus": surplus,
        "category_totals": category_totals
    }
