const interfaceGeo = {
    _metaTitle: "გიტარის აკორდები | gitaris akordebi",
    _metaDescription: "ქართული სიმღერების გიტარის აკორდები | Guitar chords of Georgian songs",
    _searchText: "ჩაწერეთ სიმღერა ან ავტორი",
    _searchLabel: "აკორდების ძებნა",
    _filterPopularity: "პოპულარობით",
    _filterQuality: "ხარისხით",
    _filterDifficulty: "სირთულით",
    _videoIconTitle: "მიჩვენე მხოლოდ გაკვეთილით",
    _verifyIconTitle: "მიჩვენე მხოლოდ დამოწმებული",
    _favoriteIconTitle: "მიჩვენე მხოლოდ ჩემი ფავორიტები",
    _login: "შესვლა",
    _uploadSong: "ატვირთე სიმღერა",
    _earn_money: "გამოიმუშავე თანხა",
    _isShown: "ნაჩვენებია",
    _from: "დან",
    _till: "მდე.",
    _totally: "სულ",
    _song: 'სიმღერა',
    _footer_designBy: "საიტის ავტორი",
    _footer_tsogi: "ნიკა ცოგიაიძე",
    _footer_input: 'აკორდების ძებნა',
    _footer_input_placeholder: 'მოგვწერეთ იდეები, შენიშვნები, მოსაზრებები',
    _footer_terms: "საიტის პირობები",
    _footer_policy: "კონფედენციალურობა",
    _footer_all_songs: "ყველა სიმღერა",
    _footer_add_song: "სიმღერის დამატება",
    _guitar_chords: "გიტარის აკორდები",
    _search_error: "ძებნისას დაფიქსირდა შეცდომა",
    _nothing_found: "სამწუხაროდ ვერაფერი მოიძებნა. გთხოვთ დაწეროთ ქართულად და სრულად",
    _enter_text: "ჩაწერეთ ტექსტი",
    _comment_sent: "თქვენი კომენტარი წარმატებით გაიგზავნა",
    _comment_not_sent: "მესიჯი ვერ გაიგზავნა. გთხოვთ სცადოთ მოგვიანებით",
    _evaluate_difficulty: "შეაფასეთ დაკვრის სირთულე:",
    rightHand: "მარჯვენა ხელი:",
    difficulty: {
        select: "არჩევა",
        very_easy: "უმარტივესი",
        easy: "მარტივი",
        medium: "საშუალო",
        hard: "რთული",
        very_hard: "ურთულესი",
    },
    favorites: {
        add: "შენახვა",
        remove: "ამოშლა"
    },
    _auth: {
        login: "ავტორიზაცია",
        enterBtn: 'სისტემაში შესვლის შემდეგ შეძლებთ დამატებითი ფუნქციებით სარგებლობას როგორიცაა მაგალითად "ფავორიტებში დამატება", "მასწავლებლის შეფასება" და სხვა',
        addFavorites: "სიმღერის ფავორიტებში დასამატებლად გთხოვთ შეხვიდეთ სისტემაში რის შემდეგაც შეძლებთ დამატებითი ფუნქციებით სარგებლობას",
        favoritesBtn: '"ფავორიტების" ფუნქციის გამოსაყენებლად გთხოვთ შეხვიდეთ სისტემაში',
        uploadSongBtn: 'სიმღერის საიტზე ასატვირთად გთხოვთ შეხვიდეთ სისტემაში'
    },
    chord: {
        font: "ფონტი",
        autoScroll: "ავტო-სქროლი",
        chord: "აკორდების",
        hide: "აკორდები",
        appearance: "აკორდები",
        uploaded: "აკორდები ატვირთა",
        rate: " შეაფასეთ აკორდების სისწორე",
    },
    upload: {
        cancel: "გაუქმება",
        add_image_button: "ტაბის/ნოტის დამატება",
        upload_image: "ტაბის ან ნოტის ფოტოს ატვირთვა",
        upload_image_instructions: "ატვირთეთ ტაბის ან ნოტის ფოტო",
        publish: `სიმღერის ${process.env.NEXT_PUBLIC_DOMAIN}-ზე გამოსაქვეყნებლად შეავსეთ ველები და ატვირთეთ ტექსტი პლიუს(+) ღილაკების მეშვეობით. ამ გვერდის ბოლოში შეგიძლიათ ნახოთ `,
        publish2: "თანხის გამოსამუშავებლად გაეცანით ", 
        video_Instructions: "ატვირთვის ვიდეო ინსტრუქცია",
        earn_terms: "წესებს და პირობებს",
        video_ifream_title: "ატვირთვის ვიდეო ინსტრუქციები",
        song_name_input: "ჩაწერეთ სიმღერის სახელი",
        video_lesson_link: "ვიდეო გაკვეთილის ლინკი. მაგ. youtube.com/watch?v=O08BvtiPka8 (არასავალდებულო)",
        uploader_name: "ამტვირთის სახელი/გვარი (არასავალდებულო)",
        save: "სიმღერის ატვირთვა საიტზე",
        editor_save: "შენახვა",
        editor_delete_title: "სტრიქონის წაშლა",
        editor_move_title: "სტრიქონის გადატანა",
        editor_duplicate_title: "სტრიქონის დუბლირება",
        editor_change_title: "სტრიქონის შეცვლა",
        editor_mark_title: "მისამღერად მონიშვნა",
        editor_mark_string_title: "სტრიქონად მონიშვნა",
        addition_right_hand_button: "მარჯვენა ხელის დამატება",
        add_string_button: "ტექსტის დამატება",
        add_skip_button: "გამოტოვების დამატება",
        write_chord: "ჩაწერეთ აკორდი",
        ex: "მაგალითი",
        authors: {
            add: "ავტორის დამატება",
            authorName: "ავტორის სახელი",
            delete: "ავტორის წაშლა",
        }
    },
    placeholder: {
        songText: `ჩაწერეთ ტექსტი. მაგალითად: 

(Am)მელიქიშვილის (Dm)გამზირი,
(E7)ია, ვარდი და (Am)ბზა...
უშენოდ ვეღარ (Dm)გავძელი,
(G7)ჩემი ბალღობის (C)გზავ.

(A7)გზად სტუდენტობა (Dm)იჩქარის,
(E7)მძებნელი მზის და (Am)გზის.
სად არის ახლა (Dm)ის ქალი?!
(E7)ალბათ, აკვანთან (Am)ზის.

(Am)იქნებ რუსთავი (Dm)არჩია,
(E7)იქნებ სამგორშიც (Am)ქრის,
იქნება ისევ (Dm)ბავშვია,
(G7)თვალებიც შერჩა (C)შვლის.

(A7)და (Dm)ელანდება დამწველი
(E7)კვლავ სტუდენტობის (Am)გზა _
მელიქიშვილის (Dm)გამზირი,
(E7)ია, ვარდი და (Am)ბზა.
        `,
        rightHand: `ჩაწერეთ მარჯვენა ხელის ინსტრუქცია. მაგალითად: 
ბანი დაბლა დაბლა მაღლა დაბლა მაღლა ან ბანი ↓ ↓ ↑ ↓ ↑ ან ბანი 3 2 1 2 3`
    },
    _search: "ძებნა"
}

