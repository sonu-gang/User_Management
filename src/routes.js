import UserCard from "./components/UserCard";
import UserDetail from "./components/UserDetail";

export const routes = [
  {
    path: "/",
    element: <UserCard />,
  },
  {
    path: "/profile/:id",
    element: <UserDetail />,
  },
];
