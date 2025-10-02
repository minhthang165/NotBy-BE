// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';


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
}
