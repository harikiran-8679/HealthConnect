import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, preferredLanguage } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        preferredLanguage: preferredLanguage || 'en',
        role: 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      throw new AppError('Token required', 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, preferredLanguage: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newToken = generateToken(user);

    res.json({
      success: true,
      data: { user, token: newToken },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
        createdAt: true,
        familyMembers: {
          include: {
            records: {
              include: { vaccine: true },
              orderBy: { dueDate: 'asc' },
            },
          },
        },
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, preferredLanguage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, preferredLanguage },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
