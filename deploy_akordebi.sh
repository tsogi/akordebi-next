# Download sql backup from yesterday
# yesterday=$(date -v-1d +%Y%m%d)
# day=$(echo $yesterday | cut -c 7-8)
# filename="akordebi_${day}.sql"
# scp -i /users/nika/.ssh/id_rsa_ubuntu_server ubuntu@akordebi.ge:/var/projects/backups/mysql/$filename ../backups/akordebige/mysql/

curl -o ./public/sitemap.xml https://akordebi.ge/api/sitemap
# Copy envs
cp .env.production.local.akordebi .env.production.local
npm run build

# Create docker image .tar for intel
# curl -o ./public/sitemap.xml https://akordebi.ge/api/sitemap
docker buildx build --platform linux/amd64 -t akordebi:1.3 --output "type=docker,dest=./akordebi.tar" .

# Upload docker image .tar to ssh
scp -i /users/nika/.ssh/id_rsa_ubuntu_server ./akordebi.tar nika@tsogi.net:/var/projects

# Connect to ec2 instance and run docker image
ssh -i /users/nika/.ssh/id_rsa_ubuntu_server nika@tsogi.net << EOF

    # Navigating to the directory
    cd /var/projects
    
    # Executing the commands
    docker-compose rm -f akordebi
    docker load -i akordebi.tar
    docker-compose up -d akordebi

    # Delete all unused containers, networks, images
    # docker system prune -f

EOF

# This is to cause next app to get cached so users don't have to wait for the first load
curl https://akordebi.ge

# Download mysql backup
# scp ubuntu@akordebi.ge:/var/projects/backups/mysql/akordebi_15.sql ../