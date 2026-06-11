import os
import click
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv

from database.db import db
from database.models import User
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Load env variables if .env exists
load_dotenv()

# We need to import models here for Flask-Migrate
import database.models

from routes.auth import auth_bp
from routes.sites import sites_bp
from routes.issuances import issuances_bp
from routes.expenses import expenses_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp
from routes.uploads import uploads_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure PostgreSQL database and JWT
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/pettycash')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key-change-in-prod')
    
    # Initialize Cloudinary
    cloudinary.config(
        cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME', 'your_cloud_name'),
        api_key = os.environ.get('CLOUDINARY_API_KEY', 'your_api_key'),
        api_secret = os.environ.get('CLOUDINARY_API_SECRET', 'your_api_secret'),
        secure = True
    )

    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(sites_bp, url_prefix='/api/sites')
    app.register_blueprint(issuances_bp, url_prefix='/api/cash-issuances')
    app.register_blueprint(expenses_bp, url_prefix='/api/expenses')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(uploads_bp, url_prefix='/api/upload-receipt')

    @app.cli.command("create-admin")
    @click.option('--username', default='admin')
    @click.option('--password', default='admin123')
    def create_admin(username, password):
        """Creates the initial admin user."""
        admin = User.query.filter_by(username=username).first()
        if admin:
            print(f"User {username} already exists.")
            return
        
        user = User(username=username, role='admin')
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        print(f"Admin user {username} created successfully.")

    @app.route('/')
    def index():
        return {"message": "Petty Cash API is running."}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
