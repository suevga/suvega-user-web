import { SignIn } from "@clerk/clerk-react";
import { Helmet } from 'react-helmet-async';
const LoginPage = () => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <Helmet>
        <title>suvega | Login</title>
        <meta name="description" content="Login to your Suvega account to continue shopping." />
        <link rel="canonical" href="https://suveganow.com/login" />
        
      </Helmet>
      <SignIn/>
    </div>
  )
}

export default LoginPage