# Atalho Windows para npm run db:setup
param(
  [switch]$Docker
)

$argsList = @()
if ($Docker) { $argsList += '--docker' }

Set-Location (Split-Path $PSScriptRoot -Parent)
node (Join-Path $PSScriptRoot 'db-setup.mjs') @argsList
