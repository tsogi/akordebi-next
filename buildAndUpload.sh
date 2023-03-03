rm -r .next
npm run build
zip -r ../next-build.zip .next
scp -i ../akordebi.pem ../next-build.zip ubuntu@akordebi.ge:/var/projects/akordebi