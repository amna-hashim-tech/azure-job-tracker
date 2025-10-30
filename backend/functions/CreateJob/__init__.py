import azure.functions as func
import json
import sys
import os
import uuid
from datetime import datetime

# Add parent directory to path to import shared modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from shared import database

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP POST endpoint to create a new job application
    """
    try:
        # Parse request body
        req_body = req.get_json()
        
        # Validate required fields
        required_fields = ['company', 'position', 'status']
        for field in required_fields:
            if field not in req_body:
                return func.HttpResponse(
                    body=json.dumps({"error": f"Missing required field: {field}"}),
                    mimetype="application/json",
                    status_code=400
                )
        
        # Create job object with auto-generated ID and timestamp
        job_data = {
            'id': str(uuid.uuid4()),
            'company': req_body['company'],
            'position': req_body['position'],
            'status': req_body['status'],
            'location': req_body.get('location', ''),
            'salary': req_body.get('salary', ''),
            'notes': req_body.get('notes', ''),
            'appliedDate': req_body.get('appliedDate', datetime.utcnow().isoformat()),
            'createdAt': datetime.utcnow().isoformat()
        }
        
        # Save to database
        created_job = database.create_job(job_data)
        
        # Return success response
        return func.HttpResponse(
            body=json.dumps(created_job),
            mimetype="application/json",
            status_code=201
        )
    
    except ValueError:
        return func.HttpResponse(
            body=json.dumps({"error": "Invalid JSON in request body"}),
            mimetype="application/json",
            status_code=400
        )
    except Exception as e:
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )