export default function PrivacyGeo(){
    return <div style={{ padding: '20px' }}>
      <h1>Privacy Policy for {process.env.NEXT_PUBLIC_DOMAIN}</h1>
      <p><strong>Last Updated:</strong> 1 Jan 2024</p>
      
      <section className="mt-[30px]">
        <strong>Introduction</strong>
        <p>Welcome to {process.env.NEXT_PUBLIC_DOMAIN}. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
      </section>

      <section className="mt-[30px]">
        <strong>Information We Collect</strong>
        <p>As part of our Service, we collect the following information:</p>
        <ul>
          <li>Email addresses from users who authenticate using Supabase Gmail and Facebook auth.</li>
          <li>IP addresses to enable non-registered users to vote for songs.</li>
        </ul>
      </section>

      <section className="mt-[30px]">
        <strong>How We Use Your Information</strong>
        <p>We use your email to create a unique account for you to save your favorite songs. Your IP address is used to ensure that voting for songs is fair and prevents multiple votes from a single user.</p>
      </section>

      <section className="mt-[30px]">
        <strong>Sharing Your Information</strong>
        <p>We do not share your personal information with third parties except as necessary to provide our service or as required by law.</p>
      </section>

      <section className="mt-[30px]">
        <strong>Your Rights</strong>
        <p>You have the right to access, correct, delete, or transfer your personal data that we hold. You also have the right to complain to a Data Protection Authority about our collection and use of your personal data.</p>
      </section>

      <section className="mt-[30px]">
        <strong>Security of Your Data</strong>
        <p>We are committed to protecting the security of your personal data. We use a variety of security technologies and procedures to help protect your personal data from unauthorized access, use, or disclosure.</p>
      </section>

      <section className="mt-[30px]">
        <strong>Changes to This Privacy Policy</strong>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      </section>

      <section className="mt-[30px]">
        <strong>Contact Us</strong>
        <p>If you have any questions about this Privacy Policy, You can contact us:</p>
        <ul>
          <li>By email: tsogiaidze1@gmail.com</li>
        </ul>
      </section>
    </div>
}