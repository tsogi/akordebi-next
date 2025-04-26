# Instructions for installation
1. Clone the repository
2. Install dependencies: `npm install`
4. Copy `.env.local.example` to `.env.local` and set database credentials 
5. Run the app: `npm run dev`

# Useful commands
ssh -i /users/nika/.ssh/id_rsa_ubuntu_server -t nika@tsogi.net "docker exec -it de4c9f863b32 mysql -u root -p"

select * from users where payment_date is not null;
UPDATE users SET payment_date = NULL, payment_confirmed = 0 WHERE email = "tsogiaidze1@gmail.com";
select * from users where email = "giomaho54@gmail.com";
UPDATE users SET payment_confirmed = 1 WHERE email IN ("tsogiaidze1@gmail.com", 'snowdze@gmail.com', 'davidkodan@gmail.com', 'lashachaki25@gmail.com', 'shotimachavariani12@gmail.com', "tariel.natsvaladze.1@iliauni.edu.ge", "shalvapaposhvili22@gmail.com", "giorgi.turman@gmail.com", "giomaho54@gmail.com", "ramazikekelidze@gmail.com");
UPDATE users SET payment_date = NULL WHERE email NOT IN ("tsogiaidze1@gmail.com", 'snowdze@gmail.com', 'davidkodan@gmail.com', 'lashachaki25@gmail.com', 'shotimachavariani12@gmail.com', "tariel.natsvaladze.1@iliauni.edu.ge", "shalvapaposhvili22@gmail.com", "giorgi.turman@gmail.com", "giomaho54@gmail.com", "ramazikekelidze@gmail.com");

ssh -i /users/nika/.ssh/id_rsa_ubuntu_server nika@tsogi.net && cd /var/projects && docker exec -it de4c9f863b32 bin/bash && mysql -u root -pNikoloz93