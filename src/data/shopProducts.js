const shopProducts = {
  classicGuitars: [
    {
      id: "classic-1",
      name: "Yamaha C40 კლასიკური გიტარა",
      price: "550₾",
      description: "შესანიშნავი საწყისი კლასიკური გიტარა დამწყებთათვის. ნაძვის ხის ზედაპირით და მაღალი ხარისხის სიმებით.",
      thumbnail: "/images/shop/c40.jpg",
      category: "კლასიკური გიტარა",
      inStock: true
    },
    {
      id: "classic-2",
      name: "Cordoba C5 კლასიკური გიტარა",
      price: "990₾",
      description: "მაღალი ხარისხის კლასიკური გიტარა კედრის ხის ზედაპირით და მუქი პალისანდრის გრიფით.",
      thumbnail: "/images/shop/c40.jpg",
      category: "კლასიკური გიტარა",
      inStock: true
    },
    {
      id: "classic-3",
      name: "Martinez MC-58S კლასიკური გიტარა",
      price: "420₾",
      description: "ხელმისაწვდომი კლასიკური გიტარა ღია ფერის ნაძვის ზედაპირით, იდეალურია დამწყებთათვის.",
      thumbnail: "/images/shop/martinez-mc58s.jpg",
      category: "კლასიკური გიტარა",
      inStock: true
    }
  ],
  acousticGuitars: [
    {
      id: "acoustic-1",
      name: "Fender CD-60S აკუსტიკური გიტარა",
      price: "650₾",
      description: "მაგარი ხმის აკუსტიკური გიტარა ნაძვის ხის ზედაპირით და მაჰაგონის გვერდებით, მდიდარი ჟღერადობით.",
      thumbnail: "/images/shop/fender-cd60s.jpg",
      category: "აკუსტიკური გიტარა",
      inStock: true
    },
    {
      id: "acoustic-2",
      name: "Yamaha FG800 აკუსტიკური გიტარა",
      price: "730₾",
      description: "ყველაზე გაყიდვადი აკუსტიკური გიტარა ძლიერი ბასებით და ბალანსირებული ჟღერადობით.",
      thumbnail: "/images/shop/yamaha-fg800.jpg",
      category: "აკუსტიკური გიტარა",
      inStock: true
    },
    {
      id: "acoustic-3",
      name: "Taylor Academy 10e ელექტრო-აკუსტიკური გიტარა",
      price: "1400₾",
      description: "პრემიუმ კლასის ელექტრო-აკუსტიკური გიტარა ჩაშენებული ეკვალაიზერით და Taylor-ის უმაღლესი ხარისხის ჟღერადობით.",
      thumbnail: "/images/shop/taylor-academy.jpg",
      category: "აკუსტიკური გიტარა",
      inStock: true
    }
  ],
  accessories: [
    {
      id: "acc-1",
      name: "Dunlop მედიატორები (5 ცალი)",
      price: "15₾",
      description: "პროფესიონალური მედიატორების ნაკრები, სხვადასხვა სისქით, იდეალური სხვადასხვა სტილის დაკვრისთვის.",
      thumbnail: "/images/shop/dunlop-picks.jpg",
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
      category: "აქსესუარები",
      subCategory: "სადგამი",
      inStock: true
    }
  ]
};

export default shopProducts; 