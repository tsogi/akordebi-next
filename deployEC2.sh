# Build next app
rm -r .next
npm run build
zip -r ../next-build.zip .next
zip -r ../public.zip public

# Download mysql backup
# scp ubuntu@akordebi.ge:/var/projects/akordebi/akordebi_15.sql ./

# Upload files to EC2
scp -i ../akordebi.pem ../next-build.zip ubuntu@akordebi.ge:/var/projects/akordebi
scp -i ../akordebi.pem ../public.zip ubuntu@akordebi.ge:/var/projects/akordebi

# Reload app on EC2
ssh -i ../akordebi.pem ubuntu@akordebi.ge << EOF

    # Navigating to the directory
    cd /var/projects/akordebi
    
    # Executing the commands
    rm -r .next
    rm -r public
    unzip next-build.zip
    unzip public.zip
    npx pm2 restart akordebi
    
EOF