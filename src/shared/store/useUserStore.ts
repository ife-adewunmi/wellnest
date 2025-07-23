import {create}  from "zustand"

interface UserStore {

    user: {id: string; first_name: string; last_name: string; email: string; password: string;} | null;
    setUser: (user: {id: string; first_name: string; last_name: string; email: string; password: string;}) => void;
}


export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user })
}))

