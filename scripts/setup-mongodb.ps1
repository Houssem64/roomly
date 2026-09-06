<#
  Roomly - Prepare MongoDB pour Prisma, en UNE seule commande.

      npm run db:mongo

  Ce que fait ce script, tout seul :
    1. verifie que MongoDB est bien installe ;
    2. active le mode "replica set" dans mongod.cfg (obligatoire pour Prisma) ;
    3. redemarre le service MongoDB ;
    4. initialise le replica set rs0 et attend qu'il soit PRIMARY.

  Les etapes 2 et 3 demandent les droits administrateur : le script ouvre
  lui-meme une fenetre UAC ("Voulez-vous autoriser...?"). Il suffit de
  cliquer sur Oui. Rien d'autre a faire a la main.

  Le script est reexecutable sans risque : si tout est deja en place, il le
  detecte et ne redemande aucun droit.
#>

[CmdletBinding()]
param(
    # Usage interne : marque le processus relance en administrateur.
    [switch]$ElevatedChild
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

function Write-Step  ($m) { Write-Host "-> $m" -ForegroundColor Cyan }
function Write-Ok    ($m) { Write-Host "OK  $m" -ForegroundColor Green }
function Write-Warn2 ($m) { Write-Host "!   $m" -ForegroundColor Yellow }
function Write-Fail  ($m) { Write-Host "ERREUR : $m" -ForegroundColor Red }

function Test-Admin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    (New-Object Security.Principal.WindowsPrincipal($id)).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-MongoConfig {
    Get-ChildItem "C:\Program Files\MongoDB\Server" -Recurse -Filter "mongod.cfg" -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending | Select-Object -First 1
}

function Get-MongoService {
    Get-Service -Name "MongoDB*" -ErrorAction SilentlyContinue | Select-Object -First 1
}

function Test-ReplicationEnabled ($cfgPath) {
    (Get-Content $cfgPath -Raw) -match '(?m)^\s*replication:\s*$'
}

# ---------------------------------------------------------------------------
#  PARTIE ADMINISTRATEUR
#  Executee uniquement dans la fenetre relancee en tant qu'administrateur.
# ---------------------------------------------------------------------------
if ($ElevatedChild) {
    $cfg = Get-MongoConfig
    if (-not $cfg) { Write-Fail "mongod.cfg introuvable."; exit 1 }

    Write-Host "Fichier de configuration : $($cfg.FullName)"

    if (Test-ReplicationEnabled $cfg.FullName) {
        Write-Host "La replication etait deja activee."
    }
    else {
        $backup = "$($cfg.FullName).roomly-backup"
        if (-not (Test-Path $backup)) {
            Copy-Item $cfg.FullName $backup
            Write-Host "Sauvegarde : $backup"
        }

        $content = Get-Content $cfg.FullName -Raw
        if ($content -match '(?m)^#replication:\s*$') {
            $content = $content -replace '(?m)^#replication:\s*$', "replication:`r`n  replSetName: rs0"
        }
        else {
            $content = $content.TrimEnd() + "`r`n`r`nreplication:`r`n  replSetName: rs0`r`n"
        }
        Set-Content -Path $cfg.FullName -Value $content -Encoding utf8
        Write-Host "Replication activee (replSetName: rs0)."
    }

    $svc = Get-MongoService
    if (-not $svc) { Write-Fail "Service MongoDB introuvable."; exit 1 }

    Write-Host "Redemarrage du service $($svc.Name)..."
    Restart-Service -Name $svc.Name -Force
    Start-Sleep -Seconds 3

    if ((Get-Service -Name $svc.Name).Status -ne 'Running') {
        Write-Fail "Le service n'a pas redemarre."
        exit 1
    }

    Write-Host "Service redemarre."
    exit 0
}

# ---------------------------------------------------------------------------
#  PARTIE NORMALE (sans droits particuliers)
# ---------------------------------------------------------------------------

Write-Host ""
Write-Host "=== Roomly - preparation de MongoDB ===" -ForegroundColor White
Write-Host ""

# --- 1. MongoDB est-il installe ? ------------------------------------------
$cfg = Get-MongoConfig
$svc = Get-MongoService

if (-not $cfg -or -not $svc) {
    Write-Fail "MongoDB ne semble pas installe sur cet ordinateur."
    Write-Host ""
    Write-Host "  Telechargez 'MongoDB Community Server' ici :"
    Write-Host "    https://www.mongodb.com/try/download/community"
    Write-Host "  Installez-le en laissant les options par defaut"
    Write-Host "  (surtout 'Install MongoDB as a Service'), puis relancez :"
    Write-Host "    npm run db:mongo" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Ok "MongoDB detecte  ($($cfg.Directory.Parent.Name), service '$($svc.Name)')"

# --- 2. Activer la replication si besoin (demande les droits admin) --------
function Invoke-ElevatedSetup {
    $log = Join-Path $env:TEMP "roomly-mongo-setup.log"
    if (Test-Path $log) { Remove-Item $log -Force }

    $self  = $PSCommandPath
    $inner = "& '$self' -ElevatedChild *>&1 | Tee-Object -FilePath '$log'"

    Write-Warn2 "Une fenetre Windows va demander l'autorisation : cliquez sur OUI."

    try {
        $p = Start-Process powershell `
                -Verb RunAs `
                -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $inner `
                -WindowStyle Hidden -PassThru -Wait -ErrorAction Stop
    }
    catch {
        Write-Host ""
        Write-Fail "Autorisation refusee - MongoDB n'a pas pu etre configure."
        Write-Host "  Relancez 'npm run db:mongo' et cliquez sur Oui."
        exit 1
    }

    if (Test-Path $log) {
        Get-Content $log | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkGray }
    }

    if ($p.ExitCode -ne 0) {
        Write-Fail "La configuration de MongoDB a echoue (code $($p.ExitCode))."
        Write-Host "  Journal MongoDB : $($cfg.Directory.Parent.FullName)\log\mongod.log"
        exit 1
    }
}

if (Test-ReplicationEnabled $cfg.FullName) {
    Write-Ok "Mode replica set deja active dans mongod.cfg"
}
else {
    Write-Step "Activation du mode replica set (droits administrateur requis)"
    Invoke-ElevatedSetup
    Write-Ok "Configuration appliquee"
}

# --- 3. Attendre que MongoDB reponde ---------------------------------------
Write-Step "Attente de MongoDB sur le port 27017"

$ready = $false
foreach ($i in 1..30) {
    try {
        $c = New-Object Net.Sockets.TcpClient
        $c.Connect("127.0.0.1", 27017)
        $c.Close()
        $ready = $true
        break
    }
    catch { Start-Sleep -Milliseconds 700 }
}

if (-not $ready) {
    Write-Fail "MongoDB ne repond pas sur le port 27017."
    Write-Host "  Verifiez l'etat du service :  Get-Service $($svc.Name)"
    exit 1
}

Write-Ok "MongoDB repond"

# --- 4. Initialiser le replica set -----------------------------------------
Write-Step "Initialisation du replica set rs0"

Push-Location $ProjectRoot
try {
    & node "scripts/init-replica.mjs"
    $initCode = $LASTEXITCODE

    # Cas frequent : mongod.cfg etait deja correct, mais le service tournait
    # encore en mode standalone (machine jamais redemarree depuis). On
    # redemarre le service, puis on reessaie une fois.
    if ($initCode -ne 0) {
        Write-Warn2 "Le serveur tourne encore en mode standalone : redemarrage necessaire."
        Invoke-ElevatedSetup

        foreach ($i in 1..30) {
            try {
                $c = New-Object Net.Sockets.TcpClient
                $c.Connect("127.0.0.1", 27017); $c.Close(); break
            } catch { Start-Sleep -Milliseconds 700 }
        }

        & node "scripts/init-replica.mjs"
        $initCode = $LASTEXITCODE
    }
}
finally { Pop-Location }

if ($initCode -ne 0) {
    Write-Host ""
    Write-Fail "Le replica set n'a pas pu etre initialise."
    exit 1
}

Write-Host ""
Write-Host "=== MongoDB est pret pour Roomly ===" -ForegroundColor Green
Write-Host ""
