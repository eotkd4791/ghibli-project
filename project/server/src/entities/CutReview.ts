import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@ObjectType()
@Entity()
export class CutReview extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field({ description: '감상평 내용' })
  @Column({ comment: '감상평 내용' })
  contents: string;

  @Field(() => Int, { description: '명장면 번호' })
  @Column({ comment: '명장면 번호' })
  cutId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cutReviews)
  user: User;

  @Field(() => String, { description: '생성 일자' })
  @CreateDateColumn({ comment: '생성 일자' })
  createdAt: Date;

  @Field(() => String, { description: '수정 일자' })
  @UpdateDateColumn({ comment: '수정 일자' })
  updateAt: Date;
}
