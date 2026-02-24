import { supabase } from './supabase';

export interface User {
  id: string;
  username: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export async function saveUsername(userId: string, username: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: checkError.message };
    }

    if (existingUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ username, name, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }
    } else {
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: userId, username, name });

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUser(userId: string): Promise<{ user: User | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return { available: false, error: error.message };
    }

    return { available: !data };
  } catch (error) {
    return { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
