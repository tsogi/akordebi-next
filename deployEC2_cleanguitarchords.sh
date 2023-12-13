# Build next app
rm -r .next
npm run build
zip -r ../next-build.zip .next
zip -r ../public.zip public

# Upload files to EC2
scp -i ../akordebi.pem ../next-build.zip ubuntu@akordebi.ge:/var/projects/cleanguitarchords
scp -i ../akordebi.pem ../public.zip ubuntu@akordebi.ge:/var/projects/cleanguitarchords

# Reload app on EC2
ssh -i ../akordebi.pem ubuntu@akordebi.ge << EOF

    # Navigating to the directory
    cd /var/projects/cleanguitarchords
    
    # Executing the commands
    rm -r .next
    rm -r public
    unzip next-build.zip
    unzip public.zip
    npx pm2 restart cleanguitarchords
    
EOF

# Download mysql backup
# scp ubuntu@akordebi.ge:/var/projects/backups/mysql/akordebi_15.sql ../

# Start next app using pm2
# npx pm2 start npm --name "cleanguitarchords" -- start -- -p 3001