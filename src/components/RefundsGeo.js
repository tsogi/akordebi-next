import MessengerButton from "./MessengerButton";

export default function RefundsGeo(){
    return <div style={{ padding: '20px' }}>
    <strong>დაბრუნების პოლიტიკა {process.env.NEXT_PUBLIC_DOMAIN}-სთვის</strong>
    <p className="mxedruli"><strong>ბოლო განახლება: </strong>27 აპრილი 2024</p>
    <br></br>
    
    <strong>დაბრუნების პირობები</strong>
    <p className="mxedruli">მომხმარებელს უფლება აქვს მოითხოვოს თანხის დაბრუნება გამოწერის დაწყებიდან 3 (სამი) კალენდარული დღის განმავლობაში.</p>
    
    <br></br>
    <strong>როგორ მოვითხოვოთ თანხის დაბრუნება</strong>
    <p className="mxedruli">თანხის დაბრუნების მოთხოვნისთვის, გთხოვთ მოგვწეროთ მესენჯერზე იმავე ელექტრონული ფოსტის მისამართიდან, რომელიც გამოიყენეთ სერვისის გამოწერისას: <MessengerButton size="sm" inline /></p>
    
    <br></br>
    <strong>თანხის დაბრუნების პროცესი</strong>
    <p className="mxedruli">თქვენი მოთხოვნის მიღების შემდეგ, {process.env.NEXT_PUBLIC_DOMAIN} დაამუშავებს დაბრუნების მოთხოვნას და გააუქმებს თქვენს გამოწერას. თანხის დაბრუნება განხორციელდება იმავე გადახდის მეთოდით, რომელიც თქვენ გამოიყენეთ გადახდისას.</p>
    
    <br></br>
    <strong>შეზღუდვები</strong>
    <p className="mxedruli">გამოწერის დაწყებიდან 3 დღის შემდეგ თანხის დაბრუნება აღარ მოხდება. თანხის დაბრუნება მოხდება მხოლოდ იმ შემთხვევაში, თუ მოთხოვნა გამოგზავნილია იმავე ელექტრონული ფოსტიდან, რომელიც გამოყენებული იყო სერვისის გამოწერისას.</p>
    
    <br></br>
    <strong>დამატებითი კითხვები</strong>
    <p className="mxedruli flex items-center gap-2 flex-wrap">თუ გაქვთ დამატებითი კითხვები დაბრუნების პოლიტიკასთან დაკავშირებით, გთხოვთ დაგვიკავშირდეთ: <MessengerButton size="sm" inline /></p>
  </div> 
} 