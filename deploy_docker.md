# Create docker image .tar for intel
docker buildx build --platform linux/amd64 -t akordebi:1.1 --output "type=docker,dest=akordebi.tar" .

# Upload docker image .tar to ssh
scp -i ../akordebi.pem ./akordebi.tar ubuntu@akordebi.ge:/var/projects/akordebi

# Load docker on ssh
docker load -i akordebi.tar

# Remove old deployment
docker-compose stop web
docker-compose rm web
docker-compose stop mysql
docker-compose rm mysql

# Run the deployment
docker-compose up -d