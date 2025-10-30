// API Base URL - Update this after deployment
const API_BASE_URL = '/api';

// API Helper Functions
const api = {
    /**
     * Get all job applications
     */
    async getAllJobs() {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs`);
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    /**
     * Create a new job application
     */
    async createJob(jobData) {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create job');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    },

    /**
     * Update an existing job application
     */
    async updateJob(jobId, jobData) {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update job');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    },

    /**
     * Delete a job application
     */
    async deleteJob(jobId) {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete job');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    }
};