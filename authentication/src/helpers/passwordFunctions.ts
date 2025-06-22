import bcrypt from 'bcrypt';

const saltRounds = 10;

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Password hashing failed');
  }
};

// Verify a password
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Verification error:', error);
    throw new Error('Password verification failed');
  }
};