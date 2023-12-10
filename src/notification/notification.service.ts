import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NewsService } from 'src/news/news.service';
import { Notification } from './entities/notification.entity';
import { NotificationImage } from './entities/notificationImage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatTimestamp } from 'src/utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationImage)
    private readonly notificationImageRepository: Repository<NotificationImage>,
    private readonly newsService: NewsService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  //TODO 添加公告信息
  async addNotification(
    { news_title, news_content }: any,
    imageArr: any,
    fileName: any,
  ) {
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
    } catch (error) {}
  }
  //TODO 编辑更新公告
  async updateNotification(
    newsData: any,
    imageDataList: string[],
    oldImages: string[],
  ) {
    await this.entityManager.transaction(async (manager) => {
      let notification: Notification;
      let endImagesArr = [...oldImages, ...imageDataList];
      if (newsData.id) {
        // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
        notification = await manager.findOne(Notification, {
          where: {
            id: newsData.id,
          },
        });
        if (!notification) {
          throw new Error('News not found');
        }
        // 更新新闻对象的属性
        Object.assign(notification, newsData);
        // 删除已有的图片对象
        await manager.delete(NotificationImage, { notification: notification });
      } else {
        // 创建新闻对象
        notification = manager.create(Notification, newsData);
      }
      // console.log('endImagesArr图片集合：',endImagesArr);
      // 创建新的图片对象并关联到新闻对象
      const images = endImagesArr
        .filter((img) => img)
        .map((imageData) => {
          // console.log("图片地址：",imageData);
          const image = manager.create(NotificationImage, {
            image_path: imageData,
            notification:notification ,
            delete: 0,
            image_name: imageData
              .substring(imageData.lastIndexOf('/') + 1, imageData.length)
              .split('.')[0],
          });
          return image;
        });

      await manager.save(notification);
      await manager.save(images);
    });

    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 获取公告
  async getNotificationList(pageData: any) {
    let { page, limit } = pageData;
    let [results, total] = await this.notificationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      },
      relations: ['notificationImage'],
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
      imgArr: results.notificationImage,
    };
  }
  //TODO 删除新闻
  async deleteNotification(id: any) {
    console.log('删除通知公告配图');
    
    try {
      // 删除关联的图片数据
      await this.notificationRepository.createQueryBuilder()
        .delete()
        .from(NotificationImage)
        .where("notification = :id", { id })
        .execute();
  
     // 删除指定的新闻数据
     await this.notificationRepository.delete(id);
      return {
        code:200,
        message:"delete success",
        id
      }
    } catch (error) {
      console.log(error);
      
    }
    }
  //TODO 获取通知公告数量
  async getNotificationCount() {
    try {
      let tzgg = await this.notificationRepository.count();
      return {
        code:200,
        data:{
          tzgg
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  // TODO 创建新闻联合创建图片
  async createNewsWithImages(newsData, imageDataList) {
    const notification = this.notificationRepository.create(newsData);
    const images = imageDataList.map((imageData) => {
      const image = new NotificationImage();
      image.image_path = imageData;
      // @ts-ignore
      image.notification = notification;
      image.delete = 0;
      image.image_name = imageData
        .substring(imageData.lastIndexOf('/') + 1, imageData.length)
        .split('.')[0];
      return image;
    });

    await this.notificationRepository.save(notification);
    await this.notificationImageRepository.save(images);
    return {
      code: 200,
      message: 'success',
    };
  }
}
