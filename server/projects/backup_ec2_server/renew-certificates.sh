#!/bin/bash

# SSL Certificate Auto-Renewal Script
# This script renews Let's Encrypt certificates and reloads nginx if needed

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

LOG_FILE="${SCRIPT_DIR}/cert-renewal.log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting certificate renewal check..."

# Check if another certbot instance is running
if docker ps | grep -q certbot; then
    log "WARNING: Another certbot container is running. Waiting 30 seconds..."
    sleep 30
fi

# Run certbot renew
# --quiet: Only output errors
# --no-random-sleep-on-renew: Don't wait random time (useful for cron)
# --non-interactive: Don't prompt for user input
RENEW_OUTPUT=$(docker-compose run --rm certbot renew --quiet --no-random-sleep-on-renew --non-interactive 2>&1)
RENEW_EXIT_CODE=$?

# Log the full output for debugging
echo "$RENEW_OUTPUT" >> "$LOG_FILE"

if [ $RENEW_EXIT_CODE -eq 0 ]; then
    # Check if certificates were actually renewed
    if echo "$RENEW_OUTPUT" | grep -qi "congratulations\|renewed successfully\|renewal succeeded"; then
        log "Certificates renewed successfully!"
        log "Reloading nginx..."
        
        # Reload nginx to use new certificates
        if docker-compose exec -T nginx nginx -s reload 2>/dev/null; then
            log "Nginx reloaded successfully."
        else
            log "WARNING: Failed to reload nginx. Attempting restart..."
            if docker-compose restart nginx 2>/dev/null; then
                log "Nginx restarted successfully."
            else
                log "ERROR: Failed to reload/restart nginx. Manual intervention required."
                log "Run: docker-compose restart nginx"
            fi
        fi
    elif echo "$RENEW_OUTPUT" | grep -qi "not due for renewal\|No renewals were attempted"; then
        log "Certificates are not due for renewal yet."
    else
        log "Renewal check completed (no action needed)."
    fi
else
    log "ERROR: Certificate renewal failed!"
    log "Error output: $RENEW_OUTPUT"
    exit 1
fi

log "Certificate renewal check completed."

