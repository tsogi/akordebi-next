# Build next app
rm -r .next
npm run build
zip -r ../next-build.zip .next

# Upload the build to EC2
scp -i ../akordebi.pem ../next-build.zip ubuntu@akordebi.ge:/var/projects/akordebi

# Reload app on EC2
ssh -i ../akordebi.pem ubuntu@akordebi.ge << EOF

    # Navigating to the directory
    cd /var/projects/akordebi
    
    # Executing the commands
    rm -r .next
    unzip next-build.zip
    npx pm2 restart akordebi
    
EOF