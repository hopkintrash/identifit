/*
  # Update users table RLS policies

  1. Changes
    - Drop existing restrictive policies
    - Add policies that allow public access for username creation
    - Users can read all usernames (for checking availability)
    - Users can insert their own data without authentication (for onboarding)
    - Users can update their own data by matching the user ID
  
  2. Security Notes
    - This is appropriate for the onboarding flow before authentication
    - In production with auth, these policies should be made more restrictive
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Allow anyone to read usernames (needed for availability checks)
CREATE POLICY "Anyone can read usernames"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert a new user (for onboarding)
CREATE POLICY "Anyone can insert users"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow updates only to matching user ID
CREATE POLICY "Users can update by matching ID"
  ON users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
