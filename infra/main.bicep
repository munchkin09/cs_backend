targetScope = 'resourceGroup'
param environmentName string
param location string
param resourceGroupName string
param NODE_ENV string
param PORT string
param LLM_PROVIDER string
param LLM_API_KEY string
param MONGODB_URI string
param MONGODB_NAME string

var resourcePrefix = 'cs'
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: 'az-${resourcePrefix}-${resourceToken}-plan'
  location: location
  sku: {
    name: 'P1v2'
    tier: 'PremiumV2'
  }
}

resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: 'az-${resourcePrefix}-${resourceToken}-web'
  location: location
  serverFarmId: appServicePlan.id
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {}
  }
  siteConfig: {
    cors: {
      allowedOrigins: ['*']
    }
    appSettings: [
      { name: 'NODE_ENV', value: NODE_ENV },
      { name: 'PORT', value: PORT },
      { name: 'LLM_PROVIDER', value: LLM_PROVIDER },
      { name: 'LLM_API_KEY', value: LLM_API_KEY },
      { name: 'MONGODB_URI', value: MONGODB_URI },
      { name: 'MONGODB_NAME', value: MONGODB_NAME }
    ]
  }
  tags: {
    'azd-service-name': 'cs-backend'
  }
}

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'az-${resourcePrefix}-${resourceToken}-cosmos'
  location: location
  kind: 'MongoDB'
  properties: {
    databaseAccountOfferType: 'Standard'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'az-${resourcePrefix}-${resourceToken}-ai'
  location: location
  kind: 'web'
  applicationType: 'web'
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: 'az-${resourcePrefix}-${resourceToken}-logs'
  location: location
  sku: {
    name: 'PerGB2018'
  }
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'az-${resourcePrefix}-${resourceToken}-diag'
  scope: appService
  properties: {
    workspaceId: logAnalytics.id
  }
}

output RESOURCE_GROUP_ID string = resourceGroup().id
