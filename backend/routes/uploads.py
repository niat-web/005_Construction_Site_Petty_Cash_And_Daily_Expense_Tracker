from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utils.cloudinary_utils import upload_image

uploads_bp = Blueprint("uploads", __name__)

@uploads_bp.post("/")
@jwt_required()
def upload_receipt_route():
    if 'receipt' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['receipt']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        url = upload_image(file)
        if url:
            return jsonify({"url": url}), 200
        else:
            return jsonify({"error": "Failed to upload to Cloudinary"}), 500
