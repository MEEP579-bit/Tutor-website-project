import { Request, Response, NextFunction } from "express";
import * as service from "./verification.service";

// Controller cho module "verification" — Upload & duyệt CCCD/thẻ SV/bằng cấp/chứng chỉ, cấp huy hiệu xác minh
// TODO: thêm các handler tương ứng với route trong verification.routes.ts
