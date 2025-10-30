# Azure Cost Analysis

## Overview

This document provides a detailed breakdown of the costs associated with running the Job Application Tracker on Azure. The application is designed to be cost-effective, primarily utilizing free tiers and consumption-based pricing.

## Monthly Cost Breakdown

### Development Environment

| Service | Tier/SKU | Monthly Cost | Notes |
|---------|----------|--------------|-------|
| **Azure Cosmos DB** | Free Tier | **$0** | 1000 RU/s, 25GB storage (FREE forever) |
| **Azure Functions** | Consumption Plan | **$0-2** | First 1M executions FREE, then $0.20 per million |
| **Azure Static Web Apps** | Free Tier | **$0** | Unlimited bandwidth on free tier |
| **Application Insights** | Free Tier | **$0-1** | First 5GB/month FREE, then $2.30/GB |
| **Storage Account** | Standard LRS | **$0.50** | ~20GB for Function App |
| **Bandwidth** | Standard | **$0-1** | First 100GB outbound FREE |
| **Total (Development)** | | **$0.50 - $4.50/month** | |

### Production Environment (Light Usage)

Assuming 10,000 page views and 50,000 API calls per month:

| Service | Tier/SKU | Monthly Cost | Calculation |
|---------|----------|--------------|-------------|
| **Azure Cosmos DB** | Free Tier | **$0** | Free tier covers this usage |
| **Azure Functions** | Consumption Plan | **$0** | 50K calls < 1M free executions |
| **Azure Static Web Apps** | Free Tier | **$0** | Covered by free tier |
| **Application Insights** | Standard | **$2-5** | ~3GB telemetry data |
| **Storage Account** | Standard LRS | **$1** | ~50GB total |
| **Bandwidth** | Standard | **$0** | < 100GB outbound |
| **Total (Production - Light)** | | **$3 - $6/month** | |

### Production Environment (Moderate Usage)

Assuming 100,000 page views and 500,000 API calls per month:

| Service | Tier/SKU | Monthly Cost | Calculation |
|---------|----------|--------------|-------------|
| **Azure Cosmos DB** | Provisioned (400 RU/s)* | **$0** | Still within free tier |
| **Azure Functions** | Consumption Plan | **$0** | 500K calls < 1M free |
| **Azure Static Web Apps** | Standard Tier | **$9** | Advanced features |
| **Application Insights** | Standard | **$10-15** | ~8GB telemetry |
| **Storage Account** | Standard LRS | **$2** | ~100GB |
| **Bandwidth** | Standard | **$8** | ~200GB outbound @ $0.08/GB |
| **Total (Production - Moderate)** | | **$29 - $34/month** | |

*Free tier remains $0 up to 1000 RU/s

### Production Environment (High Usage)

Assuming 1M page views and 5M API calls per month:

| Service | Tier/SKU | Monthly Cost | Calculation |
|---------|----------|--------------|-------------|
| **Azure Cosmos DB** | Provisioned (1000 RU/s) | **$0** | Free tier limit |
| **Azure Functions** | Consumption Plan | **$1** | 5M calls × $0.20/M |
| **Azure Static Web Apps** | Standard Tier | **$9** | Standard tier |
| **Application Insights** | Standard | **$35-45** | ~20GB telemetry |
| **Storage Account** | Standard LRS | **$5** | ~250GB |
| **Bandwidth** | Standard | **$80** | ~1TB outbound @ $0.08/GB |
| **Total (Production - High)** | | **$130 - $140/month** | |

## Detailed Service Pricing

### Azure Cosmos DB

**Free Tier (Per Account):**
- 1000 RU/s provisioned throughput
- 25 GB storage
- Available forever (not trial)

**Beyond Free Tier:**
- Standard: $0.008/hour per 100 RU/s ($5.76/month per 100 RU/s)
- Autoscale: $0.012/hour per 100 RU/s
- Storage: $0.25/GB/month

