import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    if (!email || !password || !username) {
      return Response.json(
        {
          success: false,
          message: "email username or password is missing",
        },
        { status: 400 }
      );
    }

    const findUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (findUserByEmail) {
      if (findUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user aleardy exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        findUserByEmail.password = String(hashedPassword);
        findUserByEmail.verifyCode = verifyCode;
        findUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await findUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: String(hashedPassword),
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Email Sent Successfully please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error Registring User", error);
    return Response.json(
      {
        success: false,
        message: "Error Registring User",
      },
      { status: 500 }
    );
  }
}
