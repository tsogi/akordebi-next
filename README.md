# Instructions for installation
1. Clone the repository
2. Install dependencies: `npm install`
4. Copy `.env.local.example` to `.env.local` and set database credentials 
5. Run the app: `npm run dev`

# Useful commands
select * from users where payment_date is not null;
select * from users where email = "snowdze@gmail.com";
UPDATE users SET payment_confirmed = 1 WHERE email IN ("tsogiaidze1@gmail.com", 'snowdze@gmail.com', 'davidkodan@gmail.com', 'lashachaki25@gmail.com', 'shotimachavariani12@gmail.com');
UPDATE users SET payment_date = NULL WHERE email NOT IN ("tsogiaidze1@gmail.com", 'snowdze@gmail.com', 'davidkodan@gmail.com', 'lashachaki25@gmail.com', 'shotimachavariani12@gmail.com');

shotimachavariani12@gmail.com
davidkodan@gmail.com
lashachaki25@gmail.com
snowdze@gmail.com
