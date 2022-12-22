import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ description: '유저 이름' })
  @Column({ unique: true, comment: '유저 이름' })
  username: string;

  @Field({ description: '유저 이메일' })
  @Column({ unique: true, comment: '유저 이메일' })
  email: string;

  @Column({ comment: '비밀번호' })
  password: string;

  @Field(() => String, { description: '생성 일자' })
  @CreateDateColumn({ comment: '생성 일자' })
  createAt: Date;

  @Field(() => String, { description: '업데이트 일자' })
  @UpdateDateColumn({ comment: '업데이트 일자' })
  updateAt: Date;
}
