import Loader from "../../assets/Spinner.svg?react";

const Spinner = () => {
  return (
    <section>
        <h2 className="loader-title">Loading emails</h2>
        <Loader className="spin-loader" />
    </section>
    )
}
export default Spinner;
