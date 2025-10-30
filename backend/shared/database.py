import os
from azure.cosmos import CosmosClient, exceptions

# Get environment variables
COSMOS_ENDPOINT = os.environ.get('COSMOS_DB_ENDPOINT')
COSMOS_KEY = os.environ.get('COSMOS_DB_KEY')
DATABASE_NAME = os.environ.get('COSMOS_DB_DATABASE_NAME')
CONTAINER_NAME = os.environ.get('COSMOS_DB_CONTAINER_NAME')

# Initialize Cosmos client
client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

def get_all_jobs():
    """Retrieve all job applications"""
    try:
        items = list(container.read_all_items())
        return items
    except exceptions.CosmosHttpResponseError as e:
        raise Exception(f"Error retrieving jobs: {str(e)}")

def get_job_by_id(job_id):
    """Retrieve a single job by ID"""
    try:
        item = container.read_item(item=job_id, partition_key=job_id)
        return item
    except exceptions.CosmosResourceNotFoundError:
        return None
    except exceptions.CosmosHttpResponseError as e:
        raise Exception(f"Error retrieving job: {str(e)}")

def create_job(job_data):
    """Create a new job application"""
    try:
        item = container.create_item(body=job_data)
        return item
    except exceptions.CosmosHttpResponseError as e:
        raise Exception(f"Error creating job: {str(e)}")

def update_job(job_id, job_data):
    """Update an existing job application"""
    try:
        # Ensure the id is in the data
        job_data['id'] = job_id
        item = container.upsert_item(body=job_data)
        return item
    except exceptions.CosmosHttpResponseError as e:
        raise Exception(f"Error updating job: {str(e)}")

def delete_job(job_id):
    """Delete a job application"""
    try:
        container.delete_item(item=job_id, partition_key=job_id)
        return True
    except exceptions.CosmosResourceNotFoundError:
        return False
    except exceptions.CosmosHttpResponseError as e:
        raise Exception(f"Error deleting job: {str(e)}")