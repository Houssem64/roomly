import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        const token = await getToken({ req: request });
        
        // Check if user is authenticated and is an admin
        if (!token || token.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/admin/:path*']
};