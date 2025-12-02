// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/dashboard', '/dashboard/tasks', '/dashboard/settings'];
const publicRoutes = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;


  if(protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if(publicRoutes.some((route) => pathname.startsWith(route)) && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};