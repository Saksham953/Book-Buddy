import os
import boto3
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from decimal import Decimal

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Allow requests from the Next.js frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize AWS Services
# Boto3 will automatically use AWS credentials from environment variables:
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
SNS_TOPIC_ARN = os.getenv('SNS_TOPIC_ARN')

dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
sns = boto3.client('sns', region_name=AWS_REGION)

# Table References
def get_books_table():
    return dynamodb.Table('Books')

def get_orders_table():
    return dynamodb.Table('Orders')

# Helper to convert float to Decimal for DynamoDB
def convert_floats_to_decimals(obj):
    if isinstance(obj, list):
        return [convert_floats_to_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    return obj

# Helper to convert Decimal to float for JSON response
def convert_decimals_to_floats(obj):
    if isinstance(obj, list):
        return [convert_decimals_to_floats(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals_to_floats(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

# --- API ROUTES ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "Flask backend connected to AWS!",
        "region": AWS_REGION
    })

@app.route('/api/books', methods=['GET'])
def get_books():
    """Fetch all books from DynamoDB"""
    try:
        table = get_books_table()
        response = table.scan()
        books = response.get('Items', [])
        return jsonify(convert_decimals_to_floats(books))
    except Exception as e:
        print(f"Error fetching books: {e}")
        # Fallback to a single mock item to prevent UI crash during setup
        return jsonify([{
            "id": "1", 
            "title": "Setup Required", 
            "author": "AWS DynamoDB", 
            "price": 0.00, 
            "image": "https://via.placeholder.com/400x600?text=Create+DynamoDB+Table",
            "previewUrl": "#"
        }])

@app.route('/api/books', methods=['POST'])
def add_book():
    """Add a new book to DynamoDB"""
    data = request.json
    try:
        # Convert floats to Decimals for Boto3/DynamoDB
        data = convert_floats_to_decimals(data)
        
        table = get_books_table()
        table.put_item(Item=data)
        return jsonify({"message": "Book added to DynamoDB successfully", "book": data}), 201
    except Exception as e:
        print(f"Error adding book: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<user_id>', methods=['GET'])
def get_user_orders(user_id):
    """Fetch orders for a specific user from DynamoDB"""
    try:
        table = get_orders_table()
        # Querying with Partition Key 'orderId' is not efficient for user lookup 
        # unless we have a GSI. For now, we use a scan with FilterExpression.
        response = table.scan(
            FilterExpression="userId = :uid",
            ExpressionAttributeValues={":uid": user_id}
        )
        return jsonify(response.get('Items', []))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order in DynamoDB and send SNS notification"""
    data = request.json
    # data should contain: orderId, userId, items, timestamp, status, deliveryDate, progress
    try:
        # Convert floats to Decimals for Boto3/DynamoDB
        data = convert_floats_to_decimals(data)
        
        # 1. Save to DynamoDB
        table = get_orders_table()
        table.put_item(Item=data)
        
        # 2. Send SNS Notification
        if SNS_TOPIC_ARN:
            try:
                message = f"New Order Placed!\nOrder ID: {data.get('orderId')}\nUser ID: {data.get('userId')}\nItems: {len(data.get('items', []))}\nTotal Items: {data.get('items')}"
                sns.publish(
                    TopicArn=SNS_TOPIC_ARN,
                    Message=message,
                    Subject="BookStore Order Notification"
                )
            except Exception as sns_err:
                print(f"SNS Failed (Check Topic ARN or Permissions): {sns_err}")
        
        return jsonify({"message": "Order created and notification sent", "order": data}), 201
    except Exception as e:
        print(f"Error creating order: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book from DynamoDB"""
    try:
        table = get_books_table()
        table.delete_item(Key={'id': book_id})
        return jsonify({"message": "Book deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting book: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
