import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { supabase } from "@/utils/supabase-client";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";

export default function AuthPage() {
  return (
    <>
      <Header />

      <div className="page_container !max-w-lg">
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'facebook']}
          theme=""
          onlyThirdPartyProviders
        />
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  else {
    return {
      props: {},
    }
  }
}