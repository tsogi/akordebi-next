import MessengerButton from "./MessengerButton";

export default function RefundsEng(){
    return <div style={{ padding: '20px' }}>
    <strong>Refund Policy for {process.env.NEXT_PUBLIC_DOMAIN}</strong>
    <p><strong>Last Updated: </strong>April 27, 2024</p>
    <br></br>
    
    <strong>Refund Terms</strong>
    <p>Users have the right to receive a refund within 3 (three) calendar days from the start of their subscription.</p>
    
    <br></br>
    <strong>How to Request a Refund</strong>
    <p>To request a refund, please contact us via Messenger from the same email address that you used to subscribe to the service: <MessengerButton text="Write Us" size="sm" inline /></p>
    
    <br></br>
    <strong>Refund Process</strong>
    <p>Upon receiving your request, {process.env.NEXT_PUBLIC_DOMAIN} will process the refund request and cancel your subscription. The refund will be processed using the same payment method that you used for the payment.</p>
    
    <br></br>
    <strong>Limitations</strong>
    <p>No refunds will be issued after 3 days from the subscription start date. Refunds will only be processed if the request is sent from the same email address that was used to subscribe to the service.</p>
    
    <br></br>
    <strong>Additional Questions</strong>
    <p className="flex items-center gap-2 flex-wrap">If you have any additional questions about the refund policy, please contact us: <MessengerButton text="Write Us" size="sm" inline /></p>
  </div> 
} 