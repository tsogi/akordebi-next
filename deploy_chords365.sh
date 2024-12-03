curl -o ./public/sitemap.xml https://chords365.com/api/sitemap
# Copy envs
cp .env.production.local.chords365 .env.production.local

# Create docker image .tar for intel
# curl -o ./public/sitemap.xml https://akordebi.ge/api/sitemap
docker buildx build --platform linux/amd64 -t chords365:1.3 --output "type=docker,dest=./chords365.tar" .

# Upload docker image .tar to ssh
scp -i /users/nika/.ssh/id_rsa_ubuntu_server ./chords365.tar nika@tsogi.net:/var/projects

# Connect to ec2 instance and run docker image
ssh -i /users/nika/.ssh/id_rsa_ubuntu_server nika@tsogi.net << EOF

    # Navigating to the directory
    cd /var/projects
    
    # Executing the commands
    docker-compose rm -f chords365
    docker load -i chords365.tar
    docker-compose up -d chords365

    # Delete all unused containers, networks, images
    # docker system prune -f

EOF

# This is to cause next app to get cached so users don't have to wait for the first load
curl https://chords365.com