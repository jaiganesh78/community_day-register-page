"use client";

import React, { createContext, useContext, useState } from "react";

export interface BadgeData {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  registrationCode?: string;
  qrImage?: string;
}

interface RegistrationContextType {
  badgeData: BadgeData | null;
  setBadgeData: (data: BadgeData | null) => void;
}

const RegistrationContext = createContext<RegistrationContextType>({
  badgeData: null,
  setBadgeData: () => {},
});

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
  
  return (
    <RegistrationContext.Provider value={{ badgeData, setBadgeData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
