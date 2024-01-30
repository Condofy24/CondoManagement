import { v2 } from 'cloudinary';


export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return v2.config({
      cloud_name: 'dzu5t20lr',
      api_key: '197778941574538',
      api_secret: 'NnNy7LI-lvcJmTlbJXme0xpPx5c',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    });
  },
};