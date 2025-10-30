# System Architecture

## Overview
The Job Application Tracker is a full-stack serverless application built on Microsoft Azure. It demonstrates modern cloud architecture patterns including Infrastructure as Code, serverless computing, and automated CI/CD deployment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Static Web Apps (Frontend)                │
│  - HTML/CSS/JavaScript                                       │
│  - Global CDN                                                │
│  - Free Tier                                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ REST API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Azure Functions (Serverless Backend)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   GetJobs    │  │  CreateJob   │  │  UpdateJob   │      │
│  │  (GET /api)  │  │ (POST /api)  │  │ (PUT /api)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐                                           │
│  │  DeleteJob   │                                           │
│  │(DELETE /api) │                                           │
│  └──────────────┘                                           │
│                                                              │
│  - Python 3.11                                              │
│  - Consumption Plan (Pay-per-execution)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Cosmos DB SDK
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Cosmos DB (NoSQL Database)                │
│  - Document Database                                         │
│  - Free Tier (1000 RU/s, 25GB)                              │
│  - Global Distribution Ready                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           Application Insights (Monitoring)                  │
│  - Request tracking                                          │
│  - Error logging                                             │
│  - Performance metrics                                       │
│  - Free Tier (5GB/month)                                    │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Technology**: HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: Azure Static Web Apps
- **Features**: 
  - Responsive design
  - Real-time job management
  - Search and filter functionality
  - Modern UI with animations

### Backend
- **Runtime**: Python 3.11
- **Platform**: Azure Functions (Serverless)
- **API Design**: RESTful
- **Endpoints**:
  - `GET /api/jobs` - Retrieve all jobs
  - `POST /api/jobs` - Create new job
  - `PUT /api/jobs/{id}` - Update existing job
  - `DELETE /api/jobs/{id}` - Delete job

### Database
- **Service**: Azure Cosmos DB
- **API**: SQL API (Document Database)
- **Data Model**: JSON documents
- **Partition Key**: Job ID
- **Consistency**: Session level

### Infrastructure
- **IaC Tool**: Terraform
- **Provider**: Azure (azurerm)
- **State Management**: Local (can be migrated to remote backend)

### CI/CD
- **Platform**: GitHub Actions
- **Workflows**:
  - Infrastructure deployment (Terraform)
  - Backend deployment (Azure Functions)
  - Frontend deployment (Static Web Apps)

### Monitoring
- **Service**: Application Insights
- **Features**:
  - Request telemetry
  - Dependency tracking
  - Exception logging
  - Custom metrics

## Design Decisions

### Why Serverless?
- **Cost-effective**: Pay only for actual usage
- **Auto-scaling**: Handles traffic spikes automatically
- **No server management**: Focus on code, not infrastructure
- **Perfect for APIs**: Event-driven, stateless design

### Why Cosmos DB?
- **Free tier available**: 1000 RU/s sufficient for this application
- **NoSQL flexibility**: Easy to evolve data schema
- **Global distribution**: Can scale globally if needed
- **High performance**: Low-latency reads and writes

### Why Static Web Apps?
- **Free hosting**: Perfect for frontend applications
- **Global CDN**: Fast delivery worldwide
- **Built-in CI/CD**: Integrated with GitHub
- **Custom domains**: Easy to add

### Why Terraform?
- **Infrastructure as Code**: Version-controlled infrastructure
- **Repeatability**: Deploy same setup multiple times
- **Documentation**: Code documents the infrastructure
- **Multi-cloud**: Skills transferable to other clouds

## Security Considerations

### Authentication
- Currently using anonymous authentication for demo purposes
- Production deployment should implement:
  - Azure AD B2C for user authentication
  - API key management
  - Role-based access control (RBAC)

### Data Security
- **In Transit**: All communication over HTTPS/TLS
- **At Rest**: Cosmos DB encryption enabled by default
- **Secrets Management**: Environment variables in Function App
- **Future Enhancement**: Azure Key Vault for secrets

### Network Security
- CORS configured on Function App
- Static Web Apps behind global CDN with DDoS protection
- Future: Private endpoints for enhanced security

## Scalability

### Current Capacity
- **Cosmos DB**: 400 RU/s (can handle ~4000 operations/sec)
- **Functions**: Auto-scales based on demand
- **Static Web Apps**: Global CDN with unlimited bandwidth

### Scaling Strategy
1. **Vertical Scaling**: Increase Cosmos DB throughput
2. **Horizontal Scaling**: Functions auto-scale automatically
3. **Geographic Distribution**: Deploy to multiple regions
4. **Caching**: Add Redis cache for frequently accessed data

## High Availability

### Built-in HA Features
- **Functions**: Deploy to availability zones
- **Cosmos DB**: Multi-region replication available
- **Static Web Apps**: Globally distributed CDN

### Disaster Recovery
- **Backup**: Cosmos DB automatic backups (7-day retention)
- **Recovery**: Point-in-time restore available
- **Infrastructure**: Terraform allows quick re-deployment

## Monitoring and Observability

### Metrics Tracked
- API response times
- Error rates
- Request volumes
- Database performance
- Function execution duration

### Alerting
- Failed requests > threshold
- High response times
- Database throttling
- Budget alerts for cost management

## Future Enhancements

### Phase 1 (Security & Auth)
- Implement Azure AD B2C authentication
- Add user management
- Implement authorization (users see only their data)
- Move secrets to Azure Key Vault

### Phase 2 (Features)
- Email notifications for interview reminders
- Resume upload and storage (Azure Blob Storage)
- Job application analytics dashboard
- Export data to CSV/PDF

### Phase 3 (Advanced)
- Mobile app (React Native or Flutter)
- Integration with LinkedIn API
- AI-powered resume matching
- Job board scraping and auto-import

### Phase 4 (Enterprise)
- Multi-tenancy support
- Team collaboration features
- Admin dashboard
- Advanced reporting and analytics

## Performance Optimization

### Current Optimizations
- Serverless architecture (no cold start for frequently accessed functions)
- Global CDN for frontend delivery
- Indexed queries in Cosmos DB
- Minimal JavaScript bundle size

### Future Optimizations
- Implement caching layer (Azure Redis Cache)
- Optimize Cosmos DB queries with composite indexes
- Lazy loading for large datasets
- Image optimization for profile pictures

## Cost Optimization

### Current Strategy
- Using free tiers wherever possible
- Consumption-based pricing (pay per use)
- Auto-shutdown of unused resources
- Rightsizing Cosmos DB throughput

### Estimated Monthly Cost
- **Development**: $0-5/month (mostly free tier)
- **Production (light usage)**: $10-20/month
- **Production (moderate usage)**: $50-100/month

See `cost-analysis.md` for detailed breakdown.