import cloudinary.uploader
from flask import current_app

def upload_image(file_stream):
    """
    Uploads an image file stream to Cloudinary.
    Returns the secure URL of the uploaded image.
    """
    try:
        response = cloudinary.uploader.upload(file_stream, folder="pettycash_receipts")
        return response.get('secure_url')
    except Exception as e:
        current_app.logger.error(f"Cloudinary upload failed: {e}")
        return None
