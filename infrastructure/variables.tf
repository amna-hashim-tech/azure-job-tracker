variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "jobtracker"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-jobtracker-dev"
}

variable "cosmos_db_name" {
  description = "Name of Cosmos DB account"
  type        = string
  default     = "cosmos-jobtracker"
}

variable "function_app_name" {
  description = "Name of the Azure Function App"
  type        = string
  default     = "func-jobtracker"
}

variable "static_web_app_name" {
  description = "Name of the Static Web App"
  type        = string
  default     = "swa-jobtracker"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "JobTracker"
    Environment = "Development"
    ManagedBy   = "Terraform"
  }
}