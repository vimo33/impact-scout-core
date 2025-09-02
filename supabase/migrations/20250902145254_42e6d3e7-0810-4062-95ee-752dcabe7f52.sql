-- Add admin role to the current user account
INSERT INTO public.user_roles (user_id, role)
VALUES ('9df59a2f-1d8e-4e5c-a0e0-1a7c4fb4d257', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;