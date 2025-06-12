
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import "./ViewEmail.css"
import Button from "../../components/ui/Button"
import ViewEmailActionButton from "../../components/ui/ViewEmailActionButton"
import AddToBoardModal from "../../components/ui/AddToBoardModal";
import { ViewKanbanOutlined, TouchAppOutlined, Reply, DeleteOutlined } from '@mui/icons-material';


const ViewEmail = () => {
    const [openModal, setOpenModal] = useState(false);
    const modalData = "";
    const {projectId} = useParams();

    return (
        <>
        <main>
          <section className="header-container">
            <Link to={`/projects/${projectId}/emails`} className="back-btn">Back</Link>
            <h1 className="logo">Tapio</h1>
            <Button className="user-btn" buttonText="MJ"/>
          </section>
          <section className="email-view-container">
            <div className="email-view-sender-details">
              <h3 className="email-view-subject">Thank you for your application</h3>
              <h4 className="email-view-sender">carsales<span className="email-view-sender-address">&#60;notifications@smartrecruiters&#62;</span></h4>
            </div>
            <p className="email-view-body">Hi Maxine,
              <br />
              <br /> 
              Thank you for your application for our Graduate Program - Technology role and congratulations on taking the first step towards being a big part of something big!  
              <br />
              <br />
              While you are waiting to hear back from us, we would love you to get to know us a little better. If you’re not already following us on LinkedIn, please do as we share lots of updates about what our teams are getting up to. Our uniqueness comes from having the combination of being able to provide all the benefits of a big tech company - growth, security and resource - coupled with the feeling of a small organisation, which gives agility, opportunity and autonomy to our people. We’re a place where you can truly move your career forward and we’re proud to offer a dynamic workplace experience which transcends a mere list of perks and benefits. Having said that, we know that benefits are still super important, and you can check out some of what we have on offer here.  
              <br />
              <br />
              We appreciate your patience as we review all the applications we have received.Our aim is to get back to you with an update on the status of your application within 5-10 business days.As a proud Circle Back Initiative employer we are committed to responding to every job applicant, so sit tight!  
              <br />
              <br />
              During the recruitment process we may use various types of assessments such as video interviews, ability assessments or other tasks to help us determine your suitability for the role that you have applied for.  
              <br />
              <br />
              We are an equal opportunity employer, and we pride ourselves on fostering a diverse and inclusive workplace. We understand that individual needs vary, and we can offer support with these assessments should you need. If you have any sensory, physical or other disabilities, we can work with you to support any adjustments to allow you to be at your best through the recruitment process.
              <br />
              <br />
              </p>
            <div className="email-view-btn-panel">
              <ViewEmailActionButton 
                icon={Reply}
                text="Reply"
                value={modalData}
                //onClick={handleReply}
              />
              <ViewEmailActionButton 
                icon={Reply}
                text="Forward"
                value={modalData}
                iconSx={{ transform: 'scaleX(-1)' }}
                //onClick={handleForward}
              />
              <ViewEmailActionButton 
                icon={TouchAppOutlined}
                text="Tap up"
                value={modalData}
                //onClick{handleTapUp}
              />
              <div className="add-to-board-container">
                <ViewEmailActionButton 
                icon={ViewKanbanOutlined}
                text="Add to Board"
                value={modalData}
                onClick={() => setOpenModal(true)}
              />
              {openModal && <AddToBoardModal closeModal={() => setOpenModal(false)}/>}
              </div>
              <ViewEmailActionButton 
                icon={DeleteOutlined}
                text="Delete"
                value={modalData}
                //onClick={handleDelete}
              />
              
            </div>
             
          </section>
        </main>
       
        </>
    )
};

export default ViewEmail;