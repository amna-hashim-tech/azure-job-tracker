import azure.functions as func
import json
import sys
import os

# Add parent directory to path to import shared modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from shared import database

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP DELETE endpoint to delete a job application
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
        
        # Delete the job
        deleted = database.delete_job(job_id)
        
        if not deleted:
            return func.HttpResponse(
                body=json.dumps({"error": "Job not found"}),
                mimetype="application/json",
                status_code=404
            )
        
        # Return success response
        return func.HttpResponse(
            body=json.dumps({"message": "Job deleted successfully", "id": job_id}),
            mimetype="application/json",
            status_code=200
        )
    
    except Exception as e:
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )