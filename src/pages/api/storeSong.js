import db from "@/services/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let response2 = { error: "", msg: "" }

        try{
            let data = {...req.body};

            let { fullText, url } = generateMeta(data);
            data.searchWords = fullText;
            data.url = url;

            let dbSong = await db.getSongByUrl(data.url);
            
            if(dbSong) {
                response2.error = "სიმღერა ამ სახელით/ავტორებით უკვე დარეგისტრირებულია, გთხოვთ ჩაწერეთ სხვა სახელი/ავტორები";
                res.json(response2);
                return;
            } 

            let result = await db.storeSong(data);

            if(result === true) {
                response2.msg = "სიმღერა წარმატებითა გამოქვეყნდა საიტზე";
            } else {
                response2.error = "სიმღერის შენახვისას დაფიქსირდა შეცდომა. დაუკავშირდით ადმინისტრაციას";
            }
        } catch(err) {
            response2.error = "სიმღერის შენახვისას დაფიქსირდა შეცდომა. დაუკავშირდით ადმინისტრაციას";
        }

        res.json(response2);
    }

    // Todo move this function to its module
    function generateMeta(data){
        let text = data.name;

        let authors = data.authors;
        for(let i = 0; i < authors.length; i++){
            if(i === 0) { 
                text += "-";
            } else {
                text += " ";
            }
            text += `${authors[i].name}`;
        }

        let textLatin = georgianToLatin(text);
        let url = textLatin.trim().replaceAll(" ", "_");
        textLatin = textLatin.replaceAll("-", " ");
        text = text.replaceAll("-", " ");

        let ret = { fullText: `${text} ${textLatin}`, url }

        return ret;
    }

    function georgianToLatin(text) {
        const georgianToLatinMap = {
          'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e',
          'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k',
          'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p',
          'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u',
          'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'y', 'შ': 'sh',
          'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'w', 'ჭ': 'ch',
          'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
        };
      
        return text
          .split('')
          .map(char => georgianToLatinMap[char] || char)
          .join('');
    }
}