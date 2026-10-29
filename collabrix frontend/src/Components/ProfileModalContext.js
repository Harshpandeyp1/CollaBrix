import { createContext, useContext } from "react";

export const ProfileModalContext = createContext({
  activeModal: null,
  openModal: () => {},
  closeModal: () => {},
});

export const useProfileModal = () => useContext(ProfileModalContext);
