import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Swiper } from './entities/swiper.entity';
import { SwiperImage } from './entities/swiperImage.entiy';
import { formatTimestamp } from '../utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
@Injectable()
export class SwiperService {
  constructor (
    @InjectRepository(Swiper)
    private readonly siwperRepository: Repository<Swiper>,
    @InjectRepository(SwiperImage)
    private readonly imageRepository: Repository<SwiperImage>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

    // 添加单条新闻
    async addNews({ news_title, news_content }, imageArr: any, fileName: any) {
      let news = {
        news_title,
        news_content,
        release_time: formatTimestamp() + '',
      };
      try {
        await this.createNewsWithImages(news, imageArr);
        return {
          code: 200,
          msg: '添加成功',
        };
      } catch (error) {
        console.log('新闻添加失败', error);
        console.log(news);
  
        return {
          code: 400,
          msg: '新闻添加失败',
        };
      }
    }
    // 获取所有新闻
    async getNewsList(pageData: any) {
      let { page, limit } = pageData;
      // console.log(page,limit);
      try {
        let [results, total] = await this.siwperRepository.findAndCount({
          skip: (page - 1) * limit,
          take: limit,
          order: {
            id: 'DESC',
          },
          relations: ['swiperImage'],
        });
        // console.log(results);
        
        return {
          list: results,
          count: results.length,
          total,
          next:
            total > page * limit ? `/swiper?page=${page + 1}&limit=${limit}` : null,
          prev: page > 1 ? `/swiper?page=${page - 1}&limit=${limit}` : null,
          nextPage: +page + 1,
          prevPage: +page - 1,
          // @ts-ignore
          imgArr: results.swiperImage,
        };
      } catch (error) {
        console.log(error);
      }
    }
    // 更新新闻数据
    async updateNews(
      newsData: any,
      imageDataList: string[],
      oldImages: string[],
    ) {
      await this.entityManager.transaction(async (manager) => {
        let swiper: Swiper;
        let endImagesArr = [...oldImages, ...imageDataList];
        if (newsData.id) {
          // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
          swiper = await manager.findOne(Swiper, {
            where: {
              id: newsData.id,
            },
          });
          if (!swiper) {
            throw new Error('News not found');
          }
          // 更新新闻对象的属性
          Object.assign(swiper, newsData);
          // 删除已有的图片对象
          await manager.delete(SwiperImage, { swiper: swiper });
        } else {
          // 创建新闻对象
          swiper = manager.create(Swiper, newsData);
        }
        // console.log('endImagesArr图片集合：',endImagesArr);
        // 创建新的图片对象并关联到新闻对象
        const images = endImagesArr
          .filter((img) => img)
          .map((imageData) => {
            // console.log("图片地址：",imageData);
            const image = manager.create(SwiperImage, {
              image_path: imageData,
              swiper: swiper,
              delete: 0,
              image_name: imageData
                .substring(imageData.lastIndexOf('/') + 1, imageData.length)
                .split('.')[0],
            });
            return image;
          });
  
        await manager.save(swiper);
        await manager.save(images);
      });
  
      return {
        code: 200,
        message: 'success',
      };
    }
    // 创建新闻联合创建图片
    async createNewsWithImages(newsData, imageDataList) {
      const swiper = this.siwperRepository.create(newsData);
      const images = imageDataList.map((imageData) => {
        const image = new SwiperImage();
        image.image_path = imageData;
        // @ts-ignore
        image.swiper = swiper;
        image.delete = 0;
        image.image_name = imageData
          .substring(imageData.lastIndexOf('/') + 1, imageData.length)
          .split('.')[0];
        return image;
      });
  
      await this.siwperRepository.save(swiper);
      await this.imageRepository.save(images);
      return {
        code: 200,
        message: 'success',
      };
    }
    async getNewsWithImages(id) {
      return this.siwperRepository.find({
        where: {
          id,
        },
        relations: ['swiperImage'],
      });
    }
    // 删除新闻及配图
    async deleteNews(id: any) {
      try {
        // 删除关联的图片数据
        await this.imageRepository
          .createQueryBuilder()
          .delete()
          .from(SwiperImage)
          .where('swiper = :id', { id })
          .execute();
  
        // 删除指定的新闻数据
        await this.siwperRepository.delete(id);
        return {
          code: 200,
          message: 'delete success',
          id,
        };
      } catch (error) {
        console.log(error);
      }
    }
    // 获取新闻数据->后台展示
    async getNewsCount() {
      try {
        let swiper = await this.siwperRepository.count();
        return {
          code: 200,
          data: {
            swiper,
          },
        };
      } catch (error) {
        console.log(error);
      }
    }

}
