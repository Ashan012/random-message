import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { verifyCode, username } = await request.json();

    const User = await UserModel.findOne({
      username,
    });
    if (!User) {
      return Response.json(
        { success: false, message: "User Not Found" },
        { status: 400 }
      );
    }

    const isCodeValid = User.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(User.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      User.isVerified = true;
      await User.save();

      return Response.json(
        { success: true, message: "user Verified Successfuly" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        { success: false, message: "verify code was inncorrect" },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: false,
        message: "verify code was expired please signup again",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("ERROR IN VERIFY USER", error);
    return Response.json({ success: false, message: error }, { status: 400 });
  }
}
