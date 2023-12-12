import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { formatTimestamp } from 'src/utils';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Student } from './entities/student.entity';
import { StudentImage } from './entities/studentImage.entity';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentImage)
    private readonly studentImageRepository: Repository<StudentImage>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  //TODO 添加学生信息
  async addStu(
    { student_name, student_desc, grade }: any,
    imageArr: any,
    fileName: any,
  ) {
    let stuInfo = {
      student_name,
      student_desc,
      release_time: formatTimestamp() + '',
      grade: grade,
    };
    try {
      await this.createStudentsWithImages(stuInfo, imageArr);
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
  async createStudentsWithImages(stuInfo, imageDataList) {
    const student = this.studentRepository.create(stuInfo);
    const images = imageDataList.map((imageData) => {
      const image = new StudentImage();
      image.image_path = imageData;
      // @ts-ignore
      image.student = student;
      image.delete = 0;
      image.image_name = imageData
        .substring(imageData.lastIndexOf('/') + 1, imageData.length)
        .split('.')[0];
      return image;
    });

    await this.studentRepository.save(student);
    await this.studentImageRepository.save(images);
    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 获取学生信息
  async geStuList(pageData: any) {
    let { page, limit, grade } = pageData;
    // 将 type 转换为数组，如果它不是数组类型
    try {
      if (!Array.isArray(grade)) {
        grade = [grade];
      }
      let [results, total] = await this.studentRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          id: 'DESC',
        },
        relations: ['studentImage'],
        where: grade[0] ? { grade: In(grade) } : {},
      });
      return {
        list: results,
        count: results.length,
        total,
        next:
          total > page * limit
            ? `/student?page=${page + 1}&limit=${limit}`
            : null,
        prev: page > 1 ? `/student?page=${page - 1}&limit=${limit}` : null,
        nextPage: +page + 1,
        prevPage: +page - 1,
        // @ts-ignore
        imgArr: results.studentImage,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'error',
      };
    }
  }
  //TODO 更新新闻数据
  async updateStu(
    newsData: any,
    imageDataList: string[],
    oldImages: string[],
  ) {
    await this.entityManager.transaction(async (manager) => {
      let student: Student;
      let endImagesArr = [...oldImages, ...imageDataList];
      if (newsData.id) {
        // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
        student = await manager.findOne(Student, {
          where: {
            id: newsData.id,
          },
        });
        if (!student) {
          throw new Error('News not found');
        }
        // 更新新闻对象的属性
        
        Object.assign(student, newsData);
        // 删除已有的图片对象
        await manager.delete(StudentImage, { student: student });
      } else {
        // 创建新闻对象
        student = manager.create(Student, newsData);
      }
      // console.log('endImagesArr图片集合：',endImagesArr);
      // 创建新的图片对象并关联到新闻对象
      const images = endImagesArr
        .filter((img) => img)
        .map((imageData) => {
          // console.log("图片地址：",imageData);
          const image = manager.create(StudentImage, {
            image_path: imageData,
            student: student,
            delete: 0,
            image_name: imageData
              .substring(imageData.lastIndexOf('/') + 1, imageData.length)
              .split('.')[0],
          });
          return image;
        });

      await manager.save(student);
      await manager.save(images);
    });

    return {
      code: 200,
      message: 'success',
    };
  }
  //TODO 删除新闻及配图
  async deleteStu(id: any) {
    try {
      // 删除关联的图片数据
      await this.studentImageRepository
        .createQueryBuilder()
        .delete()
        .from(StudentImage)
        .where('student = :id', { id })
        .execute();

      // 删除指定的新闻数据
      await this.studentRepository.delete(id);
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
  async getStuCount() {
    try {
      let stuNum = await this.studentRepository.count();
      return {
        code: 200,
        data: {
          stuNum,
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
