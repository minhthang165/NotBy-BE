// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        console.log('Google Auth called');
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        // Set JWT token in cookie
        res.cookie('jwtToken', req.user.token, {
            httpOnly: true,
            sameSite: 'lax', // or 'strict'
            maxAge: 24 * 60 * 60 * 1000, // 1 day   
        });

        if (req.user.role == "Admin") {
            return res.redirect('https://www.notby.id.vn/api-docs');
        } else {
            return res.redirect('https://www.notby.id.vn/dashboard');
        }
    }
    }
