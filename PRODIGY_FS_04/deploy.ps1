$Source = $PSScriptRoot
$Dest = Join-Path $PSScriptRoot "..\Prodigy-InfoTech-intern\PRODIGY_FS_04"
$Repo = Join-Path $PSScriptRoot "..\Prodigy-InfoTech-intern"

Write-Host "Starting Deployment..." -ForegroundColor Cyan
Write-Host "Source: $Source"
Write-Host "Destination: $Dest"

# 1. Check Repo
if (!(Test-Path -Path $Repo)) {
    Write-Error "Target repository folder '$Repo' not found! Make sure 'Prodigy-InfoTech-intern' exists in 'F:\Aswin's project\Prodigy InfoTech\'."
    exit 1
}

# 2. Sync Files using Robocopy (Direct invocation handles spaces better)
Write-Host "`nSyncing files..." -ForegroundColor Yellow
# robocopy returns exit codes: 0=No Change, 1=Copy Successful, >7=Error
& robocopy "$Source" "$Dest" /E /XO /XD "node_modules" ".git" ".deploy_temp" "dist" ".vscode"

$exitCode = $LASTEXITCODE
if ($exitCode -ge 8) {
    Write-Error "Robocopy failed with exit code $exitCode"
    exit 1
}

# 3. Git Operations
Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
Set-Location "$Repo"

# Pull first
git pull origin main

# Add changes
git add .

# Commit
git commit -m "Add PRODIGY_FS_04: Premium Real-time Chat Application"

# Push
git push origin main

Write-Host "`nDeployment Complete! 🚀" -ForegroundColor Green
Set-Location "$Source"
