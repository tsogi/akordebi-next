import db from "@/services/db";

export default async function handler(req, res) {
    // Todo updateSong.js and storeSong.js violate DRY principle, fix it
    if (req.method === 'POST') {
        let response2 = { error: "", msg: "" }

        try{
            // Todo handle case when user saves song with same name or if user clicks "Save song button twice"
            let data = {...req.body};
            data.searchWords = generateSearchText(data);
            let result = await db.updateSong(data);

            if(result === true) {
                response2.msg = "სიმღერა წარმატებითა შეიცვალა";
            } else {
                response2.error = "სიმღერის შეცვლისას დაფიქსირდა შეცდომა. დაუკავშირდით ადმინისტრაციას";
            }
        } catch(err) {
            console.log(err)
            response2.error = "სიმღერის შეცვლისას დაფიქსირდა შეცდომა. დაუკავშირდით ადმინისტრაციას";
        }

        res.json(response2);
    }

    // Todo move this function to its module
    function generateSearchText(data){
        let text = data.name;

        for(let author of data.authors) {
            text += ` ${author.name}`;
        }

        let textLatin = georgianToLatin(text);

        return text + " " + textLatin;
    }

    function georgianToLatin(text) {
        const georgianToLatinMap = {
          'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e',
          'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k',
          'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p',
          'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u',
          'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh',
          'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch',
          'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
        };
      
        return text
          .split('')
          .map(char => georgianToLatinMap[char] || char)
          .join('');
    }
}