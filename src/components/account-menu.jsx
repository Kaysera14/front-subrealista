import * as React from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/use-logout";

export default function DenseMenu({ active, user }) {
  const navigate = useNavigate();
  const logout = useLogout();

  return active ? (
    user === null ? (
      <Paper
        sx={{ width: "15rem", borderRadius: "20px" }}
        className="absolute top-14 right-10 z-0 drop-shadow-lg"
      >
        <MenuList dense>
          <MenuItem onClick={() => navigate("/register")}>
            <ListItemText>
              <strong>Registrate</strong>
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={() => navigate("/login")}>
            <ListItemText>Iniciar Sesión</ListItemText>
          </MenuItem>

          <Divider />
          <MenuItem onClick={() => navigate("/register")}>
            <ListItemText>Pon tu casa en Subrealista</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    ) : (
      <Paper
        sx={{ width: "15rem", borderRadius: "20px" }}
        className="absolute top-14 right-10 z-0 drop-shadow-lg"
      >
        <MenuList dense>
          <MenuItem onClick={() => navigate(`/users/${user.username}`)}>
            <ListItemText>
              <strong>User Profile</strong>
            </ListItemText>
          </MenuItem>

          <Divider />
          <MenuItem onClick={() => navigate(`/valoraciones`)}>
            <ListItemText>Reservas y valoraciones</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => navigate("/rent-create")}>
            <ListItemText>Pon tu casa en Subrealista</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <ListItemText>Cerrar Sesión</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    )
  ) : null;
}
