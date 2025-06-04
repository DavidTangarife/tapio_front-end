import { useState } from "react";
import Header from "../../components/ui/Header";
import Welcome from "../../components/ui/Welcome";
import EmailSection from "../../components/ui/EmailSection";
import "./Home.css";
// import { useParams } from "react-router-dom";

const Home = () => {
  const [showEmailSection, setShowEmailSection] = useState(false);
  // const {projectId} = useParams()

  const handleConnectEmails = () => {
    setShowEmailSection(true);
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
