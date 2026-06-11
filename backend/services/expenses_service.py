from datetime import datetime
from database.db import db
from database.models import Expense, CashIssuance

def _calculate_site_balance(site_id):
    issuances = CashIssuance.query.filter_by(site_id=site_id).all()
    total_issued = sum(i.amount for i in issuances)
    
    issuance_ids = [i.id for i in issuances]
    total_spent = 0
    if issuance_ids:
        expenses = Expense.query.filter(Expense.issuance_id.in_(issuance_ids)).all()
        total_spent = sum(e.amount for e in expenses)
        
    return total_issued - total_spent

def add_expense(data):
    expense_time_str = data.get('expense_time')
    if expense_time_str:
        try:
            expense_time = datetime.strptime(expense_time_str, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            expense_time = datetime.utcnow()
    else:
        expense_time = datetime.utcnow()

    issuance_id = data.get('issuance_id')
    amount = data.get('amount')
    
    expense = Expense(
        issuance_id=issuance_id,
        category=data.get('category'),
        amount=amount,
        description=data.get('description'),
        expense_time=expense_time,
        receipt_url=data.get('receipt_url')
    )
    
    db.session.add(expense)
    db.session.commit()
    
    # Check for shortfall for the site
    issuance = CashIssuance.query.get(issuance_id)
    shortfall_warning = False
    balance = 0
    
    if issuance:
        balance = _calculate_site_balance(issuance.site_id)
        if balance < 0:
            shortfall_warning = True

    return expense, shortfall_warning, balance

def get_expenses(site_id=None):
    if site_id:
        # Get issuances for the site
        issuances = CashIssuance.query.filter_by(site_id=site_id).all()
        issuance_ids = [i.id for i in issuances]
        if not issuance_ids:
            return []
        return Expense.query.filter(Expense.issuance_id.in_(issuance_ids)).all()
    return Expense.query.all()

def get_expense(expense_id):
    return Expense.query.get(expense_id)

def update_expense(expense_id, data):
    expense = Expense.query.get(expense_id)
    if not expense:
        return None, False, 0
    
    if 'issuance_id' in data:
        expense.issuance_id = data['issuance_id']
    if 'category' in data:
        expense.category = data['category']
    if 'amount' in data:
        expense.amount = data['amount']
    if 'description' in data:
        expense.description = data['description']
    if 'expense_time' in data:
        try:
            expense.expense_time = datetime.strptime(data['expense_time'], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            pass
    if 'receipt_url' in data:
        expense.receipt_url = data['receipt_url']
        
    db.session.commit()
    
    # Re-calculate shortfall
    shortfall_warning = False
    balance = 0
    issuance = CashIssuance.query.get(expense.issuance_id)
    if issuance:
        balance = _calculate_site_balance(issuance.site_id)
        if balance < 0:
            shortfall_warning = True

    return expense, shortfall_warning, balance

def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return False
    db.session.delete(expense)
    db.session.commit()
    return True
