import { NextResponse } from "next/server";

const recommendations = [
  "Start with Python foundations, then move into AI mini projects.",
  "Build one portfolio project every two weeks and publish it with a demo link.",
  "For robotics, pair Arduino basics with sensor-based problem statements.",
  "Class 9-12 learners should combine web development with AI APIs and presentation practice."
];

export async function POST(request: Request) {
  const { message } = await request.json();
  const input = String(message ?? "").toLowerCase();
  const answer = input.includes("robot")
    ? recommendations[2]
    : input.includes("portfolio")
      ? recommendations[1]
      : input.includes("class 9") || input.includes("class 10") || input.includes("class 11") || input.includes("class 12")
        ? recommendations[3]
        : recommendations[0];

  return NextResponse.json({
    answer,
    nextSteps: ["Book a mentor demo", "Attempt today's challenge", "Add a project to your portfolio"]
  });
}


