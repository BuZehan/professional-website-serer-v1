import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Image } from './entities/images.entiy';
import { formatTimestamp } from '../utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  // 添加单条新闻
  async addNews({ news_title, news_content }, imageArr: any, fileName: any) {
    let news = {
      news_title,
      news_content,
      release_time: formatTimestamp() + '',
      images_arr: JSON.stringify(fileName),
    };
    try {
      await this.createNewsWithImages(news, imageArr);
      return {
        code: 200,
        msg: '添加成功',
      };
    } catch (error) {
      console.log('新闻添加失败',error);
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
    let [results, total] = await this.newsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      },
      relations: ['images'],
    });
    return {
      list: results,
      count: results.length,
      total,
      next:
        total > page * limit ? `/used?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `/used?page=${page - 1}&limit=${limit}` : null,
      nextPage: +page + 1,
      prevPage: +page - 1,
      // @ts-ignore
      imgArr: results.images,
    };
  }
  // 更新新闻数据
  async updateNews(
    newsData: any,
    imageDataList: string[],
    oldImages: string[],
  ) {
    await this.entityManager.transaction(async (manager) => {
      let news: News;
      let endImagesArr = [...oldImages, ...imageDataList];
      if (newsData.id) {
        // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
        news = await manager.findOne(News, {
          where: {
            id: newsData.id,
          },
        });
        if (!news) {
          throw new Error('News not found');
        }
        // 更新新闻对象的属性
        Object.assign(news, newsData);
        // 删除已有的图片对象
       await manager.delete(Image, { news: news });
      } else {
        // 创建新闻对象
        news = manager.create(News, newsData);
      }
      // console.log('endImagesArr图片集合：',endImagesArr);
      // 创建新的图片对象并关联到新闻对象
      const images = endImagesArr.filter(img => img).map((imageData) => {
        // console.log("图片地址：",imageData);
        const image = manager.create(Image, {
          image_path: imageData,
          news: news,
          delete: 0,
          image_name: imageData
            .substring(imageData.lastIndexOf('/') + 1, imageData.length)
            .split('.')[0],
        });
        return image;
      });

      await manager.save(news);
      await manager.save(images);
    });

    return {
      code: 200,
      message: 'success',
    };
  }
  // 创建新闻联合创建图片
  async createNewsWithImages(newsData, imageDataList) {
    const news = this.newsRepository.create(newsData);
    const images = imageDataList.map((imageData) => {
      const image = new Image();
      image.image_path = imageData;
      // @ts-ignore
      image.news = news;
      image.delete = 0;
      image.image_name = imageData
        .substring(imageData.lastIndexOf('/') + 1, imageData.length)
        .split('.')[0];
      return image;
    });

    await this.newsRepository.save(news);
    await this.imageRepository.save(images);
    return {
      code: 200,
      message: 'success',
    };
  }
  async getNewsWithImages(id) {
    return this.newsRepository.find({
      where: {
        id,
      },
      relations: ['images'],
    });
  }
  // 删除新闻及配图
  async deleteNews(id:any) {
  try {
    // 删除关联的图片数据
    await this.imageRepository.createQueryBuilder()
      .delete()
      .from(Image)
      .where("news = :id", { id })
      .execute();

   // 删除指定的新闻数据
   await this.newsRepository.delete(id);
    return {
      code:200,
      message:"delete success",
      id
    }
  } catch (error) {
    console.log(error);
    
  }
  }
  // 获取新闻数据->后台展示
  async getNewsCount() {
    try {
      let xwdt = await this.newsRepository.count();
      return {
        code:200,
        data:{
          xwdt
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
}
