import Button from "./Button";
import "./Header.css"

const Header = () => {
return (
  <>
    <section className="header-container">
      <h1 className="logo">Tapio</h1>
      <div className="tgl-btn-container">
        <button className="tgl-btn inbox-tgl-btn">Inbox</button>
        <button className="tgl-btn board-tgl-btn">Board</button>
      </div>
      <Button className="user-btn" buttonText="MJ"/>
    </section>
  </>
)
}
export default Header;