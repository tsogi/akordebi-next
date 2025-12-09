#!/bin/bash

# Variables
DATE=$(date +%d)  # Day of the month (01, 02, ... 31)
FILENAME="backup_${DATE}.sql"  # Maximum 31 backup files (one per day of month)
BACKUP_DIR="/var/projects/backups"
BACKUP_FILE="${BACKUP_DIR}/${FILENAME}"
S3_BUCKET="s3://old-acer-backups"
MYSQL_CONTAINER="backup_ec2_server-mysql-1"
MYSQL_USER="root"
MYSQL_PASSWORD="nikoloz93"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting backup process..."

# Step 1: Create a MySQL dump from the running container
log "Creating MySQL dump: $FILENAME"
if docker exec $MYSQL_CONTAINER /usr/bin/mysqldump -u $MYSQL_USER --password=$MYSQL_PASSWORD --all-databases > "$BACKUP_FILE" 2>&1; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "MySQL dump created successfully. Size: $BACKUP_SIZE"
else
    log "ERROR: Failed to create MySQL dump"
    exit 1
fi

# Step 2: Upload the backup to S3
log "Uploading backup to S3: $S3_BUCKET/$FILENAME"
if /usr/local/bin/aws s3 cp "$BACKUP_FILE" "$S3_BUCKET/$FILENAME" --profile s3 2>&1 | tee -a "$LOG_FILE"; then
    log "Backup uploaded successfully to S3"
    
    # Optional: Remove local backup file after successful upload to save space
    # Uncomment the next line if you want to delete local backups after upload
    # rm -f "$BACKUP_FILE"
    # log "Local backup file removed"
else
    log "ERROR: Failed to upload backup to S3"
    exit 1
fi

log "Backup process completed successfully."