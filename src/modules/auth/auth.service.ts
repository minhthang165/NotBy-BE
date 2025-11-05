import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { first } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
   constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<any> {
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
      
      user = await this.userService.create(userData);
    }

    const payload = { sub: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, dob: user.dob };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  /**
   * Validate Google ID token from mobile app (Android/iOS)
   * This verifies the token with Google's servers and creates/returns user
   */
  async validateGoogleIdToken(idToken: string): Promise<any> {
    try {
      // Verify the ID token with Google
      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );

      const { sub: googleId, email, given_name, family_name, picture } = response.data;

      // Check if user exists
      let user = await this.userService.findByGoogleId(googleId);

      if (!user) {
        // Create new user
        const userData: any = {
          googleId,
          email,
          firstName: given_name || '',
          lastName: family_name || '',
          gender: "Unspecified",
          photo: picture || '',
          phoneNumber: null,
          role: 'Parent',
        };
        
        user = await this.userService.create(userData);
      }

      // Generate JWT token
      const payload = { 
        sub: user._id, 
        email: user.email, 
        role: user.role, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        phoneNumber: user.phoneNumber, 
        dob: user.dob 
      };
      const token = this.jwtService.sign(payload);

      return { 
        token, 
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          photo: user.photo,
        }
      };
    } catch (error) {
      console.error('Google token validation error:', error.response?.data || error.message);
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }

  /**
   * Validate user credentials for email/password login
   * Note: You'll need to implement password hashing when adding user registration
   */
  async validateCredentials(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // TODO: Implement password verification when you add password field to User model
    // For now, this is a placeholder
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role, 
      firstName: user.firstName, 
      lastName: user.lastName, 
      phoneNumber: user.phoneNumber, 
      dob: user.dob 
    };
    const token = this.jwtService.sign(payload);

    return { 
      token, 
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        photo: user.photo,
      }
    };
  }
}
