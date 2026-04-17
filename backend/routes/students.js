import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_profile')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to match frontend format
    const students = data.map(student => ({
      id: student.student_id || student.user_id,
      name: `${student.users?.name || ''}`.trim() || 'Unknown',
      department: student.course || 'N/A',
      year: student.year_of_study || 1,
      cgpa: student.cgpa || 0,
      email: student.users?.email || 'N/A',
      phone_number: student.phone_no || 'N/A',
      gender: student.gender || 'N/A',
      category: student.category,
      income: student.income,
    }));

    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single student by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_profile')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .eq('student_id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const student = {
      id: data.student_id || data.user_id,
      name: `${data.users?.name || ''}`.trim() || 'Unknown',
      department: data.course || 'N/A',
      year: data.year_of_study || 1,
      cgpa: data.cgpa || 0,
      email: data.users?.email || 'N/A',
      phone_number: data.phone_no || 'N/A',
      gender: data.gender || 'N/A',
      category: data.category,
      income: data.income,
    };

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get student applications
router.get('/:id/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        scholarships:scholarship_id (*)
      `)
      .eq('student_id', req.params.id)
      .order('applied_date', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get student profile by user_id
router.get('/user/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_profile')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .eq('user_id', req.params.userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const student = {
      id: data.student_id,
      user_id: data.user_id,
      name: data.users?.name || 'Unknown',
      course: data.course || '',
      year: data.year_of_study || 1,
      cgpa: data.cgpa || 0,
      email: data.users?.email || '',
      phone_no: data.phone_no || '',
      gender: data.gender || '',
      category: data.category || '',
      income: data.income || 0,
      hosteller: data.hosteller || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update student profile by user_id
router.put('/user/:userId', async (req, res) => {
  try {
    const { cgpa, income, category, gender, hosteller, course, phone_no, year_of_study, roll_number } = req.body;

    const { data, error } = await supabase
      .from('student_profile')
      .update({
        cgpa,
        income,
        category,
        gender,
        hosteller,
        course,
        phone_no,
        year_of_study,
        roll_number,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', req.params.userId)
      .select(`
        *,
        users:user_id (name, email)
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'Student profile not found' });
    }

    const student = {
      id: data.student_id,
      user_id: data.user_id,
      name: data.users?.name || 'Unknown',
      course: data.course || '',
      year: data.year_of_study || 1,
      cgpa: data.cgpa || 0,
      email: data.users?.email || '',
      phone_no: data.phone_no || '',
      gender: data.gender || '',
      category: data.category || '',
      income: data.income || 0,
      hosteller: data.hosteller || false,
      roll_number: data.roll_number || '',
      updated_at: data.updated_at
    };

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create student profile
router.post('/user/:userId', async (req, res) => {
  try {
    const { cgpa, income, category, gender, hosteller, course, phone_no, year_of_study, roll_number } = req.body;

    const { data, error } = await supabase
      .from('student_profile')
      .insert({
        user_id: req.params.userId,
        cgpa,
        income,
        category,
        gender,
        hosteller,
        course,
        roll_number,
        phone_no,
        year_of_study
      })
      .select(`
        *,
        users:user_id (name, email)
      `)
      .single();

    if (error) throw error;

    const student = {
      id: data.student_id,
      user_id: data.user_id,
      name: data.users?.name || 'Unknown',
      course: data.course || '',
      year: data.year_of_study || 1,
      cgpa: data.cgpa || 0,
      email: data.users?.email || '',
      phone_no: data.phone_no || '',
      gender: data.gender || '',
      category: data.category || '',
      income: data.income || 0,
      hosteller: data.hosteller || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Valid document types for student_docs table
const VALID_DOCUMENT_TYPES = [
  'income_certificate',
  'caste_certificate',
  'report_card',
  'bonafide_certificate',
  'bank_passbook',
  'caste_validity',
  'aadhar_card',
  'pan_card',
  'hostel_id_card',
  'hostel_certificate',
  'domicile'
];

// Upload student document to Supabase Storage and save URL to student_docs table
router.post('/:studentId/documents', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { document_type, file_base64, file_name, content_type } = req.body;

    // Validate document type
    if (!VALID_DOCUMENT_TYPES.includes(document_type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid document type. Must be one of: ${VALID_DOCUMENT_TYPES.join(', ')}`
      });
    }

    // Validate required fields
    if (!file_base64 || !file_name) {
      return res.status(400).json({
        success: false,
        error: 'file_base64 and file_name are required'
      });
    }

    // 1. Create unique file path
    const fileExtension = file_name.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = `${studentId}/${document_type}/${uniqueFileName}`;

    // 2. Convert base64 to buffer and upload to students_documents bucket
    const fileBuffer = Buffer.from(file_base64, 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('students_documents')
      .upload(filePath, fileBuffer, {
        contentType: content_type || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // 3. Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('students_documents')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // 4. Check if student_docs record exists
    const { data: existingDoc, error: checkError } = await supabase
      .from('student_docs')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    // 5. Insert or update the document URL in student_docs table
    let dbResult;
    if (existingDoc) {
      // Update existing record
      const { data, error: dbError } = await supabase
        .from('student_docs')
        .update({ [document_type]: publicUrl })
        .eq('student_id', studentId)
        .select()
        .single();

      if (dbError) throw dbError;
      dbResult = data;
    } else {
      // Insert new record
      const { data, error: dbError } = await supabase
        .from('student_docs')
        .insert({
          student_id: studentId,
          [document_type]: publicUrl
        })
        .select()
        .single();

      if (dbError) throw dbError;
      dbResult = data;
    }

    res.status(201).json({
      success: true,
      data: {
        document_type,
        file_url: publicUrl,
        file_path: filePath,
        student_docs: dbResult
      }
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all documents for a student
router.get('/:studentId/documents', async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from('student_docs')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
