import prisma from "../../config/prisma";
import { Request, Response } from "express";
import { AuthFactory, JwtPayload } from "../../services/authFactory"

const authService = AuthFactory();

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!!",
      });
    }

    const account = await prisma.user.findUnique({
      where: { email },
    });

    if (!account || !account.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid account!",
      });
    }

    const isMatch = await authService.comparePassword(
      password,
      account.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const payload: JwtPayload = { id: account.id};
    const token = authService.generateToken(payload);

    return res.status(200).json({
      success: true,
      token,
      message: "Login Successfully",
      person: {
        userId: account.id,
        username: account.name,
        email: account.email,
        phone: account.phone,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};


// const register = async (req, res) => {
//   try {
//     const { personId, username, password } = req.body;

//     if (!personId || !username || !password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required!!" });
//     }

//     const hashedPassword = await authService.hashPassword(password);

//     const existingAccount = await prisma.account.findFirst({
//       where: { personId },
//     });

//     const existingUsername = await prisma.account.findUnique({
//       where: { username },
//     });

//     if (existingAccount) {
//       return res
//         .status(401)
//         .json({ success: false, message: "This person already has an account!" });
//     }

//     if (existingUsername) {
//       return res
//         .status(401)
//         .json({ success: false, message: "This username already exists!" });
//     }

//     const newAccount = await prisma.account.create({
//       data: {
//         personId,
//         username,
//         password: hashedPassword,
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Account Created Successfully!",
//       account: newAccount,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error " + error.message,
//     });
//   }
// };

export default login