// supabaseClient.js - Create a separate file for the Supabase client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qajhpdllidaxrggkyant.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhamhwZGxsaWRheHJnZ2t5YW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNjc2MTgsImV4cCI6MjA1Nzc0MzYxOH0.XBRfhg2I6Rn686tnoJmvA18rREs2m0hY_95Bn7HdaSY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Adding helper functions to work with models
export const fetchModels = async () => {
  const { data, error } = await supabase
    .from('ar_models')
    .select('*');
  
  if (error) {
    console.error('Error fetching models:', error);
    return [];
  }
  
  return data || [];
};

export const getModelUrl = async (modelId) => {
  // First, we get the model information
  const { data, error } = await supabase
    .from('ar_models')
    .select('file_path')
    .eq('id', modelId)
    .single();
  
  if (error) {
    console.error('Error fetching model info:', error);
    return null;
  }
  
  if (!data || !data.file_path) {
    console.error('Model not found or file path missing');
    return null;
  }
  
  // Now we create the public download URL
  const { data: fileData, error: fileError } = await supabase
    .storage
    .from('ar_models_bucket')  // Name of the bucket in Supabase storage
    .createSignedUrl(data.file_path, 3600); // URL valid for 1 hour
  
  if (fileError) {
    console.error('Error creating signed URL:', fileError);
    return null;
  }
  
  return fileData?.signedUrl || null;
};

// Function to upload a new model
export const uploadModel = async (file, modelName, description) => {
  // 1. Upload the file to Supabase storage
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `models/${fileName}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('ar_models_bucket')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { success: false, error: uploadError };
  }
  
  // 2. Save model information in the database
  const { data: modelData, error: modelError } = await supabase
    .from('ar_models')
    .insert([
      { 
        name: modelName,
        description: description,
        file_path: filePath,
        created_at: new Date()
      }
    ]);
  
  if (modelError) {
    console.error('Error saving model info:', modelError);
    return { success: false, error: modelError };
  }
  
  return { success: true, data: modelData };
};
