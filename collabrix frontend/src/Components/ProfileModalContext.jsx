import { useMemo, useState } from "react";
import { ProfileModalContext } from "./ProfileModalContext.js";

export const ProfileModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const value = useMemo(
    () => ({
      activeModal,
      openModal: setActiveModal,
      closeModal: () => setActiveModal(null),
    }),
    [activeModal],
  );

  return (
    <ProfileModalContext.Provider value={value}>
      {children}
    </ProfileModalContext.Provider>
  );
};
