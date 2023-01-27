import { Request, Response } from 'express';

const postHandler = async (req: Request, res: Response) => {
  const { data } = req.body;

  console.log(`[sample]: POST with body: ${JSON.stringify(req.body)}`);
  console.log(`[sample]: returning: ${JSON.stringify(data)}`);
  return res.status(200).contentType('application/json').json({ data: data });
};

const getHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`[sample]: GET with: ${id}`);
  console.log(`[sample]: returning: ${id}`);
  return res.status(200).contentType('application/json').json({ data: id });
};

const putHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data } = req.body;

  console.log(`[sample]: PUT with id: ${id}, body: ${JSON.stringify(req.body)}`);
  console.log(`[sample]: returning: ${JSON.stringify(data)}`);
  return res.status(200).contentType('application/json').json({ data: data });
};

const deleteHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`[sample]: DELETE with id: ${id}`);
  return res.status(200).send();
};

export { postHandler, getHandler, putHandler, deleteHandler };
