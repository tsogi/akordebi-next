# Update sitemap
curl -o ./public/sitemap.xml https://akordebi.ge/api/sitemap

# Copy envs
cp .env.production.local.akordebi .env.production.local

# Build the app
npm run build

# Create docker image .tar for intel
docker buildx build --platform linux/amd64 -t akordebi:1.4 --output "type=docker,dest=./akordebi.tar" .

# Upload docker image .tar to ssh
scp -i /Users/nika/Projects/akordebi.ge/akordebi_ec2.pem ./akordebi.tar ubuntu@18.153.218.239:/var/projects
# scp -i /users/nika/.ssh/id_rsa_ubuntu_server ./akordebi.tar nika@tsogi.net:/var/projects

# Connect to the machine and run docker image
ssh -i /Users/nika/Projects/akordebi.ge/akordebi_ec2.pem ubuntu@18.153.218.239 << EOF

    # Navigating to the directory
    cd /var/projects
    
    # Executing the commands
    docker-compose stop akordebi
    docker-compose rm -f akordebi
    docker load -i akordebi.tar
    docker-compose up -d akordebi
    docker system prune -f


    # docker-compose rm -f akordebi
    # docker load -i akordebi.tar
    # docker-compose up -d akordebi

    # Delete all unused containers, networks, images
    # docker system prune -f

EOF

# This is to cause next app to get cached so users don't have to wait for the first load
curl https://akordebi.ge