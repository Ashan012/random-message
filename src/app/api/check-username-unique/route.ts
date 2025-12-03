import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernamValidation } from "@/Schema/signUpSchema";
import z from "zod";

const usernameQuerySchema = z.object({
  username: usernamValidation,
});
export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid Query Parameter",
        },
        { status: 400 }
      );
    }

    const { username }: any = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Error checking username unique" },
      { status: 500 }
    );
  }
}
