import { Entity,PrimaryGeneratedColumn,Column} from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    user_name:string

    @Column()
    user_password:string

    @Column()
    create_time:string
} 
