# Instructions for installation
1. Clone the repository
2. Install dependencies: `npm install`
4. Copy `.env.local.example` to `.env.local` and set database credentials 
5. Run the app: `npm run dev`

# Useful commands
ssh -i /users/nika/.ssh/id_rsa_ubuntu_server -t nika@tsogi.net "docker exec -it de4c9f863b32 mysql -u root -p"

select * from users where payment_date is not null;

UPDATE users SET paid_until = "2025-05-26 12:04:25" WHERE email = "janelag25@gmail.com";

UPDATE users 
SET paid_until = DATE_ADD(payment_date, INTERVAL 1 MONTH)
WHERE payment_date IS NOT NULL 
AND paid_until IS NULL;

UPDATE users SET payment_date = NOW(), paid_until = DATE_ADD(NOW(), INTERVAL 12 MONTH), payment_confirmed = 1 WHERE email = "tsogiaidze1@gmail.com";
select * from users where email = "giomaho54@gmail.com";
UPDATE users SET payment_confirmed = 1, payment_date = "2025-05-19 00:00:16", paid_until = "2025-06-19 00:00:16" WHERE email IN ("lukamghebrishvili05@gmail.com", "kokalaghadze@gmail.com");

Use tailwindcss instead of css files. Make sure UI is mobile-first especially beautiful on mobile screens with width around 380px. Make only minimal required changes, don't change extra code. Try to reuse existing components when possible. For database use db.js service. For user data use useUser.js service or getUser.js on the server side. For translations use LanguageContext.js service. The project is next.js 13 with pages directory. Use absolute path(@) to import components. Language translations should be put in lang_temp.js. Try to avoid white backgrounds because the website is dark