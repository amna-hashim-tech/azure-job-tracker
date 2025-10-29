# Generate random suffix for unique resource names
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# Cosmos DB Account (FREE tier)
resource "azurerm_cosmosdb_account" "main" {
  name                = "${var.cosmos_db_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  # Enable free tier (1000 RU/s, 25GB storage)
  enable_free_tier = true

  tags = var.tags
}

# Cosmos DB Database
resource "azurerm_cosmosdb_sql_database" "main" {
  name                = "jobtracker-db"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

# Cosmos DB Container (Table)
resource "azurerm_cosmosdb_sql_container" "jobs" {
  name                = "jobs"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_path  = "/id"
  throughput          = 400

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }
  }
}

# Storage Account for Function App
resource "azurerm_storage_account" "function" {
  name                     = "st${var.project_name}${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = var.tags
}

# App Service Plan for Functions (Consumption/Free tier)
resource "azurerm_service_plan" "function" {
  name                = "asp-${var.function_app_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = "Y1" # Consumption plan (pay per execution)
  tags                = var.tags
}

# Application Insights for monitoring
resource "azurerm_application_insights" "main" {
  name                = "appi-${var.project_name}-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"
  tags                = var.tags
}

# Azure Function App
resource "azurerm_linux_function_app" "main" {
  name                       = "${var.function_app_name}-${random_string.suffix.result}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  service_plan_id            = azurerm_service_plan.function.id
  storage_account_name       = azurerm_storage_account.function.name
  storage_account_access_key = azurerm_storage_account.function.primary_access_key

  site_config {
    application_stack {
      python_version = "3.11"
    }
    
    cors {
      allowed_origins = ["*"] # In production, restrict this to your frontend domain
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "python"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.main.instrumentation_key
    "COSMOS_DB_ENDPOINT"             = azurerm_cosmosdb_account.main.endpoint
    "COSMOS_DB_KEY"                  = azurerm_cosmosdb_account.main.primary_key
    "COSMOS_DB_DATABASE_NAME"        = azurerm_cosmosdb_sql_database.main.name
    "COSMOS_DB_CONTAINER_NAME"       = azurerm_cosmosdb_sql_container.jobs.name
  }

  tags = var.tags
}

# Static Web App for Frontend (FREE tier)
resource "azurerm_static_web_app" "main" {
  name                = "${var.static_web_app_name}-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = "eastus2" # Static Web Apps have limited regions
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = var.tags
}