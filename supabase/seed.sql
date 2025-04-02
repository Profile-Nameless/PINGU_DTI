-- Create test user account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'testuser@example.com',
  crypt('TestUser123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create test organizer account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'testorganizer@example.com',
  crypt('TestOrg123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create profiles for test accounts
INSERT INTO public.profiles (id, email, full_name, role, college)
SELECT id, email, 'Test User', 'user', 'Test College'
FROM auth.users
WHERE email = 'testuser@example.com';

INSERT INTO public.profiles (id, email, full_name, role, college)
SELECT id, email, 'Test Organizer', 'organizer', 'Test College'
FROM auth.users
WHERE email = 'testorganizer@example.com'; 