import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    console.log("user====>", user);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found in a database",
        },
        {
          status: 404,
        }
      );
    } else if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user cannot accept message",
        },
        {
          status: 401,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.message.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "sent message successfully",
      },
      {
        status: 401,
      }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "user not found",
      },
      {
        status: 404,
      }
    );
  }
}
