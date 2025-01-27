import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const getUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
