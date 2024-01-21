'use client';
import { INITIAL_ACTIVE } from '@/constants';
import { IActive } from '@/interfaces/common';
import { createContext, useContext, useState } from 'react';

export type ActiveContextType = {
  active: IActive,
  setActive: React.Dispatch<React.SetStateAction<IActive>>,
};

const ActiveContext = createContext<ActiveContextType>({
  active: INITIAL_ACTIVE, 
  setActive: () => { },
});

export const useActive = () => useContext(ActiveContext);

type Props = {
  children: React.ReactNode,
};

export const ActiveContextProvider: React.FC<Props> = ({ children }: Props) => {
  const [active, setActive] = useState<IActive>(INITIAL_ACTIVE);

  return (
    <ActiveContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveContext.Provider>
  );
};