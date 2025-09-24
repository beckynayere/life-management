// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { UserModel, User } from '../models/userModel';
// import { authenticateToken, AuthRequest } from '../middleware/auth';

// const router = express.Router();

// // Register route
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await UserModel.findByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const newUser: User = {
//       name,
//       email,
//       password: hashedPassword
//     };

//     const user = await UserModel.create(newUser);

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET as string,
//       { expiresIn: '1h' }
//     );

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await UserModel.findByEmail(email);
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET as string,
//       { expiresIn: '1h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get current user profile
// router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
//   try {
//     const userId = req.user.userId;
//     const user = await UserModel.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;


import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/userModel';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET route for testing/display purposes
router.get('/register', (req, res) => {
  res.json({
    message: 'Use POST method to register a user',
    example: {
      method: 'POST',
      url: '/api/users/register',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      }
    },
    instructions: 'Use Postman, curl, or your frontend app to send a POST request'
  });
});

// POST route for actual registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser: User = {
      name,
      email,
      password: hashedPassword
    };

    const user = await UserModel.create(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Add GET route for login page info as well
router.get('/login', (req, res) => {
  res.json({
    message: 'Use POST method to login',
    example: {
      method: 'POST',
      url: '/api/users/login',
      body: {
        email: 'john@example.com',
        password: 'password123'
      }
    }
  });
});

// Login route (POST)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

export default router;