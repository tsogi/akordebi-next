# Create docker image .tar for intel
docker buildx build --platform linux/amd64 -t akordebi:1.2 --output "type=docker,dest=../akordebi.tar" .

# Upload docker image .tar to ssh
scp -i ../akordebi.pem ../akordebi.tar ubuntu@akordebi.ge:/var/projects/akordebi

# Connect to ec2 instance and run docker image
ssh -i ../akordebi.pem ubuntu@akordebi.ge << EOF

    # Navigating to the directory
    cd /var/projects/akordebi
    
    # Executing the commands
    docker load -i akordebi.tar

    docker-compose stop akordebi
    docker-compose stop chordsofsongs
    docker-compose stop mysql

    docker-compose up -d

    # Delete all unused containers, networks, images
    docker system prune -f

EOF

# Download mysql backup
# scp ubuntu@akordebi.ge:/var/projects/backups/mysql/akordebi_15.sql ../