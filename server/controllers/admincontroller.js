import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminmodel from '../models/admin.js';

const JWT_SECRET = "your_jwt_secret"; // Ideally use env variable

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send({ message: "Data missing" });
    }

    const user = await adminmodel.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);

    if (password!==user.password) {
      return res.status(400).send({ message: "Password mismatch" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.error("Error occurred in admin login:", error);
    return res.status(500).send({ message: "Server error" });
  }
};
