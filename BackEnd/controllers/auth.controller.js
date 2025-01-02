const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../email');
const crypto = require('crypto');
const mongoose = require('mongoose');

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      role: user.role,
      image: user.image,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

exports.addUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === '') {
      throw new Error('Name is required');
    }

    if (!email || !validator.isEmail(email)) {
      throw new Error('A valid email is required');
    }

    if (
      !password ||
      !validator.isStrongPassword(password)
    ) {
      throw new Error(
        'Password must be strong. Include at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.',
      );
    }

    const existingUser = await User.findOne({
      email,
    }).session(session);
    if (existingUser) {
      throw new Error(
        `The email ${email} is already registered.`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = crypto.randomInt(
      100000,
      999999,
    );
    const verificationCodeExpires =
      Date.now() + 5 * 60 * 1000;

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      emailVerificationCode: verificationCode,
      verificationCodeExpires: verificationCodeExpires,
    });

    await newUser.save({ session });

    console.log('Sending email to:', email);

    const emailContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            text-align: center;
            padding-bottom: 20px;
          }
          .email-header h1 {
            color: #4CAF50;
          }
          .email-body {
            font-size: 16px;
            line-height: 1.6;
          }
          .verification-code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #e8f5e9;
            border: 1px solid #4CAF50;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 14px;
            color: #777;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Welcome to Our Service, ${name}!</h1>
          </div>
          <div class="email-body">
            <p>Hi ${name},</p>
            <p>Thank you for registering with us. To complete your registration, please use the verification code below:</p>
            <div class="verification-code">${verificationCode}</div>
            <p>Please enter this code on the verification page to activate your account.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing us!</p>
            <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact our support team</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;

    await sendEmail({
      email: email,
      subject: 'Verify Your Email Address',
      html: emailContent,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message:
        'User registered successfully. Please verify your email to activate your account.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
    console.error(
      `Error during user registration: ${error}`,
    );
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send('Email and password are required');
    }

    console.log('Login Request Body:', req.body);

    const user = await User.findOne({ email }).select(
      '+password',
    );
    if (!user) {
      console.log('User not found for email:', email);
      return res
        .status(401)
        .send('Invalid email or password');
    }

    console.log('User retrieved from DB:', user);

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res
        .status(401)
        .send('Invalid email or password');
    }

    const token = signToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'No user found with this email' });
    }

    const resetToken = user.createResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${process.env.FRONTEND_URL}/${resetToken}`;

    const resetEmailContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 30px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          text-align: center;
          padding-bottom: 20px;
        }
        .email-header h1 {
          color: #4CAF50;
        }
        .email-body {
          font-size: 16px;
          line-height: 1.6;
        }
        .reset-link {
          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          display: inline-block;
          padding: 10px 20px;
          margin: 20px 0;
          background-color: #4CAF50;
          border-radius: 5px;
          text-decoration: none;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          font-size: 14px;
          color: #777;
        }
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="email-body">
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
           <a class="reset-link" href="${resetURL}">Reset Your Password</a>
          <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
          <p>The link is valid for only 10 minutes.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing us!</p>
          <p>If you have any questions, feel free to <a href="mailto:padeloteamcs@gmail.com">contact our support team</a>.</p>
        </div>
      </div>
    </body>
  </html>
`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: resetEmailContent,
    });

    return res.status(200).json({
      message: 'email has been sent successfully',
    });
  } catch (err) {
    console.error('Error sending email:', err);

    return res.status(500).json({
      message:
        'There was an error sending the email. Try again later.',
    });
  }
};
exports.ResetPassword = async (req, res) => {
  const hashedtoken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedtoken,
    passwordResetexpires: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json({ message: 'Token is invalid or expired' });
  }

  user.password = await bcrypt.hash(req.body.password, 10);

  user.passwordResetToken = undefined;
  user.passwordResetexpires = undefined;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({ user, token });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found' });
    }
    const token = signToken(user);
    console.log(code, user.verificationCode);
    if (
      user.emailVerificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({
        error: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ error: 'Email is already verified' });
    }

    if (user.verificationCodeExpires < Date.now()) {
      const verificationCode = crypto.randomInt(
        100000,
        999999,
      );
      const verificationCodeExpires =
        Date.now() + 5 * 60 * 1000;

      user.emailVerificationCode = verificationCode;
      user.verificationCodeExpires =
        verificationCodeExpires;

      await user.save();

      const emailContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 30px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                text-align: center;
                padding-bottom: 20px;
              }
              .email-header h1 {
                color: #4CAF50;
              }
              .email-body {
                font-size: 16px;
                line-height: 1.6;
              }
              .verification-code {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #e8f5e9;
                border: 1px solid #4CAF50;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                padding-top: 20px;
                font-size: 14px;
                color: #777;
              }
              .footer a {
                color: #4CAF50;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h1>Verify Your Email Address, ${user.name}!</h1>
              </div>
              <div class="email-body">
                <p>Hi ${user.name},</p>
                <p>It seems like you didn't complete the email verification. Here is your new verification code:</p>
                <div class="verification-code">${verificationCode}</div>
                <p>Please enter this code on the verification page to activate your account.</p>
                <p>If you did not request this, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>Thank you for choosing us!</p>
                <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact our support team</a>.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email Address',
        html: emailContent,
      });

      return res.status(200).json({
        message:
          'A new verification code has been sent to your email.',
      });
    } else {
      return res.status(400).json({
        error:
          'Your verification code is still valid. Please check your inbox.',
      });
    }
  } catch (error) {
    console.error(
      'Error during resend verification code:',
      error,
    );
    res
      .status(500)
      .json({ error: 'Error resending verification code' });
  }
};
