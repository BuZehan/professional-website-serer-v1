import { PartialType } from '@nestjs/mapped-types';
import { CreateSwiperDto } from './create-swiper.dto';

export class UpdateSwiperDto extends PartialType(CreateSwiperDto) {}
