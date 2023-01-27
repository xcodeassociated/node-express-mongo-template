import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

const EXT_HOST = 'http://localhost:8080';

type SampleResponseDto = {
  data: string;
};

const extPost = async (data: SampleResponseDto): Promise<AxiosResponse<SampleResponseDto, any>> =>
  axios.post<SampleResponseDto>(`${EXT_HOST}/sample`, data);

const extGet = async (id: string): Promise<AxiosResponse<SampleResponseDto, any>> => axios.get<SampleResponseDto>(`${EXT_HOST}/sample/${id}`);

const extPut = async (id: string, data: SampleResponseDto): Promise<AxiosResponse<SampleResponseDto, any>> =>
  axios.put<SampleResponseDto>(`${EXT_HOST}/sample/${id}`, data);

const extDelete = async (id: string): Promise<AxiosResponse<void, any>> => axios.delete<void>(`${EXT_HOST}/sample/${id}`);

const extPostHandler = async (req: Request, res: Response) => {
  const { data } = req.body;

  console.log(`[external]: POST with body: ${JSON.stringify(req.body)}`);
  const response: AxiosResponse<SampleResponseDto, any> = await extPost({ data });

  console.log(`[external]: received: ${JSON.stringify(response.data)}`);
  return res.status(200).contentType('application/json').json(response.data);
};

const extGetHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`[external]: GET with: ${id}`);

  const response: AxiosResponse<SampleResponseDto, any> = await extGet(id);

  console.log(`[external]: received: ${JSON.stringify(response.data)}`);
  return res.status(200).contentType('application/json').json(response.data);
};

const extPutHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data } = req.body;

  console.log(`[external]: PUT with id: ${id}, body: ${JSON.stringify(req.body)}`);

  const response: AxiosResponse<SampleResponseDto, any> = await extPut(id, { data });

  console.log(`[external]: received: ${JSON.stringify(response.data)}`);

  return res.status(200).contentType('application/json').json(response.data);
};

const extDeleteHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`[external]: DELETE with id: ${id}`);

  const response: AxiosResponse<void, any> = await extDelete(id);

  console.log(`[external]: received: ${JSON.stringify(response.data)}`);

  return res.sendStatus(200);
};

export { extPostHandler, extGetHandler, extPutHandler, extDeleteHandler };
