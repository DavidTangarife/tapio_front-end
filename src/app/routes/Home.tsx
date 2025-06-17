import { useState } from "react";
import Header from "../../components/ui/Header";
import Welcome from "../../components/ui/Welcome";
// import EmailSection from "../../components/ui/EmailSection";
import "./Home.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  Loader from "../../assets/Spinner.svg?react"
const Home = () => {
  const [showEmailSection, setShowEmailSection] = useState(false);
  const { projectId } = useParams()
  const navigate = useNavigate()
  
  const handleConnectEmails = async () => {
    setShowEmailSection(true);

    if (!projectId) {
      console.error("No projectId found");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/google-emails", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ projectId })
      });
      if (!res.ok) throw new Error("Failed to fetch and save emails");   
      
      await new Promise(res => setTimeout(res, 600)); 
   
    } catch (err) {
      console.error("Error connecting emails:", err);
    } finally {
      navigate(`/projects/${projectId}/emails`);
    }
  };
  // useEffect(() => {
  //   if (showEmailSection && projectId) {
  //     fetch(`/api/projects/${projectId}/last-login`, {
  //       method: "PATCH",
  //   }).catch((err) => console.error("Failed to update lastLogin:", err));
  //     }
  // }, [showEmailSection, projectId]);

  return (
    <main>
      <Header />
      {!showEmailSection ? (
        <Welcome onConnectEmails={handleConnectEmails} />
      ) : (
        <><h2 className="loader-title">Loading emails</h2><Loader className="spin-loader"/></>
      )}
    </main>
  );
};
export default Home;
