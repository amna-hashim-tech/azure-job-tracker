import azure.functions as func
import json
import sys
import os

# Add parent directory to path to import shared modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from shared import database

def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    HTTP GET endpoint to retrieve all job applications
    """
    try:
        # Get all jobs from database
        jobs = database.get_all_jobs()
        
        # Return success response
        return func.HttpResponse(
            body=json.dumps(jobs),
            mimetype="application/json",
            status_code=200
        )
    
    except Exception as e:
        # Return error response
        return func.HttpResponse(
            body=json.dumps({"error": str(e)}),
            mimetype="application/json",
            status_code=500
        )