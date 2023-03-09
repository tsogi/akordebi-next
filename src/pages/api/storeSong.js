import db from "@/services/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let response2 = { error: "", msg: "" }

        try{
            let data = {...req.body};
            let dbSong = await db.getSongByName(data.name);
            
            if(dbSong) {
                response2.error = "სიმღერა ამ სახელით უკვე დარეგისტრირებულია, გთხოვთ ჩაწერეთ სხვა სახელი";
                res.json(response2);
                return;
            } 

            data.searchWords = generateSearchText(data);
            let result = await db.storeSong(data);

            if(result === true) {
                response2.msg = "სიმღერა წარმატებითა გამოქვეყნდა საიტზე";
            } else {
                response2.error = "სიმღერის შენახვისას დაფიქსირდა შეცდომა. დაუკავშირდით ადმინისტრაციას";
            }
        } catch(err) {
            console.log(err)
            response2.error = "სიმღერის შენახვისას დაფიქსირდა შეცდომა. დაუკავშირდით ადმინისტრაციას";
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