**Our Usage:**
- Current: 400 RU/s (within free tier)
- Can handle ~10,000 operations/day easily
- Storage well under 25GB limit

### Azure Functions (Consumption Plan)

**Pricing:**
- First 1,000,000 executions: **FREE**
- After that: $0.20 per million executions
- Memory: $0.000016/GB-second

**Execution Time:**
- First 400,000 GB-s: **FREE**
- After that: $0.000016/GB-s

**Our Usage:**
- Average execution: 200ms
- Memory: 512MB (0.5GB)
- 50K calls/month = well within free tier

**Example Calculation (5M calls/month):**
```
Executions: (5M - 1M) × $0.20/M = $0.80
Memory: 5M × 0.2s × 0.5GB = 500K GB-s
Cost: (500K - 400K) × $0.000016 = $1.60
Total: $2.40/month
```

### Azure Static Web Apps

**Free Tier:**
- 100 GB bandwidth/month
- Custom domains
- Free SSL certificates
- Automatic deployments
- **Perfect for our use case**

**Standard Tier ($9/month):**
- Increased bandwidth
- Custom authentication providers
- Advanced routing
- SLA guarantee

**Our Usage:**
- Development: Free tier sufficient
- Production (light): Free tier sufficient
- Production (moderate+): Consider Standard

### Application Insights

**Free Tier:**
- First 5 GB/month: **FREE**
- Includes basic features

**Standard Pricing:**
- $2.30/GB after first 5GB
- 90-day data retention

**Our Usage:**
- Development: < 1GB/month
- Production (light): 2-4GB/month
- Production (moderate): 8-12GB/month

**Optimization Tips:**
- Sample telemetry (reduce volume)
- Set retention to 30 days
- Filter unnecessary events

### Storage Account

**Standard LRS:**
- Storage: $0.0184/GB/month (first 50GB)
- Transactions: $0.004 per 10,000 operations

**Our Usage:**
- Function App storage: 10-20GB
- Minimal transactions
- Cost: $0.50-2/month

### Bandwidth (Data Transfer)

**Pricing:**
- First 100 GB/month: **FREE**
- Next 10 TB: $0.087/GB
- Next 40 TB: $0.083/GB

**Our Usage:**
- Frontend (Static Web Apps): Included
- Backend responses: ~50-200GB/month
- Cost: $0-15/month depending on traffic

## Cost Optimization Strategies

### 1. Leverage Free Tiers

✅ **Already Implemented:**
- Cosmos DB free tier (1000 RU/s)
- Functions free executions (1M/month)
- Static Web Apps free hosting
- Application Insights free data (5GB)

### 2. Optimize Cosmos DB

**Current Setup:**
- Using free tier (400 RU/s)
- Session consistency (cheaper than Strong)
- Efficient partition key strategy

**Further Optimization:**
- Use serverless Cosmos DB for unpredictable workloads
- Implement caching for frequently read data
- Optimize queries with composite indexes
- Archive old data to cheaper storage

### 3. Optimize Azure Functions

**Current Setup:**
- Consumption plan (pay per use)
- Efficient code execution

**Further Optimization:**
- Minimize cold starts (keep functions warm)
- Reduce function execution time
- Batch operations where possible
- Use async patterns
- Implement connection pooling

### 4. Optimize Application Insights

**Strategies:**
- Enable sampling (collect only 10-20% of telemetry)
- Filter out noisy events
- Reduce retention period to 30 days
- Use log aggregation

**Implementation:**
```json
{
  "applicationInsights": {
    "samplingSettings": {
      "isEnabled": true,
      "maxTelemetryItemsPerSecond": 20
    }
  }
}
```

### 5. Right-Size Resources

**Review Monthly:**
- Cosmos DB RU/s utilization
- Function execution patterns
- Storage account usage
- Bandwidth consumption

**Adjust as Needed:**
- Scale down during low-traffic periods
- Scale up during peak times
- Delete unused resources

