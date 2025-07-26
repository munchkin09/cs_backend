# =======================================================
# 🔧 Fix Service Principal for Azure Container Registry
# =======================================================

Write-Host "🔧 Fixing Azure Service Principal configuration..." -ForegroundColor Yellow

# Variables
$CLIENT_ID = "0cb048be-a98e-4bc3-bbcb-6e27ffe313d4"
$SUBSCRIPTION_ID = "d1f58671-1a84-413c-9ab9-d732aa843169"
$RESOURCE_GROUP = "cs_analyzer_dev"
$REGISTRY_NAME = "csanalyzer"

# =======================================================
# 1. Verificar login a Azure
# =======================================================

Write-Host "`n📋 Step 1: Checking Azure login..." -ForegroundColor Cyan

try {
    $account = az account show | ConvertFrom-Json
    Write-Host "✅ Logged in as: $($account.user.name)" -ForegroundColor Green
    Write-Host "✅ Subscription: $($account.name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# =======================================================
# 2. Crear Service Principal desde la aplicación existente
# =======================================================

Write-Host "`n🔧 Step 2: Creating Service Principal..." -ForegroundColor Cyan

try {
    # Intentar crear el Service Principal
    az ad sp create --id $CLIENT_ID
    Write-Host "✅ Service Principal created successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Service Principal might already exist, continuing..." -ForegroundColor Yellow
}

# =======================================================
# 3. Verificar que el Service Principal existe
# =======================================================

Write-Host "`n🔍 Step 3: Verifying Service Principal..." -ForegroundColor Cyan

try {
    $sp = az ad sp show --id $CLIENT_ID | ConvertFrom-Json
    Write-Host "✅ Service Principal found:" -ForegroundColor Green
    Write-Host "   App ID: $($sp.appId)" -ForegroundColor White
    Write-Host "   Display Name: $($sp.displayName)" -ForegroundColor White
    Write-Host "   Object ID: $($sp.id)" -ForegroundColor White
} catch {
    Write-Host "❌ Service Principal not found. Check the CLIENT_ID." -ForegroundColor Red
    exit 1
}

# =======================================================
# 4. Asignar permisos al Container Registry
# =======================================================

Write-Host "`n🔐 Step 4: Assigning ACR permissions..." -ForegroundColor Cyan

$acrScope = "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$REGISTRY_NAME"

try {
    # Asignar rol AcrPush
    az role assignment create `
        --assignee $CLIENT_ID `
        --role "AcrPush" `
        --scope $acrScope
    Write-Host "✅ AcrPush role assigned successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  AcrPush role might already be assigned, continuing..." -ForegroundColor Yellow
}

try {
    # Asignar rol AcrPull (para deployment)
    az role assignment create `
        --assignee $CLIENT_ID `
        --role "AcrPull" `
        --scope $acrScope
    Write-Host "✅ AcrPull role assigned successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  AcrPull role might already be assigned, continuing..." -ForegroundColor Yellow
}

# =======================================================
# 5. Verificar permisos asignados
# =======================================================

Write-Host "`n✅ Step 5: Verifying permissions..." -ForegroundColor Cyan

$assignments = az role assignment list --assignee $CLIENT_ID --output json | ConvertFrom-Json

if ($assignments.Count -gt 0) {
    Write-Host "✅ Role assignments found:" -ForegroundColor Green
    foreach ($assignment in $assignments) {
        Write-Host "   Role: $($assignment.roleDefinitionName)" -ForegroundColor White
        Write-Host "   Scope: $($assignment.scope)" -ForegroundColor White
        Write-Host ""
    }
} else {
    Write-Host "❌ No role assignments found!" -ForegroundColor Red
    exit 1
}

# =======================================================
# 6. Test ACR access
# =======================================================

Write-Host "`n🧪 Step 6: Testing ACR access..." -ForegroundColor Cyan

try {
    az acr login --name $REGISTRY_NAME
    Write-Host "✅ ACR login successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ ACR login failed!" -ForegroundColor Red
    exit 1
}

# =======================================================
# 7. Generar secretos para GitHub
# =======================================================

Write-Host "`n🔑 Step 7: GitHub Secrets Configuration" -ForegroundColor Cyan
Write-Host "Configure these secrets in your GitHub repository:" -ForegroundColor Yellow
Write-Host ""
Write-Host "AZURE_CLIENT_ID:" -ForegroundColor White -NoNewline
Write-Host " $CLIENT_ID" -ForegroundColor Green
Write-Host "AZURE_TENANT_ID:" -ForegroundColor White -NoNewline
Write-Host " $($account.tenantId)" -ForegroundColor Green
Write-Host "AZURE_SUBSCRIPTION_ID:" -ForegroundColor White -NoNewline
Write-Host " $SUBSCRIPTION_ID" -ForegroundColor Green
Write-Host "AZURE_CLIENT_SECRET:" -ForegroundColor White -NoNewline
Write-Host " [Needs to be generated separately]" -ForegroundColor Red

Write-Host "`n⚠️  IMPORTANT: You need to generate a client secret separately:" -ForegroundColor Yellow
Write-Host "az ad app credential reset --id $CLIENT_ID --display-name 'GitHub Actions Secret'" -ForegroundColor White

Write-Host "`n🎉 Service Principal configuration completed!" -ForegroundColor Green
Write-Host "🚀 Your GitHub Actions should now work correctly." -ForegroundColor Green

# =======================================================
# 8. Opcional: Crear client secret
# =======================================================

Write-Host "`n❓ Do you want to generate a new client secret now? (y/n): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`n🔑 Generating client secret..." -ForegroundColor Cyan
    try {
        $secret = az ad app credential reset --id $CLIENT_ID --display-name "GitHub Actions Secret" | ConvertFrom-Json
        Write-Host "✅ Client secret generated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔐 AZURE_CLIENT_SECRET:" -ForegroundColor White -NoNewline
        Write-Host " $($secret.password)" -ForegroundColor Red
        Write-Host ""
        Write-Host "⚠️  SAVE THIS SECRET NOW! It will not be shown again." -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Failed to generate client secret." -ForegroundColor Red
    }
}

Write-Host "`n✅ All done! Your Azure setup is ready for GitHub Actions." -ForegroundColor Green
