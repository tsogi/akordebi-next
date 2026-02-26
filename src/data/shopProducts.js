const shopProducts = [
    {
      id: "yamaha-c40",
      name: "Yamaha C40",
      price: "350",
      description: "დამწყებისთვის ყველაზე პოპულარული კლასიკური გიტარა - რბილი ხმა, კომფორტული დაკვრა და გამძლე კონსტრუქცია ყოველდღიური სწავლისთვის",
      thumbnail: "/images/shop/c40/1.png",
      images: [
        "/images/shop/c40/1.png",
        "/images/shop/c40/2.png",
        "/images/shop/c40/3.png",
        "/images/shop/c40/4.png",
        "/images/shop/c40/5.png",
        "/images/shop/c40/6.png",
        "/images/shop/c40/7.png",
        "/images/shop/c40/8.png",
      ],
      characteristics: [
        { "name": "ზომა", "value": "4/4 სრული ზომა" },
        { "name": "სიმები", "value": "მოყვება" },
      ],
      category: "კლასიკური გიტარები",
      inStock: true
    },
    {
      id: "yamaha-cg102",
      name: "Yamaha CG102",
      price: "595",
      description: "იდეალური არჩევანი დამწყებისთვის და საშუალო დონის შემსრულებლისთვის - კომფორტული გრიფი, დაბალანსებული ჟღერადობა და Yamaha-ს სანდო ხარისხი ყოველდღიური ვარჯიშისთვის",
      thumbnail: "/images/shop/cg102/1.png",
      images: [
        "/images/shop/cg102/1.png",
        "/images/shop/cg102/2.png",
        "/images/shop/cg102/3.png",
        "/images/shop/cg102/4.png",
        "/images/shop/cg102/5.png",
        "/images/shop/cg102/6.png",
        "/images/shop/cg102/7.png",
      ],
      characteristics: [
        { "name": "ზომა", "value": "4/4 სრული ზომა" },
        { "name": "სიმები", "value": "მოყვება" },
      ],
      category: "კლასიკური გიტარები",
      inStock: true
    },
    {
      id: "yamaha-cg142c",
      name: "Yamaha CG142C",
      price: "900",
      description: "საშუალო და შედარებით გამოცდილი გიტარისტისთვის - მდიდარი და თბილი ჟღერადობა, კომფორტული დაკვრა და Yamaha-ს მაღალი ხარისხი",
      thumbnail: "/images/shop/cg142c/8.png",
      images: [
        "/images/shop/cg142c/8.png",
        "/images/shop/cg142c/1.png",
        "/images/shop/cg142c/2.png",
        "/images/shop/cg142c/3.png",
        "/images/shop/cg142c/4.png",
        "/images/shop/cg142c/5.png",
        "/images/shop/cg142c/6.png",
        "/images/shop/cg142c/7.png",
        "/images/shop/cg142c/9.png",
        "/images/shop/cg142c/10.png",
      ],
      characteristics: [
        { "name": "ზომა", "value": "4/4 სრული ზომა" },
        { "name": "სიმები", "value": "მოყვება" },
      ],
      category: "კლასიკური გიტარები",
      inStock: true
    },
    {
      id: "yamaha-f310tbs",
      name: "Yamaha F310",
      price: "450",
      description: "დამწყებისთვის ყველაზე მოთხოვნადი აკუსტიკური გიტარა - მკაფიო ჟღერადობა, კომფორტული დაკვრა და Yamaha-ს სანდო ხარისხი",
      thumbnail: "/images/shop/f310tbs/1.png",
      images: [
        "/images/shop/f310tbs/1.png",
        "/images/shop/f310tbs/2.png",
        "/images/shop/f310tbs/3.png",
        "/images/shop/f310tbs/4.png",
        "/images/shop/f310tbs/5.png",
        "/images/shop/f310tbs/6.png",
        "/images/shop/f310tbs/7.png",
        "/images/shop/f310tbs/8.png",
        "/images/shop/f310tbs/9.png",
      ],
      characteristics: [
        { "name": "სიმები", "value": "მოყვება" },
      ],
      category: "აკუსტიკური გიტარები",
      inStock: true
    },
    {
      id: "yamaha-f370b",
      name: "Yamaha F370",
      price: "635",
      description: "საშუალო და შედარებით გამოცდილი შემსრულებლისთვის - უფრო გამოკვეთილი ჟღერადობა, კომფორტული დაკვრა და Yamaha-ს სანდო ხარისხი",
      thumbnail: "/images/shop/f370b/1.png",
      images: [
        "/images/shop/f370b/1.png",
        "/images/shop/f370b/2.png",
        "/images/shop/f370b/3.png",
        "/images/shop/f370b/4.png",
        "/images/shop/f370b/5.png",
        "/images/shop/f370b/6.png",
        "/images/shop/f370b/7.png",
      ],
      characteristics: [
        { "name": "სიმები", "value": "მოყვება" },
      ],
      category: "აკუსტიკური გიტარები",
      inStock: true
    },
    {
      id: "accessory-capo",
      name: "კაპო",
      price: "10",
      description: "ერთი მოძრაობით ტონალობის შეცვლა და სუფთა ჟღერადობა ყველა ლადზე - აუცილებელი აქსესუარი ყოველდღიური ვარჯიშისა და სცენისთვის",
      thumbnail: "/images/shop/accessories/capo.png",
      images: [
        "/images/shop/accessories/capo.png",
      ],
      characteristics: [
        { "name": "თავსებადობა", "value": "კლასიკური და აკუსტიკური გიტარა" },
      ],
      category: "აქსესუარები",
      inStock: true
    },
    {
      id: "accessory-gigbag",
      name: "გიტარის ჩასადები",
      price: "25",
      description: "გიტარის უსაფრთხო ტრანსპორტირება ყოველდღე - რბილი შიდა დაცვა, კომფორტული ტარება და მოსახერხებელი ჯიბე აქსესუარებისთვის",
      thumbnail: "/images/shop/accessories/shalita_front.png",
      images: [
        "/images/shop/accessories/shalita_front.png",
        "/images/shop/accessories/shalita_back.png",
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      inStock: true
    },
    {
      id: "accessory-stand",
      name: "გიტარის დასადგამი",
      price: "25",
      description: "გიტარა ყოველთვის უსაფრთხოდ და სწორ პოზიციაში - მყარი კონსტრუქცია, სტაბილური დაჭერა და სწრაფი გაშლა სახლში თუ სტუდიაში",
      thumbnail: "/images/shop/accessories/stand.png",
      images: [
        "/images/shop/accessories/stand.png",
      ],
      characteristics: [
        { "name": "ტიპი", "value": "დასაკეცი იატაკის სტენდი" },
        { "name": "გამოყენება", "value": "სახლი, სტუდია, რეპეტიცია" },
      ],
      category: "აქსესუარები",
      inStock: true
    },
    {
      id: "accessory-picks",
      name: "მედიატორი",
      price: "1",
      description: "უკეთესი კონტროლისთვის",
      thumbnail: "/images/shop/accessories/mediator.png",
      images: [
        "/images/shop/accessories/mediator.png",
      ],
      characteristics: [
        { "name": "რაოდენობა", "value": "1 ცალი" },
      ],
      category: "აქსესუარები",
      inStock: true
    },
  ]

export default shopProducts; 