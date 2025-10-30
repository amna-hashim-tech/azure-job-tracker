// Global state
let allJobs = [];
let editingJobId = null;

// DOM Elements
const jobModal = document.getElementById('jobModal');
const addJobBtn = document.getElementById('addJobBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const jobForm = document.getElementById('jobForm');
const jobsTableBody = document.getElementById('jobsTableBody');
const jobsTable = document.getElementById('jobsTable');
const loadingMessage = document.getElementById('loadingMessage');
const emptyMessage = document.getElementById('emptyMessage');
const searchInput = document.getElementById('searchInput');
const modalTitle = document.getElementById('modalTitle');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    addJobBtn.addEventListener('click', openAddJobModal);
    closeModal.addEventListener('click', closeJobModal);
    cancelBtn.addEventListener('click', closeJobModal);
    jobForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === jobModal) {
            closeJobModal();
        }
    });
}

// Load all jobs from API
async function loadJobs() {
    try {
        showLoading();
        allJobs = await api.getAllJobs();
        renderJobs(allJobs);
        updateStats(allJobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
        alert('Failed to load jobs. Please refresh the page.');
    }
}

// Render jobs in table
function renderJobs(jobs) {
    hideLoading();
    
    if (jobs.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    jobsTableBody.innerHTML = jobs.map(job => `
        <tr>
            <td><strong>${escapeHtml(job.company)}</strong></td>
            <td>${escapeHtml(job.position)}</td>
            <td>${escapeHtml(job.location || 'N/A')}</td>
            <td><span class="status-badge status-${job.status.toLowerCase()}">${escapeHtml(job.status)}</span></td>
            <td>${formatDate(job.appliedDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editJob('${job.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteJob('${job.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update statistics
function updateStats(jobs) {
    document.getElementById('totalJobs').textContent = jobs.length;
    document.getElementById('appliedJobs').textContent = jobs.filter(j => j.status === 'Applied').length;
    document.getElementById('interviewJobs').textContent = jobs.filter(j => j.status === 'Interview').length;
    document.getElementById('offerJobs').textContent = jobs.filter(j => j.status === 'Offer' || j.status === 'Accepted').length;
}

// Open modal for adding new job
function openAddJobModal() {
    editingJobId = null;
    modalTitle.textContent = 'Add New Job Application';
    jobForm.reset();
    jobModal.style.display = 'block';
}

// Open modal for editing job
function editJob(jobId) {
    editingJobId = jobId;
    modalTitle.textContent = 'Edit Job Application';
    
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Populate form with job data
    document.getElementById('company').value = job.company;
    document.getElementById('position').value = job.position;
    document.getElementById('location').value = job.location || '';
    document.getElementById('salary').value = job.salary || '';
    document.getElementById('status').value = job.status;
    document.getElementById('appliedDate').value = job.appliedDate ? job.appliedDate.split('T')[0] : '';
    document.getElementById('notes').value = job.notes || '';
    
    jobModal.style.display = 'block';
}

// Close modal
function closeJobModal() {
    jobModal.style.display = 'none';
    jobForm.reset();
    editingJobId = null;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const jobData = {
        company: document.getElementById('company').value.trim(),
        position: document.getElementById('position').value.trim(),
        location: document.getElementById('location').value.trim(),
        salary: document.getElementById('salary').value.trim(),
        status: document.getElementById('status').value,
        appliedDate: document.getElementById('appliedDate').value || new Date().toISOString(),
        notes: document.getElementById('notes').value.trim()
    };
    
    try {
        if (editingJobId) {
            // Update existing job
            await api.updateJob(editingJobId, jobData);
            alert('Job updated successfully!');
        } else {
            // Create new job
            await api.createJob(jobData);
            alert('Job added successfully!');
        }
        
        closeJobModal();
        await loadJobs();
    } catch (error) {
        console.error('Error saving job:', error);
        alert('Failed to save job. Please try again.');
    }
}

// Delete job
async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job application?')) {
        return;
    }
    
    try {
        await api.deleteJob(jobId);
        alert('Job deleted successfully!');
        await loadJobs();
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        renderJobs(allJobs);
        return;
    }
    
    const filteredJobs = allJobs.filter(job => 
        job.company.toLowerCase().includes(searchTerm) ||
        job.position.toLowerCase().includes(searchTerm) ||
        (job.location && job.location.toLowerCase().includes(searchTerm)) ||
        job.status.toLowerCase().includes(searchTerm)
    );
    
    renderJobs(filteredJobs);
}

// Utility functions
function showLoading() {
    loadingMessage.style.display = 'block';
    jobsTable.style.display = 'none';
    emptyMessage.style.display = 'none';
}

function hideLoading() {
    loadingMessage.style.display = 'none';
}

function showEmptyState() {
    emptyMessage.style.display = 'block';
    jobsTable.style.display = 'none';
}

function hideEmptyState() {
    emptyMessage.style.display = 'none';
    jobsTable.style.display = 'table';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}