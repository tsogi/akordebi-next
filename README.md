# Instructions for installation
1. Clone the repository
2. Install dependencies: `npm install`
4. Copy `.env.local.example` to `.env.local` and set database credentials 
5. Run the app: `npm run dev`

# Useful commands
ssh -i /Users/nika/Projects/akordebi.ge/akordebi_ec2.pem -t ubuntu@18.153.218.239 "docker exec -it dd6582029112 mysql -u root -p"

select * from users where payment_date is not null;

UPDATE users SET payment_date = "2025-06-05 21:56:13", payment_confirmed = 1, paid_until = "2026-06-05 21:56:13" WHERE email = "eka.vonschoenfeldt@gmail.com";

UPDATE users 
SET paid_until = DATE_ADD(payment_date, INTERVAL 1 MONTH)
WHERE payment_date IS NOT NULL 
AND paid_until IS NULL;

UPDATE users SET payment_date = NOW(), paid_until = DATE_ADD(NOW(), INTERVAL 12 MONTH), payment_confirmed = 1 WHERE email = "tsogiaidze1@gmail.com";
select * from users where email = "giomaho54@gmail.com";
UPDATE users SET payment_confirmed = 1, payment_date = "2025-05-19 00:00:16", paid_until = "2025-06-19 00:00:16" WHERE email IN ("lukamghebrishvili05@gmail.com", "kokalaghadze@gmail.com");

Use tailwindcss instead of css files. Make sure UI is modern, solid, clean and mobile-first especially beautiful on mobile screens with width around 380px. Make only minimal required changes, don't change extra code. Try to reuse existing components when possible. For database use db.js service. For user data use useUser.js service or getUser.js on the server side. For translations use LanguageContext.js service. The project is next.js 13 with pages directory. Use absolute path(@) to import components. Language translations should be put in lang_temp.js. Try to avoid white backgrounds because the website is dark

// chords => guitar_chord
        // tabs => guitar_tab

        // guitar_lessons => guitar_lesson
        // fanduri => fanduri_chord
        // fanduri_lessons => fanduri_lesson    
update songs set notation_format = "guitar_chord" where notation_format = "chords";
update songs set notation_format = "guitar_tab" where notation_format = "tabs";
update songs set notation_format = "guitar_lesson" where notation_format = "guitar_lessons";
update songs set notation_format = "fanduri_chord" where notation_format = "fanduri";
update songs set notation_format = "fanduri_lesson" where notation_format = "fanduri_lessons";