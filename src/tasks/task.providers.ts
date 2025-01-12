import { DataSource } from "typeorm";
import { Task } from "./task.entity";
import { TYPE_ORM_DATA_SOURCE } from "src/constants";
import { TASK_REPOSITORY_NAME } from "./constants";

export const taskProviders = [
  {
    provide: TASK_REPOSITORY_NAME,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
    inject: [TYPE_ORM_DATA_SOURCE],
  },
];
