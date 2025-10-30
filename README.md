# 📋 Azure Job Application Tracker

A full-stack serverless application for tracking job applications, built on Microsoft Azure with Infrastructure as Code, automated CI/CD, and production-ready architecture.

[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🌟 Project Overview

This project demonstrates enterprise-level cloud development practices including:

- ✅ **Infrastructure as Code** with Terraform
- ✅ **Serverless Architecture** with Azure Functions
- ✅ **NoSQL Database** with Azure Cosmos DB
- ✅ **CI/CD Automation** with GitHub Actions
- ✅ **Monitoring & Observability** with Application Insights
- ✅ **Cost Optimization** using free tiers and consumption-based pricing
- ✅ **Professional Documentation** and architecture design

## 🏗️ Architecture

```
User → Azure Static Web Apps (Frontend)
         ↓
     Azure Functions (REST API)
         ↓
     Azure Cosmos DB (Database)
         ↓
     Application Insights (Monitoring)
```

**Key Technologies:**
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python 3.11, Azure Functions
- **Database:** Azure Cosmos DB (NoSQL)
- **Infrastructure:** Terraform
- **CI/CD:** GitHub Actions
- **Monitoring:** Application Insights

[📖 View Detailed Architecture](docs/architecture.md)

## ✨ Features

### User Features
- 📝 Add and track job applications
- ✏️ Update application status (Applied, Interview, Offer, Rejected, Accepted)
- 🗑️ Delete applications
- 🔍 Search and filter jobs
- 📊 Dashboard with application statistics
- 📱 Responsive design (works on mobile)

### Technical Features
- 🔄 Automated infrastructure provisioning
- 🚀 Serverless auto-scaling
- 💰 Cost-optimized (uses free tiers)
- 🔐 Secure API communication
- 📈 Real-time monitoring and logging
- 🔁 Automated deployments via CI/CD

## 🚀 Quick Start

### Prerequisites
- Azure account ([Get free account](https://azure.microsoft.com/free/))
- Azure CLI installed
- Terraform installed
- Git installed

### Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/amna-hashim-tech/azure-job-tracker.git
   cd azure-job-tracker
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Deploy infrastructure**
   ```bash
   cd infrastructure
   terraform init
   terraform plan
   terraform apply
   ```

4. **Deploy application** (via GitHub Actions)
   - Push to `main` branch triggers automatic deployment
   - Or deploy manually using Azure CLI

[📖 View Complete Deployment Guide](docs/deployment.md)

## 💰 Cost Analysis

**Monthly Costs:**
- **Development:** $0.50 - $4.50/month (mostly free tier)
- **Production (Light):** $3 - $6/month
- **Production (Moderate):** $29 - $34/month

**Free Tier Usage:**
- ✅ Cosmos DB: 1000 RU/s, 25GB (FREE forever)
- ✅ Azure Functions: First 1M executions FREE
- ✅ Static Web Apps: Free hosting
- ✅ Application Insights: First 5GB FREE

[📖 View Detailed Cost Analysis](docs/cost-analysis.md)

## 📁 Project Structure

```
azure-job-tracker/
├── .github/workflows/      # CI/CD pipelines
│   ├── terraform.yml       # Infrastructure deployment
│   ├── deploy-backend.yml  # Backend deployment
│   └── deploy-frontend.yml # Frontend deployment
├── infrastructure/         # Terraform IaC
│   ├── main.tf            # Main configuration
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   └── providers.tf       # Provider config
├── backend/               # Azure Functions (API)
│   ├── functions/         # Function endpoints
│   │   ├── GetJobs/      # GET /api/jobs
│   │   ├── CreateJob/    # POST /api/jobs
│   │   ├── UpdateJob/    # PUT /api/jobs/{id}
│   │   └── DeleteJob/    # DELETE /api/jobs/{id}
│   └── shared/           # Shared utilities
│       └── database.py   # Cosmos DB helpers
├── frontend/             # Static Web App
│   └── src/
│       ├── index.html    # Main page
│       ├── styles.css    # Styling
│       ├── app.js        # Application logic
│       └── api.js        # API communication
└── docs/                 # Documentation
    ├── architecture.md   # System design
    ├── deployment.md     # Deployment guide
    └── cost-analysis.md  # Cost breakdown
```

## 🛠️ Technologies Used

### Cloud & Infrastructure
- **Microsoft Azure** - Cloud platform
- **Terraform** - Infrastructure as Code
- **Azure CLI** - Command-line tools

### Backend
- **Azure Functions** - Serverless compute
- **Python 3.11** - Programming language
- **Azure Cosmos DB** - NoSQL database
- **Application Insights** - Monitoring

### Frontend
- **Azure Static Web Apps** - Frontend hosting
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Application logic
- **Fetch API** - HTTP requests

### DevOps
- **GitHub Actions** - CI/CD automation
- **Git** - Version control
- **GitHub** - Code repository

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Retrieve all job applications |
| POST | `/api/jobs` | Create new job application |
| PUT | `/api/jobs/{id}` | Update existing job |
| DELETE | `/api/jobs/{id}` | Delete job application |

## 🔐 Security Features

- HTTPS/TLS encryption for all communication
- Cosmos DB encryption at rest (default)
- Environment variables for secrets
- CORS configuration on API
- Prepared for Azure AD authentication

**Future Enhancements:**
- Azure AD B2C user authentication
- Azure Key Vault for secrets management
- Private endpoints for network isolation
- API key management

## 📈 Monitoring & Observability

**Application Insights tracks:**
- API response times
- Error rates and exceptions
- Request volumes
- Database performance
- Function execution duration

**View in Azure Portal:**
- Live Metrics
- Performance dashboard
- Failure analysis
- Custom queries with KQL

## 🚀 CI/CD Pipeline

**Automated Workflows:**

1. **Infrastructure Pipeline** (`.github/workflows/terraform.yml`)
   - Validates Terraform code
   - Plans infrastructure changes
   - Applies changes to Azure
   - Triggered on changes to `infrastructure/`

2. **Backend Pipeline** (`.github/workflows/deploy-backend.yml`)
   - Installs Python dependencies
   - Deploys to Azure Functions
   - Triggered on changes to `backend/`

3. **Frontend Pipeline** (`.github/workflows/deploy-frontend.yml`)
   - Deploys to Azure Static Web Apps
   - Triggered on changes to `frontend/`

## 🎯 Learning Outcomes

This project demonstrates proficiency in:

✅ **Cloud Architecture** - Designing scalable serverless solutions
✅ **Infrastructure as Code** - Managing infrastructure with Terraform
✅ **DevOps Practices** - Implementing CI/CD automation
✅ **Backend Development** - Building REST APIs with Azure Functions
✅ **Frontend Development** - Creating responsive web applications
✅ **Database Design** - Working with NoSQL databases
✅ **Cost Management** - Optimizing cloud spending
✅ **Documentation** - Writing technical documentation
✅ **Security** - Implementing secure communication
✅ **Monitoring** - Setting up observability

## 🔮 Future Enhancements

### Phase 1: Authentication & Security
- [ ] Implement Azure AD B2C authentication
- [ ] Add user management
- [ ] Move secrets to Azure Key Vault
- [ ] Implement role-based access control

### Phase 2: Features
- [ ] Email notifications for interviews
- [ ] Resume upload (Azure Blob Storage)
- [ ] Export to CSV/PDF
- [ ] Calendar integration

### Phase 3: Advanced
- [ ] Mobile app (React Native)
- [ ] AI-powered resume matching (Azure OpenAI)
- [ ] Job board integration
- [ ] Analytics dashboard

### Phase 4: Enterprise
- [ ] Multi-tenancy support
- [ ] Team collaboration
- [ ] Advanced reporting
- [ ] Admin dashboard

## 📝 Documentation

- [📖 Architecture Documentation](docs/architecture.md) - System design and technical decisions
- [🚀 Deployment Guide](docs/deployment.md) - Step-by-step deployment instructions
- [💰 Cost Analysis](docs/cost-analysis.md) - Detailed cost breakdown and optimization

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Amna Hashim**
- GitHub: [@amna-hashim-tech](https://github.com/amna-hashim-tech)
- Portfolio: [amna-hashim-tech.github.io](https://amna-hashim-tech.github.io/amna-portfolio/)

## 🙏 Acknowledgments

- Built as a portfolio project to demonstrate cloud engineering skills
- Designed for Azure certification (AZ-104, AZ-305) practical application
- Showcases modern DevOps and cloud-native development practices

-

📧 **Questions?** Feel free to open an issue or reach out!