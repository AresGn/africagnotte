import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the authentication cookie
    const response = NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set expiry to a past date
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 