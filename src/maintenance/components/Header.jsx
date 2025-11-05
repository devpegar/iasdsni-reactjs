import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./Header.scss";
import logo from "/assets/logo.png";
import { FaX, FaXTwitter } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo IASD" />
      </div>
      <div className="social">
        <a
          href="https://www.facebook.com/iasdsni"
          target="_blank"
          rel="noreferrer"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://www.instagram.com/iasdsni"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram />
        </a>
        <a href="https://www.x.com/iasdsni" target="_blank" rel="noreferrer">
          <FaXTwitter />
        </a>
      </div>
    </header>
  );
}
