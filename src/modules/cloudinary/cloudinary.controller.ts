import { 
  Controller, 
  Get, 
  Post, 
  UploadedFile, 
  UseInterceptors 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Cloudinary') // groups it in Swagger
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { mimetype } = file;

    if (mimetype.startsWith('image/')) {
      return this.cloudinaryService.uploadImage(file);
    } else if (mimetype.startsWith('video/')) {
      return this.cloudinaryService.uploadVideo(file);
    } else {
      return this.cloudinaryService.uploadFile(file);
    }
  }

  @Get('images')
  async getAllImages() {
    return this.cloudinaryService.getAllImages();
  }

  @Get('videos')
  async getAllVideos() {
    return this.cloudinaryService.getAllVideos();
  }

  @Get('files')
  async getAllFiles() {
    return this.cloudinaryService.getAllFiles();
  }
}
