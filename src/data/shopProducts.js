const shopProducts = [
    {
      id: "yamaha-c40bl",
      name: "Yamaha C40 Black",
      price: "371",
      description: "საუკეთესო არჩევანი მათთვის ვინც ახლა იწყებს დაკვრის სწავლას",
      thumbnail: "/images/shop/c40/1.png",
      images: [
        "/images/shop/c40/1.png",
        "/images/shop/c40/2.png",
        "/images/shop/c40/3.png",
        "/images/shop/c40/4.png",
        "/images/shop/c40/5.png",
        "/images/shop/c40/6.png",
      ],
      characteristics: [
        { "name": "ზომა", "value": "4/4 სრული ზომა" },
        { "name": "ზედაპირი", "value": "ნაძვი, პრიალა დამუშავებით" },
        { "name": "გრიფი", "value": "ვარდის ხე, მატოვი" },
      ],
      category: "კლასიკური გიტარები",
      inStock: true
    },
    {
      id: "yamaha-cg102",
      name: "Yamaha CG102",
      price: "639",
      description: "საუკეთესო არჩევანი მათთვის ვინც 5 წელზე ნაკლებია უკრავს გიტარაზე",
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
        { "name": "ზედაპირი", "value": "ნაძვი, პრიალა დამუშავებით" },
        { "name": "გრიფი", "value": "ვარდის ხე, მატოვი" },
      ],
      category: "კლასიკური გიტარები",
      inStock: true
    },
    {
      id: "acoustic-1",
      name: "Fender CD-60S",
      price: "650",
      description: "მაგარი ხმის აკუსტიკური გიტარები ნაძვის ხის ზედაპირით და მაჰაგონის გვერდებით, მდიდარი ჟღერადობით.",
      thumbnail: "/images/shop/fender-cd60s.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აკუსტიკური გიტარები",
      inStock: true
    },
    {
      id: "acoustic-2",
      name: "Yamaha FG800",
      price: "730",
      description: "ყველაზე გაყიდვადი აკუსტიკური გიტარები ძლიერი ბასებით და ბალანსირებული ჟღერადობით.",
      thumbnail: "/images/shop/yamaha-fg800.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აკუსტიკური გიტარები",
      inStock: true
    },
    {
      id: "acc-1",
      name: "Dunlop მედიატორები (5 ცალი)",
      price: "15",
      description: "პროფესიონალური მედიატორების ნაკრები, სხვადასხვა სისქით, იდეალური სხვადასხვა სტილის დაკვრისთვის.",
      thumbnail: "/images/shop/dunlop-picks.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "მედიატორი",
      inStock: true
    },
    {
      id: "acc-2",
      name: "KORG CA-50 ციფრული ტიუნერი",
      price: "70₾",
      description: "კომპაქტური და ზუსტი ციფრული ტიუნერი თქვენი გიტარის იდეალური აწყობისთვის.",
      thumbnail: "/images/shop/korg-ca50.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "ტიუნერი",
      inStock: true
    },
    {
      id: "acc-3",
      name: "Kyser Quick-Change კაპო",
      price: "45₾",
      description: "მაღალი ხარისხის, ადვილად გამოსაყენებელი კაპო სწრაფი ტონალური ცვლილებებისთვის.",
      thumbnail: "/images/shop/kyser-capo.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "კაპო",
      inStock: true
    },
    {
      id: "acc-4",
      name: "Levy's სამხრე ქამარი",
      price: "55₾",
      description: "კომფორტული და გამძლე ტყავის სამხრე ქამარი თქვენი გიტარისთვის.",
      thumbnail: "/images/shop/levys-strap.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "სამხრე ქამარი",
      inStock: true
    },
    {
      id: "acc-5",
      name: "Gator კლასიკური გიტარის ჩანთა",
      price: "120₾",
      description: "დაბალნილი, გამძლე ჩანთა თქვენი კლასიკური გიტარის უსაფრთხო ტრანსპორტირებისთვის.",
      thumbnail: "/images/shop/gator-case.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "ჩანთა",
      inStock: true
    },
    {
      id: "acc-6",
      name: "D'Addario EJ45 კლასიკური გიტარის სიმები",
      price: "25₾",
      description: "მაღალი ხარისხის კლასიკური გიტარის სიმების კომპლექტი ნათელი და დაბალანსებული ჟღერადობით.",
      thumbnail: "/images/shop/daddario-ej45.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "კლასიკური სიმები",
      inStock: true
    },
    {
      id: "acc-7",
      name: "Elixir Nanoweb აკუსტიკური გიტარის სიმები",
      price: "40₾",
      description: "ხანგრძლივი ჟღერადობის აკუსტიკური გიტარის სიმები Nanoweb დამცავი დაფარვით.",
      thumbnail: "/images/shop/elixir-strings.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "აკუსტიკური სიმები",
      inStock: true
    },
    {
      id: "acc-8",
      name: "Hercules GS414B გიტარის სადგამი",
      price: "65₾",
      description: "მყარი და სტაბილური სადგამი თქვენი გიტარისთვის, ადვილი დაკეცვის მექანიზმით.",
      thumbnail: "/images/shop/hercules-stand.jpg",
      images: [
      ],
      characteristics: [
      ],
      category: "აქსესუარები",
      subCategory: "სადგამი",
      inStock: true
    }
  ]

export default shopProducts; 