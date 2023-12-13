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

  //TODO 获取学生信息
  async geStuList(pageData: any) {
    let { page, limit } = pageData;
    // 将 type 转换为数组，如果它不是数组类型
    try {
      // if (!Array.isArray(grade)) {
      //   grade = [grade];
      // }
      let [results, total] = await this.studentRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          id: 'DESC',
        },
        // relations: ['studentImage'],
        // where: grade[0] ? { grade: In(grade) } : {},
      });
      // console.log(results);
      
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
        imgArr: results.image_list,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'error',
      };
    }
  }
  // 插入图片
  async InsertImage(files: any) {
    try {
      let img = files[0];
      const newsImage = new StudentImage();
      let img_url = `${process.env.ADDRESS}student/${img.filename}`;
      newsImage.url = img_url;
      newsImage.image_name = img.filename;
      await this.studentImageRepository.save(newsImage);
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
      let editor = new Student();
      editor.title = title;
      editor.content = editorData;
      editor.image_list = JSON.stringify(imageList);
      editor.release_time = formatTimestamp() + '';
      await this.studentRepository.save(editor);
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
  // 更新新闻数据
  async updateNews(id, title, content, imageList) {
    try {
      await this.entityManager.transaction(async (manager) => {
        let editorData: Student;
        let image_list = JSON.stringify(imageList);
        if (id) {
          // 如果有新闻ID，则尝试从数据库中获取已存在的新闻对象
          editorData = await manager.findOne(Student, {
            where: {
              id,
            },
          });
          if (!editorData) {
            throw new Error('News not found');
          }
          let release_time = formatTimestamp() + '';
          // 更新新闻对象的属性
          Object.assign(editorData, {
            title,
            content,
            image_list,
            release_time,
          });
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
  // 删除新闻
  async deleteStu(id: any) {
    try {
      // 删除关联的图片数据
      await this.studentImageRepository
        .createQueryBuilder()
        .delete()
        .from(Student)
        .where('id = :id', { id })
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
    }
  }
  // 获取新闻数据->后台展示
  async getStuCount() {
    try {
      let xwdt = await this.studentRepository.count();
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
}