const interfaceEng = {
    _metaTitle: "Clean guitar chords",
    _metaDescription: "Curated list of guitar chords with user votes, difficulty and favorites features",
    _searchText: "Search songs and authors",
    _searchLabel: "Search chords",
    _filterPopularity: "By popularity",
    _filterQuality: "By quality",
    _filterDifficulty: "By difficulty",
    _videoIconTitle: "Show only chords with tutorials",
    _verifyIconTitle: "Show only confirmed chords",
    _favoriteIconTitle: "Show only my favorites",
    _login: "Login",
    _uploadSong: "Upload songs",
    _earn_money: "Earn money",
    _isShown: "Showing",
    _from: "from",
    _till: "to",
    _totally: "Totally",
    _song: 'songs',
    _footer_designBy: "Created by",
    _footer_tsogi: "Nika Tsogiaidze",
    _footer_input: 'Search songs',
    _footer_input_placeholder: 'Write us ideas and comments',
    _footer_terms: "Terms of use",
    _footer_policy: "Privacy policy",
    _footer_all_songs: "All songs",
    _footer_add_song: "Add a song",
    _guitar_chords: "guitar chords",
    _search_error: "Error while searching",
    _nothing_found: "Unfortunately nothing found. Please write improved search term",
    _enter_text: "Enter text",
    _comment_sent: "Your comment sent",
    _comment_not_sent: "Comment wasn't sent. Please try again later",
    _evaluate_difficulty: "Evaluate playing difficulty:",
    rightHand: "Right hand:",
    difficulty: {
        select: "Select",
        very_easy: "Easiest",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        very_hard: "Hardest",
    },
    favorites: {
        add: "Add to favorites",
        remove: "Remove from favorites"
    },
    _auth: {
        login: "Log in",
        enterBtn: 'After logging in you will be able to use additional features like "Add to favorites"',
        addFavorites: 'In order to add the song to your favorites please log in to the system',
        favoritesBtn: 'In order to use Favorites feature please log in to the system',
        uploadSongBtn: 'In order to upload song to the website please log in to the system'
    },
    chord: {
        font: "Font size",
        autoScroll: "Auto scroll",
        chord: "chords",
        hide: "Hide",
        appearance: "Show",
        uploaded: "Uploaded by",
        rate: "Evaluate correctness of chords",
    },
    upload: {
        publish: `In order to upload new song chord to ${process.env.NEXT_PUBLIC_DOMAIN} you should fill out the fields and upload song text using plus(+) buttons. At the end of this page you can find `,
        publish2: "In order to earn money please read ", 
        video_Instructions: "video instructions for upload",
        earn_terms: "terms and conditions",
        video_ifream_title: "video instructions for upload",
        song_name_input: "Enter the song name",
        video_lesson_link: "Url to video tutorial. Ex. youtube.com/watch?v=O08BvtiPka8 (optional)",
        uploader_name: "Name of the uploader (optional)",
        save: "Upload song to website",
        editor_save: "Save",
        editor_delete_title: "Delete the line",
        editor_move_title: "Move the line",
        editor_duplicate_title: "Duplicate the line",
        editor_change_title: "Edit the line",
        editor_mark_title: "Mark as verse",
        editor_mark_string_title: "Mark as normal text",
        addition_right_hand_button: "Add the right hand",
        add_string_button: "Add song text",
        add_skip_button: "Add the linebreak",
        write_chord: "Enter the chord",
        ex: "Examples",
        authors: {
            add: "Add author",
            authorName: "Author name",
            delete: "Delete the author"
        }
    },
    placeholder: {
        songText: `Enter text. Example: 

(C)Imagine there's n(Cmaj7)o    h(F)eaven
(C)It's easy if (Cmaj7)you   (F)try
(C)No hell (Cmaj7)below (F)us
(C)Above us (Cmaj7)only  (F)sky

(F)Imagine (Am)all th(Dm7)e peop(F)le
(G)Living for (C)to (G7)- day a-hah

(C)Imagine there's (Cmaj7)no    (F)countries
(C)It isn't hard (Cmaj7)to    (F)do
(C)Nothing to kill o(Cmaj7)r    d(F)ie for
(C)And no religi(Cmaj7)on   t(F)oo
        `,
        rightHand: `Enter instructions for right hand. Example: 
Bass Down Down Up Down Up or Bass ↓ ↓ ↑ ↓ ↑ or Bass 3 2 1 2 3`
    },
    _search: "Search"
}

let words = interfaceGeo;

if(process.env.NEXT_PUBLIC_LANG == "eng"){
    words = interfaceEng;
}

export default words;