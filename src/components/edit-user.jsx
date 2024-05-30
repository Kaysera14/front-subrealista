import { useState, useEffect } from "react";
import { Main } from "./main";
import { Link, useNavigate } from "react-router-dom";
import { getUserDataService } from "../services/get_user";
import { updateUser } from "../services/update_user";
import { UserEditForm } from "../forms/user-edit-form";
import { newUserSchema, validateField } from "../utils/joi-validation";

export function UserEditPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDetails = await getUserDataService(username);
        if (userDetails) {
          setFormData({
            email: userDetails.email,
            username: userDetails.username,
            password: userDetails.password,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    const validationError = validateField(name, value, newUserSchema);
    setValidationErrors({
      ...validationErrors,
      [name]: validationError,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = userSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      const updateSuccessful = await updateUser(username, formData);
      if (updateSuccessful) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      setValidationErrors({ _global: "Failed to update user." });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <h1 className="text-4xl block self-center pb-6">Edita tu cuenta</h1>
      <UserEditForm
        formData={formData}
        handleInputChange={handleInputChange}
        validationErrors={validationErrors}
        handleSubmit={handleSubmit}
      />
      <p className="flex justify-center gap-2">
        <Link to="/profile" style={{ color: "var(--quaternary-color)" }}>
          Volver al perfil
        </Link>
      </p>
    </section>
  );
}
