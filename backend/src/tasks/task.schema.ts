import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  completed: boolean;

  @Prop({ required: true })
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);