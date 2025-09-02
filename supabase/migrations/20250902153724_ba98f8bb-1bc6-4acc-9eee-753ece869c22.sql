-- Add admin role to user 305dba5a-2184-4d39-8322-2a26a93c0ca9
INSERT INTO public.user_roles (user_id, role)
VALUES ('305dba5a-2184-4d39-8322-2a26a93c0ca9', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;