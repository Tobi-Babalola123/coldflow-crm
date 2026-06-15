import { Resend } from "resend";

console.log("RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("EMAIL API HIT");

  try {
    const body = await req.json();

    console.log("BODY:", body);

    const { to, subject, message } = body;

    const result = await resend.emails.send({
      from: "ColdFlow <onboarding@resend.dev>",
      to,
      subject,
      html: `
        <div>
          <h2>${subject}</h2>
          <p>${message}</p>
        </div>
      `,
    });

    console.log("RESEND RESULT:", result);

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("RESEND ERROR:", error);

    return Response.json(
      {
        success: false,
        error,
      },
      { status: 500 },
    );
  }
}
