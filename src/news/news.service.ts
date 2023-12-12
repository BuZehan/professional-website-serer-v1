import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Image } from './entities/images.entiy';
import { NewsImage } from './entities/editorImage.entity';
import { EditorData } from './entities/editorContent.entity';

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
    @InjectRepository(EditorData)
    private readonly editorDataRepository: Repository<EditorData>,
    @InjectRepository(NewsImage)
    private newsImageRepository: Repository<NewsImage>,
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
      console.log('新闻添加失败', error);
      // console.log(news);
      return {
        code: 400,
        msg: '新闻添加失败',
      };
    }
  }
  // 获取所有新闻
  async getNewsList(pageData: any) {
    let { page, limit } = pageData;
    // console.log(page, limit);

    try {
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
    } catch (error) {
      console.log(error);
    }
  }
  // 更新新闻数据
  async updateNews(id, title, content, imageList) {
    try {
      await this.entityManager.transaction(async (manager) => {
        let editorData: EditorData;
        let image_list = JSON.stringify(imageList);
        if (id) {
          // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
          editorData = await manager.findOne(EditorData, {
            where: {
              id,
            },
          });
          if (!editorData) {
            throw new Error('News not found');
          }
          let release_time = formatTimestamp() + '' 
          // 更新新闻对象的属性
          Object.assign(editorData, { title, content, image_list,release_time});
        }

        await manager.save(editorData);
      });

      return {
        code: 200,
        message: 'success',
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        error,
      };
    }
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
  async deleteNews(id: any) {
    try {
      // 删除关联的图片数据
      await this.imageRepository
        .createQueryBuilder()
        .delete()
        .from(EditorData)
        .where('id = :id', { id })
        .execute();

      // 删除指定的新闻数据
      await this.newsRepository.delete(id);
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
      let xwdt = await this.newsRepository.count();
      return {
        code: 200,
        data: {
          xwdt,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
  // 插入图片
  async InsertImage(files: any) {
    try {
      let img = files[0];
      const newsImage = new NewsImage();
      let img_url = `${process.env.ADDRESS}news/${img.filename}`;
      newsImage.url = img_url;
      newsImage.image_name = img.filename;
      await this.newsImageRepository.save(newsImage);
      return {
        errno: 0, // 注意：值是数字，不能是字符串
        data: {
          url: img_url, // 图片 src ，必须
          alt: img.filename, // 图片描述文字，非必须
          href: img_url, // 图片的链接，非必须
        },
      };
    } catch (error) {
      return {
        code: 500,
        error,
      };
    }
  }
  // 插入富文本编辑器数据
  async InsertEditorData(
    editorData: string,
    title: string,
    imageList: string[],
  ) {
    try {
      let editor = new EditorData();
      editor.title = title;
      editor.content = editorData;
      editor.image_list = JSON.stringify(imageList);
      editor.release_time = formatTimestamp() + '';
      await this.editorDataRepository.save(editor);
      return {
        code: 200,
        message: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        error,
      };
    }
  }
  // 获取富文本内容
  async getEditorData(pageData: any) {
    let { page, limit } = pageData;
    // console.log(page, limit);
    try {
      let [results, total] = await this.editorDataRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          id: 'DESC',
        },
      });
      // console.log(results);

      return {
        list: results,
        count: results.length,
        total,
        next:
          total > page * limit
            ? `/editor?page=${page + 1}&limit=${limit}`
            : null,
        prev: page > 1 ? `/editor?page=${page - 1}&limit=${limit}` : null,
        nextPage: +page + 1,
        prevPage: +page - 1,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