### 6. Use Azure Reservations

**For Production:**
- Reserve Cosmos DB capacity (save 20-65%)
- Requires 1-3 year commitment
- Best for stable workloads

### 7. Implement Budget Alerts

**Setup:**
```bash
# Create budget alert
az consumption budget create \
  --budget-name "JobTracker-Monthly" \
  --amount 50 \
  --time-grain Monthly \
  --start-date 2024-01-01
```

**Alert Thresholds:**
- 50% of budget: Warning
- 80% of budget: Critical
- 100% of budget: Auto-shutdown

## Cost Comparison

### Alternative Architectures

| Architecture | Monthly Cost (Moderate Usage) | Pros | Cons |
|-------------|------------------------------|------|------|
| **Current (Serverless)** | **$29-34** | Cost-effective, auto-scaling, minimal ops | Cold starts, vendor lock-in |
| **VMs + SQL Database** | $150-200 | Full control, no cold starts | Higher cost, requires management |
| **Container Apps + PostgreSQL** | $80-120 | Portable, modern | More complex, higher cost |
| **App Service + SQL** | $100-150 | Traditional, familiar | Less cost-effective, fixed pricing |

**Winner:** Serverless architecture for this use case

### Cloud Provider Comparison

| Provider | Equivalent Stack | Est. Monthly Cost |
|----------|------------------|-------------------|
| **Azure** | Functions + Cosmos DB + Static Web Apps | **$29-34** |
| AWS | Lambda + DynamoDB + S3 + CloudFront | $35-45 |
| GCP | Cloud Functions + Firestore + Cloud Storage | $30-40 |

**Azure is cost-competitive, especially with free tiers.**

## ROI Analysis

### Development Investment

| Item | Hours | Value |
|------|-------|-------|
| Infrastructure Setup | 8 | Learning IaC |
| Backend Development | 12 | Python + Serverless skills |
| Frontend Development | 8 | Full-stack experience |
| CI/CD Setup | 4 | DevOps skills |
| Documentation | 4 | Communication skills |
| **Total** | **36 hours** | **Portfolio project + Skills** |

### Monthly Running Cost vs. Value

**Cost:** $0.50 - $34/month (depending on usage)

**Value:**
- Portfolio demonstration project
- Interview talking points
- Hands-on cloud experience
- Proof of DevOps skills
- **ROI: Priceless for job search**

## Budget Recommendations

### Personal/Portfolio Use
**Budget:** $10/month
- Covers development and demo
- Enough for recruiters to view
- Can scale down when not demoing

### Production (Personal Use)
**Budget:** $30/month
- Handle moderate traffic
- Room for growth
- Monitoring and insights

### Production (Small Business)
**Budget:** $100/month
- Handle significant traffic
- High availability
- Advanced features
- Multiple environments

## Monitoring Costs

### Azure Cost Management

**View Costs:**
1. Azure Portal → Cost Management + Billing
2. Cost Analysis → View by service
3. Download detailed CSV reports

**Forecast:**
- Azure provides cost forecasts
- Based on current usage trends
- Helps with budget planning

### Setting Up Alerts

```bash
# Create cost alert
az monitor action-group create \
  --name "CostAlerts" \
  --short-name "CostAlert" \
  --email-receiver name="Admin" address="your@email.com"
```

## Conclusion

The Job Application Tracker is designed to be **highly cost-effective**:

✅ **Development:** $0.50 - $4.50/month (mostly free tier)
✅ **Production (Light):** $3 - $6/month
✅ **Production (Moderate):** $29 - $34/month

**Key Advantages:**
- Leverages Azure free tiers extensively
- Consumption-based pricing (pay for what you use)
- Easy to scale up or down
- No upfront costs
- Can run entirely on free tier for portfolio purposes

**For job search purposes:** This project demonstrates cost-consciousness and cloud financial management skills - valuable for any cloud role.