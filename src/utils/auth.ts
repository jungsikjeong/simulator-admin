import { supabase } from '@/lib/supabase';

export const checkAdminAuth = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { isLoggedIn: false, isAdmin: false };
  }

  const userId = session.user.id;

  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('id')
    .eq('id', userId)
    .single();

  const isAdmin = !adminError && adminData !== null;

  return { isLoggedIn: true, isAdmin };
};
