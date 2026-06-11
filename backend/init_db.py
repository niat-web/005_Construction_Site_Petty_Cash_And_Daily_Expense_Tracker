from app import create_app
from database.db import db
from database.models import User, Project, Site, CashIssuance, Expense
from datetime import datetime, timedelta

def init_db():
    app = create_app()
    with app.app_context():
        # Check if admin already exists
        admin = User.query.filter_by(username="admin").first()
        if not admin:
            admin = User(username="admin", name="Super Admin", role="admin")
            admin.set_password("admin123")
            db.session.add(admin)
            
            user_admin = User(username="vikrambalai1002@gmail.com", name="Vikram", role="admin")
            user_admin.set_password("password")
            db.session.add(user_admin)
            
            print("Admin users created.")

        # Create Project
        project = Project.query.filter_by(project_name="SkyView Apartments").first()
        if not project:
            project = Project(project_name="SkyView Apartments", monthly_budget=5000000)
            db.session.add(project)
            db.session.commit()
            print("Project created.")

            # Create Project Manager
            pm = User(username="PM001", name="Rajesh Kumar", role="project_manager", project_id=project.id)
            pm.set_password("default123")
            db.session.add(pm)
            db.session.commit()
            print("Project Manager PM001 created.")

            # Create Site
            site = Site(project_id=project.id, site_name="Tower A", site_code="SITE001")
            db.session.add(site)
            db.session.commit()
            print("Site SITE001 created.")

            # Create Supervisor
            supervisor = User(username="SITE001", name="Ramesh", role="supervisor", site_id=site.id)
            supervisor.set_password("default123")
            db.session.add(supervisor)
            db.session.commit()
            print("Supervisor SITE001 created.")

            # Create dummy cash issuance
            today = datetime.utcnow()
            issuance = CashIssuance(
                site_id=site.id,
                amount=10000,
                issue_date=today,
                issued_by=admin.id
            )
            db.session.add(issuance)
            db.session.commit()
            print("Cash issuance created.")

            # Create dummy expenses
            exp1 = Expense(
                cash_issuance_id=issuance.id,
                category="Labour",
                amount=1500,
                description="Daily wages",
                expense_time=today ,
                created_by=supervisor.id
            )
            exp2 = Expense(
                cash_issuance_id=issuance.id,
                category="Material",
                amount=4500,
                description="Cement",
                expense_time=today,
                created_by=supervisor.id
            )
            db.session.add(exp1)
            db.session.add(exp2)
            db.session.commit()
            print("Expenses created.")

        print("Database initialized successfully with dummy data.")

if __name__ == "__main__":
    init_db()
