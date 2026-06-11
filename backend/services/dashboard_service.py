from datetime import datetime
from sqlalchemy import func
from database.models import CashIssuance, Expense

def get_dashboard(site_id):
    target_date = datetime.utcnow().date()

    # Get today's issuances
    issuances = CashIssuance.query.filter(
        CashIssuance.site_id == site_id,
        func.date(CashIssuance.issue_date) == target_date
    ).all()
    
    total_issued = sum(i.amount for i in issuances)
    issuance_ids = [i.id for i in issuances]
    
    if not issuance_ids:
        return {
            "today_issued": 0,
            "today_spent": 0,
            "balance": 0,
            "categories": {}
        }
        
    expenses = Expense.query.filter(Expense.issuance_id.in_(issuance_ids)).all()
    
    total_spent = sum(e.amount for e in expenses)
    balance = total_issued - total_spent
    
    categories = {}
    for e in expenses:
        categories[e.category] = categories.get(e.category, 0) + e.amount
        
    return {
        "today_issued": total_issued,
        "today_spent": total_spent,
        "balance": balance,
        "categories": categories
    }
