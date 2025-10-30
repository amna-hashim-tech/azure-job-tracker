import azure.functions as func
import json
import sys
import os
from datetime import datetime

# Add parent directory to path to import shared modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from shared import database

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP PUT endpoint to update an existing job application
    """
    try:
        # Get job ID from route parameter
        job_id = req.route_params.get('id')
        
        if not job_id:
            return func.HttpResponse(
                body=json.dumps({"error": "Job ID is required"}),
                mimetype="application/json",
                status_code=400
            )
        
        # Check if job exists
        existing_job = database.get_job_by_id(job_id)
        if not existing_job:
            return func.HttpResponse(
                body=json.dumps({"error": "Job not found"}),
                mimetype="application/json",
                status_code=404
            )
        
        # Parse request body
        req_body = req.get_json()
        
        # Update job data (merge with existing data)
        updated_job_data = {
            'id': job_id,
            'company': req_body.get('company', existing_job.get('company')),
            'position': req_body.get('position', existing_job.get('position')),
            'status': req_body.get('status', existing_job.get('status')),
            'location': req_body.get('location', existing_job.get('location', '')),
            'salary': req_body.get('salary', existing_job.get('salary', '')),
            'notes': req_body.get('notes', existing_job.get('notes', '')),
            'appliedDate': req_body.get('appliedDate', existing_job.get('appliedDate')),
            'createdAt': existing_job.get('createdAt'),
            'updatedAt': datetime.utcnow().isoformat()
        }
        
        # Save to database
        updated_job = database.update_job(job_id, updated_job_data)
        
        # Return success response
        return func.HttpResponse(
            body=json.dumps(updated_job),
            mimetype="application/json",
            status_code=200
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