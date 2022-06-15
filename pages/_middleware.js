import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token exists if the user is logged in:
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;
  //Allow requests if the following is true:
  // If next-auth session provider request || token exists:
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }
  //if the token does not exist, redirect to the login page if the user requests for a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
