import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "../styles/admin.scss";

export default function AuthLayout() {
  return (
    <div className="auth-container">
      <Link to="/" className="back-button">
        <IoArrowBack size={22} />
      </Link>

      <div className="auth-box login">
        <LoginForm />
      </div>
    </div>
  );
}
