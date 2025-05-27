import { useState } from "react";
import Header from "../../components/ui/Header";
import Welcome from "../../components/ui/Welcome"
import EmailSection from "../../components/ui/EmailSection";
import "./Home.css"

const Home = () => {
  const [showEmailSection, setShowEmailSection] = useState(false);
  
  const handleConnectEmails = () => {
    setShowEmailSection(true);
  };

  return (
    <main>
      <Header />
      {!showEmailSection ? (
        <Welcome onConnectEmails={handleConnectEmails}/>
      ) : (<EmailSection title="UNREAD" />)
      }
    </main>
  )
}
export default Home;