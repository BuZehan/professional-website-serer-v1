import { Injectable } from '@nestjs/common';
import { CreateHonorDto } from './dto/create-honor.dto';
import { UpdateHonorDto } from './dto/update-honor.dto';
import { Honor } from './entities/honor.entity';
import { HonorImage } from './entities/honorImage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { formatTimestamp } from 'src/utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
@Injectable()
export class HonorService {
  constructor(
    @InjectRepository(Honor)
    private readonly honorRepository: Repository<Honor>,
    @InjectRepository(HonorImage)
    private readonly honorImageRepository: Repository<HonorImage>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  //TODO 添加证书信息
  async addNotification(
    { news_title, news_content, type }: any,
    imageArr: any,
    fileName: any,
  ) {
    let news = {
      news_title,
      news_content,
      release_time: formatTimestamp() + '',
      type: type,
    };
    try {
      await this.createNewsWithImages(news, imageArr);
      return {
        code: 200,
        msg: '添加成功',
      };
    } catch (error) {}
  }
  // TODO 创建证书联合创建图片
  async createNewsWithImages(newsData, imageDataList) {
    const honor = this.honorRepository.create(newsData);
    const images = imageDataList.map((imageData) => {
      const image = new HonorImage();
      image.image_path = imageData;
      // @ts-ignore
      image.honor = honor;
      image.delete = 0;
      image.image_name = imageData
        .substring(imageData.lastIndexOf('/') + 1, imageData.length)
        .split('.')[0];
      return image;
    });

    await this.honorRepository.save(honor);
    await this.honorImageRepository.save(images);
    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 编辑更新证书
  async updateNotification(
    newsData: any,
    imageDataList: string[],
    oldImages: string[],
  ) {
    await this.entityManager.transaction(async (manager) => {
      let honor: Honor;
      let endImagesArr = [...oldImages, ...imageDataList];
      if (newsData.id) {
        // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
        honor = await manager.findOne(Honor, {
          where: {
            id: newsData.id,
          },
        });
        if (!honor) {
          throw new Error('News not found');
        }
        // 更新新闻对象的属性
        Object.assign(honor, newsData);
        // 删除已有的图片对象
        await manager.delete(HonorImage, { honor: honor });
      } else {
        // 创建新闻对象
        honor = manager.create(Honor, newsData);
      }
      // 创建新的图片对象并关联到新闻对象
      const images = endImagesArr
        .filter((img) => img)
        .map((imageData) => {
          // console.log("图片地址：",imageData);
          const image = manager.create(HonorImage, {
            image_path: imageData,
            honor: honor,
            delete: 0,
            image_name: imageData
              .substring(imageData.lastIndexOf('/') + 1, imageData.length)
              .split('.')[0],
          });
          return image;
        });

      await manager.save(honor);
      await manager.save(images);
    });

    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 获取证书
  async getNotificationList(pageData: any) {
    let { page, limit, type } = pageData;
    // 将 type 转换为数组，如果它不是数组类型
    try {
      if (!Array.isArray(type)) {
        type = [type];
      }
      let [results, total] = await this.honorRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          id: 'DESC',
        },
        relations: ['honorImage'],
        where: type[0] ? { type: In(type) } : {},
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
        imgArr: results.honorImage,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'error',
      };
    }
  }
  //TODO 删除证书
  async deleteNotification(id: any) {
    console.log('删除通知公告配图');

    try {
      // 删除关联的图片数据
      await this.honorRepository
        .createQueryBuilder()
        .delete()
        .from(HonorImage)
        .where('honor = :id', { id })
        .execute();

      // 删除指定的新闻数据
      await this.honorRepository.delete(id);
      return {
        code: 200,
        message: 'delete success',
        id,
      };
    } catch (error) {
      console.log(error);
    }
  }
  //TODO 获取证书数量
  async getNotificationCount() {
    try {
      let hjzs = await this.honorRepository.count();
      return {
        code: 200,
        data: {
          hjzs,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}
