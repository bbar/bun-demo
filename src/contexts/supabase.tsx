import React from "react";
import { type Session, type SupabaseClient } from "@supabase/supabase-js";

export interface ISupabaseContext {
  supabase: SupabaseClient;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

export const SupabaseContext = React.createContext<ISupabaseContext>({
  supabase: undefined!,
  session: null,
  setSession: () => {},
});
