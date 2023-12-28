# Build next app
rm -r .next
npm run build
zip -r ../next-build.zip .next
zip -r ../public.zip public
zip -r ../node_modules.zip node_modules

# Upload files to EC2
scp -i ../akordebi.pem ../next-build.zip ubuntu@akordebi.ge:/var/projects/chordsofsongs2
scp -i ../akordebi.pem ../public.zip ubuntu@akordebi.ge:/var/projects/chordsofsongs2
scp -i ../akordebi.pem ../node_modules.zip ubuntu@akordebi.ge:/var/projects/chordsofsongs2
scp -i ../akordebi.pem package.json ubuntu@akordebi.ge:/var/projects/chordsofsongs2

# Reload app on EC2
ssh -i ../akordebi.pem ubuntu@akordebi.ge << EOF

    # Navigating to the directory
    cd /var/projects/chordsofsongs2
    
    # Executing the commands
    rm -r .next
    rm -r public
    rm -r node_modules

    unzip next-build.zip
    unzip public.zip
    unzip node_modules.zip

    npx pm2 restart chordsofsongs2
    
EOF

# Download mysql backup
# scp ubuntu@akordebi.ge:/var/projects/backups/mysql/akordebi_15.sql ../

# Start next app using pm2
# npx pm2 start npm --name "chordsofsongs2" -- start -- -p 3001