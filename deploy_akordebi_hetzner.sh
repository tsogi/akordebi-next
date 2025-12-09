# Update sitemap
curl -o ./public/sitemap.xml https://akordebi.ge/api/sitemap

# Copy envs
cp .env.production.local.akordebi .env.production.local

# Build the app
npm run build

# Create docker image .tar for intel
docker buildx build --platform linux/amd64 -t akordebi:1.4 --output "type=docker,dest=./akordebi.tar" .

# Upload docker image .tar to Hetzner
scp -i /Users/nika/.ssh/id_ed25519hetzer ./akordebi.tar root@46.224.126.7:/var/projects

# Connect to the machine and run docker image
ssh -i /Users/nika/.ssh/id_ed25519hetzer root@46.224.126.7 << EOF

    # Navigating to the directory
    cd /var/projects/backup_ec2_server
    
    # Executing the commands
    docker-compose stop akordebi
    docker-compose rm -f akordebi
    docker load -i /var/projects/akordebi.tar
    docker-compose up -d akordebi
    docker system prune -f

EOF

# This is to cause next app to get cached so users don't have to wait for the first load
curl https://akordebi.ge
