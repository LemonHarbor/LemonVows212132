// Script to configure Supabase storage bucket for photos
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase environment variables are not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupPhotosBucket() {
  console.log('Setting up Supabase "photos" storage bucket...');
  
  try {
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }
    
    console.log('Available buckets:', buckets ? buckets.map(b => b.name).join(', ') : 'None');
    
    const photosBucket = buckets ? buckets.find(b => b.name === 'photos') : null;
    
    if (!photosBucket) {
      console.log('⚠️ "photos" bucket not found. Creating bucket...');
      
      // Create the bucket if it doesn't exist
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('photos', {
        public: false, // Not publicly accessible by default
        fileSizeLimit: 10485760, // 10MB limit
      });
      
      if (createError) {
        throw new Error(`Error creating "photos" bucket: ${createError.message}`);
      }
      
      console.log('✅ "photos" bucket created successfully');
      
      // Set up RLS policies for the bucket
      console.log('Setting up RLS policies for the bucket...');
      
      // Allow authenticated users to upload files to their own folder
      const { error: policyError1 } = await supabase.rpc('create_storage_policy', {
        bucket_name: 'photos',
        policy_name: 'Allow authenticated uploads',
        definition: '(auth.uid() = storage.foldername)::text',
        operation: 'INSERT'
      }).catch(() => {
        console.log('Note: RPC method not available, policies should be configured manually');
        return { error: null };
      });
      
      if (policyError1) {
        console.log(`Warning: Could not create upload policy: ${policyError1.message}`);
      }
      
      // Allow authenticated users to read files from their own folder
      const { error: policyError2 } = await supabase.rpc('create_storage_policy', {
        bucket_name: 'photos',
        policy_name: 'Allow authenticated reads',
        definition: '(auth.uid() = storage.foldername)::text',
        operation: 'SELECT'
      }).catch(() => {
        return { error: null };
      });
      
      if (policyError2) {
        console.log(`Warning: Could not create read policy: ${policyError2.message}`);
      }
      
      // Allow authenticated users to delete files from their own folder
      const { error: policyError3 } = await supabase.rpc('create_storage_policy', {
        bucket_name: 'photos',
        policy_name: 'Allow authenticated deletes',
        definition: '(auth.uid() = storage.foldername)::text',
        operation: 'DELETE'
      }).catch(() => {
        return { error: null };
      });
      
      if (policyError3) {
        console.log(`Warning: Could not create delete policy: ${policyError3.message}`);
      }
      
    } else {
      console.log('✅ "photos" bucket exists');
    }
    
    // Test uploading a small file to verify permissions
    const testFile = new Uint8Array([0, 1, 2, 3, 4]);
    const testPath = 'test/test-file.bin';
    
    console.log('Testing upload to verify permissions...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(testPath, testFile, {
        upsert: true
      });
    
    if (uploadError) {
      console.log('⚠️ Upload test failed:', uploadError.message);
      
      if (uploadError.message.includes('Permission denied')) {
        console.log('⚠️ Storage permissions need to be configured for authenticated users');
        console.log('Please ensure the following RLS policies are set in the Supabase dashboard:');
        console.log('1. Allow authenticated users to upload files to their own folder');
        console.log('2. Allow authenticated users to read files from their own folder');
        console.log('3. Allow authenticated users to delete files from their own folder');
      }
    } else {
      console.log('✅ Upload test successful');
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('photos')
        .remove([testPath]);
      
      if (deleteError) {
        console.log('⚠️ Warning: Could not delete test file:', deleteError.message);
      } else {
        console.log('✅ Test file cleanup successful');
      }
    }
    
    console.log('\nStorage configuration completed.');
    console.log('\nRecommendations for Supabase Dashboard:');
    console.log('1. Verify "photos" bucket exists in Storage section');
    console.log('2. Check RLS policies for storage.objects table');
    console.log('3. Ensure authenticated users can upload/read/delete their own files');
    console.log('4. Set appropriate CORS policies if needed for frontend access');
    
  } catch (error) {
    console.error('Error setting up storage configuration:', error.message);
  }
}

// Run the setup
setupPhotosBucket();
