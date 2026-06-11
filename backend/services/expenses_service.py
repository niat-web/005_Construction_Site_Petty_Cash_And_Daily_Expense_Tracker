from datetime import datetime
from database.db import db
from database.models import Expense, CashIssuance

def _calculate_site_balance(site_id):
    issuances = CashIssuance.query.filter_by(site_id=site_id).all()
    total_issued = sum(i.amount for i in issuances)
    
    issuance_ids = [i.id for i in issuances]
    total_spent = 0
    if issuance_ids:
        expenses = Expense.query.filter(Expense.cash_issuance_id.in_(issuance_ids)).all()
        total_spent = sum(e.amount for e in expenses)
        
    return total_issued - total_spent

def add_expense(data, created_by=None):
    expense_time_str = data.get('expense_time')
    if expense_time_str:
        try:
            expense_time = datetime.strptime(expense_time_str, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            expense_time = datetime.utcnow()
    else:
        expense_time = datetime.utcnow()

    cash_issuance_id = data.get('cash_issuance_id')
    amount = data.get('amount')
    
    expense = Expense(
        cash_issuance_id=cash_issuance_id,
        category=data.get('category'),
        amount=amount,
        description=data.get('description'),
        expense_time=expense_time,
        receipt_url=data.get('receipt_url'),
        created_by=created_by
    )
    
    db.session.add(expense)
    db.session.commit()
    
    # Check for shortfall for the site
    issuance = CashIssuance.query.get(cash_issuance_id)
    shortfall_warning = False
    balance = 0
    
    if issuance:
        balance = _calculate_site_balance(issuance.site_id)
        if balance < 0:
            shortfall_warning = True

    return _format_expense(expense), shortfall_warning, balance

def get_expenses(site_id=None, site_ids=None):
    if site_id:
        issuances = CashIssuance.query.filter_by(site_id=site_id).all()
        issuance_ids = [i.id for i in issuances]
        if not issuance_ids:
            return []
        expenses = Expense.query.filter(Expense.cash_issuance_id.in_(issuance_ids)).order_by(Expense.expense_time.desc()).all()
        return [_format_expense(e) for e in expenses]
        
    if site_ids is not None:
        issuances = CashIssuance.query.filter(CashIssuance.site_id.in_(site_ids)).all()
        issuance_ids = [i.id for i in issuances]
        if not issuance_ids:
            return []
        expenses = Expense.query.filter(Expense.cash_issuance_id.in_(issuance_ids)).order_by(Expense.expense_time.desc()).all()
        return [_format_expense(e) for e in expenses]

    # Return all if no filters
    expenses = Expense.query.order_by(Expense.expense_time.desc()).all()
    return [_format_expense(e) for e in expenses]

def get_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return None
    return _format_expense(expense)

def update_expense(expense_id, data):
    expense = Expense.query.get(expense_id)
    if not expense:
        return None, False, 0
        
    if 'cash_issuance_id' in data:
        expense.cash_issuance_id = data['cash_issuance_id']
    if 'category' in data:
        expense.category = data['category']
    if 'amount' in data:
        expense.amount = data['amount']
    if 'description' in data:
        expense.description = data['description']
    if 'receipt_url' in data:
        expense.receipt_url = data['receipt_url']
    if 'expense_time' in data:
        try:
            expense.expense_time = datetime.strptime(data['expense_time'], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            pass

    db.session.commit()

    # Recheck balance
    issuance = CashIssuance.query.get(expense.cash_issuance_id)
    shortfall_warning = False
    balance = 0
    if issuance:
        balance = _calculate_site_balance(issuance.site_id)
        if balance < 0:
            shortfall_warning = True

    return _format_expense(expense), shortfall_warning, balance

def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return False, 0
    
    issuance_id = expense.cash_issuance_id
    db.session.delete(expense)
    db.session.commit()
    
    issuance = CashIssuance.query.get(issuance_id)
    balance = 0
    if issuance:
        balance = _calculate_site_balance(issuance.site_id)
        
    return True, balance

def _format_expense(e):
    return {
        "id": e.id,
        "cash_issuance_id": e.cash_issuance_id,
        "category": e.category,
        "amount": e.amount,
        "description": e.description,
        "receipt_url": e.receipt_url,
        "expense_time": e.expense_time.isoformat() if e.expense_time else None,
        "created_by": e.created_by,
        "created_at": e.created_at.isoformat() if e.created_at else None,
        "updated_at": e.updated_at.isoformat() if e.updated_at else None
    }
