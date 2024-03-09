import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, _) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            throw new BadRequestException(
              `Failed to upload file to Cloudinary: ${error?.message}`,
            );
          }
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
