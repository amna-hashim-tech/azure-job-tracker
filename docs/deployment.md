# Deployment Guide

This guide walks you through deploying the Job Application Tracker to Azure.

## Prerequisites

### Required Tools
- **Azure CLI** - [Install here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Terraform** (v1.0+) - [Install here](https://www.terraform.io/downloads)
- **Git** - [Install here](https://git-scm.com/downloads)
- **GitHub Account** - [Sign up here](https://github.com)
- **Azure Account** - [Sign up here](https://azure.microsoft.com/free/)

### Azure Subscription
- Active Azure subscription (free tier works)
- Contributor or Owner role on subscription

## Deployment Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/amna-hashim-tech/azure-job-tracker.git
cd azure-job-tracker
```

### Step 2: Login to Azure

```bash
az login
```

This opens a browser for authentication. Select your Azure subscription.

```bash
# Set the subscription (if you have multiple)
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Verify
az account show
```

### Step 3: Create Service Principal for Terraform

Terraform needs credentials to create Azure resources.

```bash
az ad sp create-for-rbac --name "terraform-jobtracker" --role="Contributor" --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
```

This outputs:
```json
{
  "appId": "xxxxx",
  "displayName": "terraform-jobtracker",
  "password": "xxxxx",
  "tenant": "xxxxx"
}
```

**Save these values!** You'll need them for GitHub Secrets.

### Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Value | Source |
|------------|-------|--------|
| `AZURE_CLIENT_ID` | appId from Step 3 | Service Principal |
| `AZURE_CLIENT_SECRET` | password from Step 3 | Service Principal |
| `AZURE_SUBSCRIPTION_ID` | Your subscription ID | `az account show` |
| `AZURE_TENANT_ID` | tenant from Step 3 | Service Principal |

### Step 5: Deploy Infrastructure with Terraform

#### Option A: Using GitHub Actions (Recommended)

1. Push changes to `main` branch (infrastructure changes)
2. GitHub Actions automatically runs Terraform
3. Check Actions tab for progress

#### Option B: Manual Deployment

```bash
cd infrastructure

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply
```

Enter `yes` when prompted.

**This creates:**
- Resource Group
- Cosmos DB (FREE tier)
- Azure Functions
- Static Web App
- Application Insights
- Storage Account

**Time**: 5-10 minutes

### Step 6: Configure Backend Deployment

After infrastructure is created, get the Function App name:

```bash
terraform output function_app_name
```

Get the publish profile:

```bash
az functionapp deployment list-publishing-profiles \
  --name YOUR_FUNCTION_APP_NAME \
  --resource-group rg-jobtracker-dev \
  --xml
```

Add to GitHub Secrets:
- `AZURE_FUNCTION_APP_NAME`: Function app name
- `AZURE_FUNCTION_PUBLISH_PROFILE`: Full XML output from above command

### Step 7: Configure Frontend Deployment

Get the Static Web App API token:

```bash
terraform output static_web_app_api_key
```

Add to GitHub Secrets:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: The token from above

### Step 8: Deploy Backend and Frontend

#### Option A: Trigger GitHub Actions

Push changes to trigger automatic deployment:

```bash
git add .
git commit -m "Trigger deployment"
git push
```

#### Option B: Manual Deployment

**Backend:**
```bash
cd backend
func azure functionapp publish YOUR_FUNCTION_APP_NAME
```

**Frontend:**
```bash
# Frontend deploys automatically via Static Web Apps
```

### Step 9: Verify Deployment

Get your application URLs:

```bash
cd infrastructure
terraform output function_app_url
terraform output static_web_app_url
```

**Test the frontend:**
1. Open the Static Web App URL in browser
2. You should see the Job Tracker interface

**Test the backend:**
```bash
curl https://YOUR_FUNCTION_APP.azurewebsites.net/api/jobs
```

Should return `[]` (empty array) initially.

### Step 10: Update Frontend API Configuration

The frontend needs to know where the backend is.

Edit `frontend/src/api.js`:

```javascript
// Change this line:
const API_BASE_URL = '/api';

// To your actual Function App URL:
const API_BASE_URL = 'https://YOUR_FUNCTION_APP.azurewebsites.net/api';
```

Commit and push:
```bash
git add frontend/src/api.js
git commit -m "Update API URL"
git push
```

## Post-Deployment Configuration

### Enable Application Insights

Application Insights is already configured. View metrics:

1. Go to Azure Portal
2. Navigate to Application Insights resource
3. View Live Metrics, Performance, Failures

### Set Up Budget Alerts

1. Go to Azure Portal → Cost Management + Billing
2. Create budget for monthly limit (e.g., $10)
3. Set alert threshold at 80%

### Configure Custom Domain (Optional)

For Static Web App:

1. Azure Portal → Static Web Apps → Custom domains
2. Add your domain
3. Configure DNS records
4. SSL certificate auto-generated

## Troubleshooting

### Issue: Terraform fails with authentication error

**Solution:**
- Verify service principal credentials in GitHub Secrets
- Check subscription ID is correct
- Ensure service principal has Contributor role

### Issue: Function App deployment fails

**Solution:**
- Check publish profile is correct
- Verify Function App name in secrets
- Check Python version (must be 3.11)

### Issue: Frontend can't connect to backend

**Solution:**
- Update API_BASE_URL in `frontend/src/api.js`
- Check CORS settings on Function App
- Verify Function App is running

### Issue: Cosmos DB throttling

**Solution:**
- Check RU/s allocation (should be 400)
- Review Application Insights for 429 errors
- Consider increasing throughput if needed

## CI/CD Workflows

### Terraform Workflow
- **Trigger**: Push to `infrastructure/` folder
- **Actions**: Validate → Plan → Apply
- **Time**: ~5 minutes

### Backend Workflow
- **Trigger**: Push to `backend/` folder
- **Actions**: Install dependencies → Deploy to Functions
- **Time**: ~3 minutes

### Frontend Workflow
- **Trigger**: Push to `frontend/` folder
- **Actions**: Build → Deploy to Static Web Apps
- **Time**: ~2 minutes

## Updating the Application

### Update Infrastructure
```bash
# Edit Terraform files
cd infrastructure
vim main.tf

# Commit and push
git add .
git commit -m "Update infrastructure"
git push  # GitHub Actions deploys automatically
```

### Update Backend
```bash
# Edit Python code
cd backend
vim functions/GetJobs/__init__.py

# Commit and push
git add .
git commit -m "Update backend logic"
git push  # GitHub Actions deploys automatically
```

### Update Frontend
```bash
# Edit HTML/CSS/JS
cd frontend/src
vim app.js

# Commit and push
git add .
git commit -m "Update frontend"
git push  # GitHub Actions deploys automatically
```

## Destroying Resources

### Using Terraform

```bash
cd infrastructure
terraform destroy
```

Enter `yes` when prompted.

**Warning**: This deletes ALL resources including data!

### Manual Cleanup

```bash
az group delete --name rg-jobtracker-dev --yes
```

## Cost Management

### Monitor Costs
```bash
az consumption usage list --start-date 2024-01-01 --end-date 2024-01-31
```

### Optimize Costs
- Use free tiers where possible
- Stop Function Apps when not in use (dev environment)
- Monitor Cosmos DB RU/s consumption
- Delete unused resources

## Security Best Practices

### Production Deployment Checklist

- [ ] Enable Azure AD authentication
- [ ] Restrict Function App to specific origins (CORS)
- [ ] Move secrets to Azure Key Vault
- [ ] Enable firewall on Cosmos DB
- [ ] Set up private endpoints
- [ ] Enable Azure DDoS protection
- [ ] Configure WAF on Application Gateway
- [ ] Implement rate limiting
- [ ] Enable audit logging
- [ ] Set up security alerts

## Backup and Recovery

### Cosmos DB Backup
- Automatic backups enabled (7-day retention)
- Point-in-time restore available
- No manual action needed

### Infrastructure Recovery
```bash
# Infrastructure can be recreated with Terraform
cd infrastructure
terraform apply
```

### Data Export
```bash
# Export data from Cosmos DB
az cosmosdb sql container export \
  --account-name YOUR_COSMOS_ACCOUNT \
  --database-name jobtracker-db \
  --name jobs \
  --output-path ./backup.json
```

## Support and Resources

- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Next Steps

1. ✅ Deploy infrastructure
2. ✅ Deploy backend and frontend
3. ⏭️ Configure custom domain
4. ⏭️ Enable authentication
5. ⏭️ Add monitoring alerts
6. ⏭️ Implement additional features