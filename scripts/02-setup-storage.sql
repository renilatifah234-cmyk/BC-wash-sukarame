-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload payment proofs
CREATE POLICY "Allow public uploads to payment-proofs bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- Create policy to allow public read access to payment proofs
CREATE POLICY "Allow public read access to payment-proofs bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-proofs');

-- Create policy to allow authenticated users to update their own uploads
CREATE POLICY "Allow public updates to payment-proofs bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'payment-proofs');

-- Create policy to allow authenticated users to delete their own uploads
CREATE POLICY "Allow public deletes from payment-proofs bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'payment-proofs');
