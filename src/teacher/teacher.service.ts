import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { formatTimestamp } from 'src/utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherImage } from './entities/teacherImage.entity';
@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(TeacherImage)
    private readonly teacherImageRepository: Repository<TeacherImage>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  //TODO 添加教师信息
  async addTeacher(
    { teacher_name, teacher_desc,gender }: any,
    imageArr: any,
    fileName: any,
  ) {
    let stuInfo = {
      teacher_name,
      teacher_desc,
      gender,
      release_time: formatTimestamp() + '',
    };
    try {
      await this.createTeachersWithImages(stuInfo, imageArr);
      return {
        code: 200,
        msg: '添加成功',
      };
    } catch (error) {
      console.log(error, 'stu-service');

      return {
        code: 500,
        msg: '添加失败',
      };
    }
  }
  // TODO 创建学生联合创建图片
  async createTeachersWithImages(stuInfo, imageDataList) {
    const teacher = this.teacherRepository.create(stuInfo);
    const images = imageDataList.map((imageData) => {
      const image = new TeacherImage();
      image.image_path = imageData;
      // @ts-ignore
      image.teacher = teacher;
      image.delete = 0;
      image.image_name = imageData
        .substring(imageData.lastIndexOf('/') + 1, imageData.length)
        .split('.')[0];
      return image;
    });

    await this.teacherRepository.save(teacher);
    await this.teacherImageRepository.save(images);
    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 获取教师信息
  async geTeacherList(pageData: any) {
    let { page, limit, gender} = pageData;
    // 将 type 转换为数组，如果它不是数组类型
    try {
      if (!Array.isArray(gender)) {
        gender = [gender];
      }
      let [results, total] = await this.teacherRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          id: 'DESC',
        },
        relations: ['teacherImage'],
        where: gender[0] ? { gender: In(gender) } : {},
      });
      return {
        list: results,
        count: results.length,
        total,
        next:
          total > page * limit
            ? `/teacher?page=${page + 1}&limit=${limit}`
            : null,
        prev: page > 1 ? `/teacher?page=${page - 1}&limit=${limit}` : null,
        nextPage: +page + 1,
        prevPage: +page - 1,
        // @ts-ignore
        imgArr: results.teacherImage,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'error',
      };
    }
  }
  //TODO 更新新闻数据
  async updateTeacher(
    newsData: any,
    imageDataList: string[],
    oldImages: string[],
  ) {
    await this.entityManager.transaction(async (manager) => {
      let teacher: Teacher;
      let endImagesArr = [...oldImages, ...imageDataList];
      if (newsData.id) {
        // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
        teacher = await manager.findOne(Teacher, {
          where: {
            id: newsData.id,
          },
        });
        if (!teacher) {
          throw new Error('News not found');
        }
        // 更新新闻对象的属性
        
        Object.assign(teacher, newsData);
        // 删除已有的图片对象
        await manager.delete(TeacherImage, { teacher: teacher });
      } else {
        // 创建新闻对象
        teacher = manager.create(Teacher, newsData);
      }
      // console.log('endImagesArr图片集合：',endImagesArr);
      // 创建新的图片对象并关联到新闻对象
      const images = endImagesArr
        .filter((img) => img)
        .map((imageData) => {
          // console.log("图片地址：",imageData);
          const image = manager.create(TeacherImage, {
            image_path: imageData,
            teacher: teacher,
            delete: 0,
            image_name: imageData
              .substring(imageData.lastIndexOf('/') + 1, imageData.length)
              .split('.')[0],
          });
          return image;
        });

      await manager.save(teacher);
      await manager.save(images);
    });

    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 删除新闻及配图
  async deleteTeacher(id: any) {
    try {
      // 删除关联的图片数据
      await this.teacherImageRepository
        .createQueryBuilder()
        .delete()
        .from(TeacherImage)
        .where('teacher = :id', { id })
        .execute();

      // 删除指定的新闻数据
      await this.teacherRepository.delete(id);
      return {
        code: 200,
        message: 'delete success',
        id,
      };
    } catch (error) {
      console.log(error);
      return {
        code:500,
        error
      }
    }
  }
  //TODO 获取新闻数据->后台展示
  async getTeacherCount() {
    try {
      let teacherNum = await this.teacherRepository.count();
      return {
        code: 200,
        data: {
          teacherNum,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        code:500,
        message:'error'
      }
    }
  }
}
