import express from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, password, and role are required'
      });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'This email is already registered. Please sign in instead.'
      });
    }

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert into users table
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        passcode: hashedPassword,
        role
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    // Handle duplicate email error from database
    if (error.code === '23505' || error.message?.includes('unique constraint')) {
      return res.status(409).json({
        success: false,
        error: 'This email is already registered. Please sign in instead.'
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, and role are required' 
      });
    }

    // Find user by email
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, data.passcode);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Check if user role matches expected role
    if (data.role !== role) {
      return res.status(403).json({
        success: false,
        error: `Access denied. You are registered as a ${data.role}, not as a ${role}.`
      });
    }

    // Return user without password
    const { passcode, ...userWithoutPassword } = data;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', req.params.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Return user without password
    const { passcode, ...userWithoutPassword } = data;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
