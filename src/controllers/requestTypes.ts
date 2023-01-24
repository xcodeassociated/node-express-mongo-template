import { Request } from 'express';

export type Page = {
  page: number;
  size: number;
  sort: string;
  direction: string;
};

export const getPageFromRequest = (req: Request): Page => {
  // @ts-ignore
  const page: number = parseInt(req.query.page) || 0;
  // @ts-ignore
  const size: number = parseInt(req.query.size) || 10;
  // @ts-ignore
  const sort: string = req.query.sort || 'createdAt';
  // @ts-ignore
  const direction: string = req.query.direction || 'asc';
  const pageRequest: Page = { page: page, size: size, sort: sort, direction: direction };

  return pageRequest;
};

export const getSort = (sortInput: string, directionInput: string): string => {
  if (directionInput.toLowerCase() === 'asc') {
    return sortInput;
  } else {
    return `-${sortInput}`;
  }
};