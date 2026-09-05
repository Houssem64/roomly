<#
  Roomly - Active le mode "replica set" sur MongoDB local.

  Prisma refuse de fonctionner avec un MongoDB "standalone" : il lui faut
  obligatoirement un replica set (meme avec un seul serveur). Ce script
  ajoute la configuration necessaire puis redemarre le service MongoDB.

  A LANCER UNE SEULE FOIS, EN TANT QU'ADMINISTRATEUR :
    powershell -ExecutionPolicy Bypass -File scripts\setup-mongodb-replicaset.ps1
#>

$ErrorActionPreference = "Stop"

# --- Verifie les droits administrateur -------------------------------------
$identity  = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERREUR : ce script doit etre lance en tant qu'Administrateur." -ForegroundColor Red
    Write-Host "  1. Ouvrez PowerShell avec un clic droit > 'Executer en tant qu'administrateur'"
    Write-Host "  2. Relancez : powershell -ExecutionPolicy Bypass -File scripts\setup-mongodb-replicaset.ps1"
    exit 1
}

# --- Trouve le fichier de configuration de MongoDB -------------------------
$cfg = Get-ChildItem "C:\Program Files\MongoDB\Server" -Recurse -Filter "mongod.cfg" -ErrorAction SilentlyContinue |
       Sort-Object FullName -Descending | Select-Object -First 1

if (-not $cfg) {
    Write-Host "ERREUR : fichier mongod.cfg introuvable. MongoDB est-il installe ?" -ForegroundColor Red
    exit 1
}

Write-Host "Fichier de configuration : $($cfg.FullName)" -ForegroundColor Cyan

# --- Sauvegarde ------------------------------------------------------------
$backup = "$($cfg.FullName).roomly-backup"
if (-not (Test-Path $backup)) {
    Copy-Item $cfg.FullName $backup
    Write-Host "Sauvegarde creee : $backup" -ForegroundColor DarkGray
}

# --- Active la replication -------------------------------------------------
$content = Get-Content $cfg.FullName -Raw

if ($content -match '(?m)^\s*replication:\s*$') {
    Write-Host "La replication est deja activee dans mongod.cfg." -ForegroundColor Yellow
} else {
    # Remplace la ligne commentee "#replication:" si elle existe, sinon ajoute a la fin
    if ($content -match '(?m)^#replication:\s*$') {
        $content = $content -replace '(?m)^#replication:\s*$', "replication:`r`n  replSetName: rs0"
    } else {
        $content = $content.TrimEnd() + "`r`n`r`nreplication:`r`n  replSetName: rs0`r`n"
    }
    Set-Content -Path $cfg.FullName -Value $content -Encoding utf8
    Write-Host "Replication activee (replSetName: rs0)." -ForegroundColor Green
}

# --- Redemarre le service --------------------------------------------------
Write-Host "Redemarrage du service MongoDB..." -ForegroundColor Cyan
Restart-Service -Name MongoDB -Force
Start-Sleep -Seconds 3

$svc = Get-Service -Name MongoDB
if ($svc.Status -ne 'Running') {
    Write-Host "ERREUR : le service MongoDB n'a pas redemarre (etat : $($svc.Status))." -ForegroundColor Red
    Write-Host "Consultez le journal : C:\Program Files\MongoDB\Server\<version>\log\mongod.log"
    exit 1
}

Write-Host ""
Write-Host "OK - MongoDB tourne maintenant en mode replica set." -ForegroundColor Green
Write-Host "Etape suivante (PowerShell normal, dans le dossier du projet) :" -ForegroundColor Cyan
Write-Host "    npm run db:init" -ForegroundColor White
