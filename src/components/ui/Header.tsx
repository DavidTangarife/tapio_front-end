import Button from "./Button";
import "./Header.css"
import { Link } from "react-router-dom"

const Header = () => {
return (
  <>
    <section className="header-container">
      <h1 className="logo">Tapio</h1>
      <div className="tgl-btn-container">
        <Link to={"/home"} className="tgl-btn inbox-tgl-btn">Inbox</Link>
        <Link to={"/kanban"} className="tgl-btn board-tgl-btn">Board</Link>
      </div>
      <Button className="user-btn" buttonText="MJ"/>
    </section>
  </>
)
}
export default Header;