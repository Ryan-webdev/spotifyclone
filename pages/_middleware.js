import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    //Token exists if the user is logged in
    const token = await getToken({req, 
        secret: process.env.JWT_SECRET,
        secureCookie:
            process.env.NEXTAUTH_URL?.startsWith("https://") ??
        !!process.env.VERCEL_URL
    });
    const { pathname } = req.nextUrl
    //Alow request if the following is true

    if(token && pathname === '/login'){
        return NextResponse.redirect('/');
    }
    
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }


    //Redirect them if they do not have a token and they are trying to go to a protected route
    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login');
    }
}