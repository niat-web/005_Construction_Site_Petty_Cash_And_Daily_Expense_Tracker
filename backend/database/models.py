from datetime import datetime
from database.db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=False) # admin, manager
    site_id = db.Column(db.Integer, db.ForeignKey('sites.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Site(db.Model):
    __tablename__ = "sites"

    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(120), nullable=False)
    site_code = db.Column(db.String(120), unique=True, nullable=False)
    pm_name = db.Column(db.String(120), nullable=False)
    monthly_budget = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    manager = db.relationship('User', backref='site', uselist=False, foreign_keys=[User.site_id])
    issuances = db.relationship('CashIssuance', backref='site', lazy=True)


class CashIssuance(db.Model):
    __tablename__ = "cash_issuances"

    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('sites.id'), nullable=False)
    supervisor_name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    issue_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    expenses = db.relationship('Expense', backref='issuance', lazy=True)


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    issuance_id = db.Column(db.Integer, db.ForeignKey('cash_issuances.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    receipt_url = db.Column(db.String(500), nullable=True)
    expense_time = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)