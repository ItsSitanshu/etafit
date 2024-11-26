require('dotenv').config();

const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL, 
    pass: process.env.SMTP_TOKEN 
  }
});

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 8080;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const JWT_ACCESS_SECRET = process.env.JWT_SECRET; 
const JWT_VERIFY_SECRET = process.env.JWT_VERIFY_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const API_URL = process.env.API_URL;

app.use(express.json());

app.use(cors({
  origin: API_URL,
  credentials: true,
}));


function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

app.post('/api/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: payload.userId, type: payload.type },
      JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json({ accessToken });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return res.status(200).json({ message: 'Logged out' });
});


function generateTokens(user) {
  const accessTokenExpiry = '1h';
  const refreshTokenExpiry = '30d';

  const accessToken = jwt.sign(
    { userId: user.id, type: user.type }, 
    JWT_ACCESS_SECRET, 
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { userId: user.id }, 
    JWT_REFRESH_SECRET, 
    { expiresIn: refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
}

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (!validatePasswordStrength(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long and contain a number.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('*')
      .eq('reg_med->>email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.', existingUser, existingUserError });
    }

    const VSC = JWT_VERIFY_SECRET; 

    const verificationToken = jwt.sign(
      { email: email }, 
      VSC, 
      { expiresIn: '1h' } 
    );

    const { data, error } = await supabase
    .from('users')
    .insert([{ username, reg_med: {'email': email}, password: hashedPassword, is_verified: false, verif_token: verificationToken}]);

    if (error) {
      return res.status(500).json({ error: 'Error creating user.', error });
    }

    
    const verifyEmail = {
      from: "EtaFit HQ.", 
      to: email, 
      subject: 'Verify your registration to EtaFit',
      text: `Hello,
    
      Please verify your email address to complete your registration to EtaFit. Click the link below:
      ${API_URL}/verify-email?token=${verificationToken}
      
      If you did not register, please ignore this email.`,
      html: `
      <table role="presentation" style="width: 100%; padding: 20px; border-spacing: 0;">
      <tr>
        <td align="center" valign="middle">
          <table role="presentation" style="width: 65%; max-width: 500px; background-color: #0F0B15; border-radius: 15px; padding: 20px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
            <tr>
            <td align="center">
                <img src="https://eta-fit.web.app/assets/logo-kOhDhFXS.png" alt="EtaFit Logo" style="width: 150px; height: auto; display: block; margin: 0 auto;">
            </td>
            </tr>
            <tr>
            <td align="center">
              <h2 style="color: #FFF; font-weight: bold;">Welcome to EtaFit!</h2>
            </td>
            </tr>
            <tr>
            <td align="center">
              <p style="color: #FFF;">Thank you for registering. Please verify your email address.</p>
            </td>
            </tr>
            <tr>
            <td align="center">
              <a href="${API_URL}/verify-email?token=${verificationToken}" style="display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: white; background-color: #00DFA2; text-decoration: none; border-radius: 25px;">
                Verify Email
              </a>
            </td>
            </tr>
            <tr>
            <td align="center">
              <p style="color: #FFF;">If you did not register for EtaFit, you can safely ignore this email.</p>
              <p style="font-size: 14px; color: #BBB;">This link will expire in 24 hours.</p>
              <p style="color: #FFF; padding: 0; margin: 0;">Best regards,</p>
              <p style="color: #FFF; font-weight: bold; margin: 0; padding: 0;">The EtaFit Team</p>
            </td>
            </tr>
          </table>
        </td>
      </tr>
      </table>
      `,
    };
  
    transporter.sendMail(verifyEmail, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending verification email', info: error });
      }
    });

    res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePasswordStrength(password) {
  const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\W]{8,}$/;
  return passwordStrengthRegex.test(password);
}


app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  const VSC = JWT_VERIFY_SECRET; 

  jwt.verify(token, VSC, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token', err: err });
    }

    const email = decoded.email;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('reg_med->>email', email)
      .single();

    if (userError || !user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('reg_med->>email', email);

    if (error) {
      return res.status(500).json({ error: 'Failed to update user', details: error });
    }


    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  });
});


app.get('/api/protected', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(data);
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});

const closeServer = () => {
  server.close(() => {
    console.log('Server closed and port released.');
    process.exit(0);
  });
};

process.on('SIGINT', closeServer);  
process.on('SIGTERM', closeServer);
