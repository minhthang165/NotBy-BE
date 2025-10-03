import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import * as streamifier from "streamifier";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: '272513817554548',
    api_secret: 'Bm8q8JBVSD9Kmsn5zERqG5xpcA0',
}); 

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: 'image',
                folder: 'Image',
                allowed_formats: ['jpg', 'png', 'jpeg'],
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result && result.secure_url) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error("Upload failed: No result or secure_url returned."));
                }
            });
            const stream = streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async uploadVideo(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: 'video',
                folder: 'Video',
                allowed_formats: ['mp4', 'mov', 'avi'],
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result && result.secure_url) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error("Upload failed: No result or secure_url returned."));
                }
            });
            const stream = streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            // Create upload options
            const uploadOptions: any = {
                resource_type: 'auto',
                folder: 'File',
                use_filename: true,
            };
            
            
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (result && result.secure_url) {
                        resolve(result.secure_url);
                    } else {
                        reject(new Error("Upload failed: No result or secure_url returned."));
                    }
                }
            );
            
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    getAllImages() {
        return cloudinary.api.resources({
            resource_type: 'image',
            type: 'upload',
            prefix: 'Image/',
            max_results: 100,
            media_metadata: true,
        });
    }
    
    getAllVideos() {
        return cloudinary.api.resources({
            resource_type: 'video',
            type: 'upload',
            prefix: 'Video/',
            max_results: 100,
            media_metadata: true,
        });
    }

    getAllFiles() {
        return cloudinary.api.resources({
            type: 'upload',
            prefix: 'File/',
            max_results: 100,
            media_metadata: true,
        });
    }
}