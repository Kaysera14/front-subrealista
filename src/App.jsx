import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { NewUserPage } from "./pages/new-user";
import { NotFound } from "./pages/not-found";
import { LoginUserPage } from "./pages/login-page";
import { UserPage } from "./pages/user-page";
import { PostPage } from "./pages/post-page";
import { Valoraciones } from "./pages/valorations";
import { EditUserPage } from "./pages/edit-user-page";
import { Validate } from "./pages/validate";
import { CreateRentForm } from "./forms/create-rent-form";
import { UsersReservations } from "./pages/user-reservations";
import { useState } from "react";

export function App() {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState();
  const [email, setEmail] = useState("");

  const handleFilteredPosts = (posts) => {
    setFilteredPosts(posts);
  };

  return (
    <>
      <Header
        handleFilteredPosts={handleFilteredPosts}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Routes>
        <Route
          index
          element={
            <Home
              filteredPosts={filteredPosts}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              success={success}
              setSuccess={setSuccess}
            />
          }
        />

        <Route
          path="/register"
          element={<NewUserPage email={email} setEmail={setEmail} />}
        />
        <Route path="/rent-create" element={<CreateRentForm />} />
        <Route path="/login" element={<LoginUserPage />} />
        <Route
          path="/validate"
          element={<Validate email={email} setEmail={setEmail} />}
        />
        <Route path="/users/">
          <Route path=":username" element={<UserPage />} />
          <Route path=":username/update" element={<EditUserPage />} />
        </Route>
        <Route
          path="/rent/:id"
          element={<PostPage setSuccess={setSuccess} success={success} />}
        />
        <Route path="/valorations" element={<Valoraciones />} />
        <Route path="/users-valorations" element={<UsersReservations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
