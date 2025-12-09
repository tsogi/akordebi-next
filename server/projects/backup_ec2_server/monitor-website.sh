#!/bin/bash

# Website Monitoring Script with Pushover Notifications
# Checks if akordebi.ge returns HTTP 200, sends notification if it doesn't

# Configuration
WEBSITE_URL="https://akordebi.ge"
PUSHOVER_APP_TOKEN="ad646xs2p1a81qa93t9ctfu2w4f1pn"
PUSHOVER_USER_KEY="usyin7q4xctgphb867fqvwqeydk3wc"
STATE_FILE="/var/projects/backup_ec2_server/monitor-website.state"
TIMEOUT=10  # Timeout in seconds

# Function to send Pushover notification
send_pushover_notification() {
    local title="$1"
    local message="$2"
    local priority="${3:-0}"  # 0 = normal, 1 = high, 2 = emergency
    
    curl -s \
        --form-string "token=$PUSHOVER_APP_TOKEN" \
        --form-string "user=$PUSHOVER_USER_KEY" \
        --form-string "title=$title" \
        --form-string "message=$message" \
        --form-string "priority=$priority" \
        --form-string "sound=pushover" \
        https://api.pushover.net/1/messages.json > /dev/null
    
    if [ $? -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

# Use curl to check HTTP status code
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT --insecure "$WEBSITE_URL" 2>&1)
CURL_EXIT_CODE=$?

# Check if curl command succeeded
if [ $CURL_EXIT_CODE -ne 0 ]; then
    # Curl failed (timeout, connection error, etc.)
    HTTP_CODE="000"
fi

# Read previous state
PREVIOUS_STATE="unknown"
if [ -f "$STATE_FILE" ]; then
    PREVIOUS_STATE=$(cat "$STATE_FILE")
fi

# Check if website is healthy (HTTP 200)
if [ "$HTTP_CODE" = "200" ]; then
    # If website was previously down, send recovery notification
    if [ "$PREVIOUS_STATE" = "down" ]; then
        send_pushover_notification "✅ akordebi.ge is BACK ONLINE" \
            "The website has recovered and is now responding with HTTP 200." \
            0
    fi
    
    # Update state file
    echo "up" > "$STATE_FILE"
    exit 0
else
    # Website is down or not responding correctly
    # Only send notification if this is a new failure (wasn't already down)
    if [ "$PREVIOUS_STATE" != "down" ]; then
        if [ "$HTTP_CODE" = "000" ]; then
            MESSAGE="Website is not responding. Connection timeout or network error."
        else
            MESSAGE="Website returned HTTP $HTTP_CODE instead of 200."
        fi
        
        send_pushover_notification "🚨 akordebi.ge is DOWN" \
            "$MESSAGE\n\nURL: $WEBSITE_URL\nTime: $(date '+%Y-%m-%d %H:%M:%S')" \
            1
    fi
    
    # Update state file
    echo "down" > "$STATE_FILE"
    exit 1
fi

