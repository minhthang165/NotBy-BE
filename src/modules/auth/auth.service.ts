import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
   constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<any> {
    console.log('Google profile:', JSON.stringify(profile, null, 2)); // For debugging
    
    const { id, displayName, name, emails, photos } = profile;
    let user = await this.userService.findByGoogleId(id);

    if (!user) {
      const firstName = name?.givenName || displayName?.split(' ')?.[0] || '';
      const lastName = name?.familyName || displayName?.split(' ')?.[1] || '';
      
      const userData: any = {
        googleId: id,
        email: emails?.[0]?.value || '',
        firstName: firstName,
        lastName: lastName,
        gender: "Unspecified", // Default value since Google doesn't provide gender
        photo: photos?.[0]?.value || '',
        phoneNumber: null,
        role: 'Parent', 
      };
      
      // Omitting phoneNumber and dob entirely since Google doesn't provide them
      // This prevents the MongoDB duplicate key error for phoneNumber
      
      user = await this.userService.create(userData);
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }
}
