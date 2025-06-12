import { useState } from "react";
import Header from "../../components/ui/Header";
import Welcome from "../../components/ui/Welcome";
// import EmailSection from "../../components/ui/EmailSection";
import "./Home.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmailSection from "./TestEmails";

const Home = () => {
  const [showEmailSection, setShowEmailSection] = useState(false);
  const {projectId} = useParams()
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
      console.log("request sent to fetch-emails")
      if (!res.ok) throw new Error("Failed to fetch and save emails");

      //Navigate to emails view
      navigate(`/projects/${projectId}/emails`);
    } catch (err) {
      console.error("Error connecting emails:", err);
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
        <EmailSection title="UNREAD" />
      )}
    </main>
  );
};
export default Home;
