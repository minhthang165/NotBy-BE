// src/auth/auth.controller.ts
import { Controller, Get, Post, Body, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthDto, LoginDto, AuthResponseDto } from './dto/google-auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}
    
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        console.log('Google Auth called');
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        // Determine environment
        const cookieOptions: any = {
            httpOnly: false, // Set to false so JavaScript can access it
            path: '/', // Make available across all paths
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };
    
            cookieOptions.secure = true;
            cookieOptions.sameSite = 'none';
            cookieOptions.domain = '.notby.id.vn'; // Leading dot for subdomains
        
        console.log('Cookie options:', cookieOptions);
        
        // Still set the cookie for backward compatibility
        res.cookie('jwtToken', req.user.token, cookieOptions);
        
        // Encode the token to make it URL-safe
        const encodedToken = encodeURIComponent(req.user.token);
        
        // For Deploy
        if (req.user.role == "Admin") {
            return res.redirect(`https://notby-be-8q9y.onrender.com/api-docs?token=${encodedToken}`);
        } else {
            return res.redirect(`https://www.notby.id.vn/dashboard?token=${encodedToken}`);
        }

        //For Localhost Testing
        // if (req.user.role == "Admin") {
        //     return res.redirect(`http://localhost:3000/dashboard?token=${encodedToken}`);
        // } else {
        //     return res.redirect(`http://localhost:3000/dashboard?token=${encodedToken}`);
        // }
    }

    // ============================================
    // MOBILE APP ENDPOINTS (Android/iOS)
    // ============================================

    /**
     * Mobile Google Sign-In endpoint
     * For Android apps using Google Sign-In SDK
     */
    @Post('mobile/google')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Mobile Google Sign-In',
        description: 'Authenticate mobile users with Google ID token from Android/iOS Google Sign-In SDK'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Successfully authenticated with Google',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Invalid Google ID token' })
    async mobileGoogleAuth(@Body() googleAuthDto: GoogleAuthDto) {
        return await this.authService.validateGoogleIdToken(googleAuthDto.idToken);
    }

    /**
     * Email/Password login endpoint (if you implement password auth later)
     */
    @Post('mobile/login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: 'Email/Password Login',
        description: 'Authenticate with email and password (requires password implementation)'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Successfully authenticated',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async mobileLogin(@Body() loginDto: LoginDto) {
        return await this.authService.validateCredentials(loginDto.email, loginDto.password);
    }

    /**
     * Get current user profile (protected endpoint example)
     */
    @Get('mobile/profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Get Current User Profile',
        description: 'Get authenticated user information using JWT token'
    })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
    async getMobileProfile(@Req() req) {
        return {
            user: req.user,
            message: 'Profile retrieved successfully'
        };
    }
}
