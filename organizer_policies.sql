-- Enable Row Level Security on the organizers table
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

-- Policy for viewing organizers (anyone can view)
CREATE POLICY "Anyone can view organizers" 
ON organizers FOR SELECT 
USING (true);

-- Policy for inserting organizers (authenticated users can create)
CREATE POLICY "Authenticated users can create organizers" 
ON organizers FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for updating organizers (only the owner can update)
CREATE POLICY "Organizers can update their own records" 
ON organizers FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for deleting organizers (only the owner can delete)
CREATE POLICY "Organizers can delete their own records" 
ON organizers FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Policy for admins to manage all organizers
CREATE POLICY "Admins can manage all organizers" 
ON organizers 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user owns an organizer record
CREATE OR REPLACE FUNCTION owns_organizer(organizer_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organizers 
    WHERE organizers.id = organizer_id 
    AND organizers.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically set created_at timestamp
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_organizers_created_at
BEFORE INSERT ON organizers
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

-- Create a view for public organizer information
CREATE VIEW public_organizers AS
SELECT 
  id,
  name,
  description,
  email,
  website,
  linkedin,
  twitter,
  instagram,
  created_at
FROM organizers;

-- Grant appropriate permissions
GRANT SELECT ON public_organizers TO anon, authenticated;
GRANT ALL ON organizers TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated; 