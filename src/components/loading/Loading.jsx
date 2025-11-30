import "./loading.scss";
import Logo from "/src/assets/logo.svg";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>

      <div className="logo-wrapper">
        <img src={Logo} alt="IASD Logo" className="logo" />
      </div>
    </div>
  );
}
