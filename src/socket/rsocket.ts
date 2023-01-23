import { RSocketConnector, RSocketServer } from 'rsocket-core';
import { Codec, RSocketRequester, RSocketResponder } from 'rsocket-messaging';
import { RxRequestersFactory, RxRespondersFactory } from 'rsocket-adapter-rxjs';
import { WebsocketClientTransport } from 'rsocket-websocket-client';
import { WebsocketServerTransport } from 'rsocket-websocket-server';
import WebSocket from 'ws';
import { firstValueFrom, interval, map, Observable, of, take, tap, timer } from 'rxjs';

let serverCloseable;

class EchoService {
  handleEchoRequestResponse(data: string): Observable<string> {
    return timer(1000).pipe(map(() => `Echo: ${data}`));
  }

  handleEchoRequestStream(data: string): Observable<string> {
    return interval(1000).pipe(
      map(() => `RxEchoService Echo: ${data}`),
      tap((value) => {
        console.info(`[server] sending: ${value}`);
      }),
    );
  }

  handleEchoRequestChannel(datas: Observable<string>): Observable<string> {
    datas
      .pipe(
        tap((value) => {
          console.info(`[server] receiving: ${value}`);
        }),
      )
      .subscribe();
    return interval(200).pipe(
      map((data) => `RxEchoService Echo: ${data}`),
      tap((value) => {
        console.info(`[server] sending: ${value}`);
      }),
    );
  }

  handleLogFireAndForget(data: string): Observable<void> {
    console.info(`[server] received: ${data}`);
    return of();
  }
}

function makeServer() {
  // eslint-disable-next-line no-use-before-define
  const stringCodec = new StringCodec();

  return new RSocketServer({
    transport: new WebsocketServerTransport({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      wsCreator: (options) => {
        return new WebSocket.Server({
          port: 8081,
        });
      },
    }),
    acceptor: {
      accept: async () => {
        const echoService = new EchoService();

        return RSocketResponder.builder()
          .route('EchoService.log', RxRespondersFactory.fireAndForget(echoService.handleLogFireAndForget, stringCodec))
          .route(
            'EchoService.echo',
            RxRespondersFactory.requestResponse(echoService.handleEchoRequestResponse, { inputCodec: stringCodec, outputCodec: stringCodec }),
          )
          .route(
            'EchoService.echoStream',
            RxRespondersFactory.requestStream(echoService.handleEchoRequestStream, { inputCodec: stringCodec, outputCodec: stringCodec }),
          )
          .route(
            'EchoService.echoChannel',
            RxRespondersFactory.requestChannel(echoService.handleEchoRequestChannel, { inputCodec: stringCodec, outputCodec: stringCodec }, 4),
          )
          .build();
      },
    },
  });
}

function makeConnector() {
  return new RSocketConnector({
    transport: new WebsocketClientTransport({
      url: 'ws://localhost:8081',
      wsCreator: (url) => new WebSocket(url) as any,
    }),
  });
}

async function fireAndForget(rsocket: RSocketRequester, route = '') {
  return new Promise((resolve, reject) => {
    rsocket
      .route(route)
      // eslint-disable-next-line no-use-before-define
      .request(RxRequestersFactory.fireAndForget('Hello World', stringCodec))
      .subscribe({
        complete() {
          // give server a chance to handle before continuing
          setTimeout(() => {
            resolve(null);
          }, 100);
        },
        error(err) {
          reject(err);
        },
      });
  });
}

async function requestResponse(rsocket: RSocketRequester, route = '') {
  return firstValueFrom(
    rsocket
      .route(route)
      // eslint-disable-next-line no-use-before-define
      .request(RxRequestersFactory.requestResponse('Hello World', stringCodec, stringCodec))
      .pipe(tap((data) => console.info(`payload[data: ${data};]`))),
  );
}

async function requestStream(rsocket: RSocketRequester, route = '') {
  return (
    rsocket
      .route(route)
      // eslint-disable-next-line no-use-before-define
      .request(RxRequestersFactory.requestStream('Hello World', stringCodec, stringCodec, 5))
      .pipe(
        tap((data) => {
          console.info(`[client] received[data: ${data}]`);
        }),
        take(25),
      )
      .toPromise()
  );
}

async function requestChannel(rsocket: RSocketRequester, route = '') {
  return rsocket
    .route(route)
    .request(
      RxRequestersFactory.requestChannel(
        interval(1000).pipe(
          map((i) => `Hello World ${i}`),
          tap((data) => {
            console.info(`[client] produced[data: ${data}]`);
          }),
        ),
        // eslint-disable-next-line no-use-before-define
        stringCodec,
        // eslint-disable-next-line no-use-before-define
        stringCodec,
        5,
      ),
    )
    .pipe(
      tap((data) => {
        console.info(`[client] received[data: ${data}]`);
      }),
      take(25),
    )
    .toPromise();
}

class StringCodec implements Codec<string> {
  readonly mimeType: string = 'text/plain';

  decode(buffer: Buffer): string {
    return buffer.toString();
  }

  encode(entity: string): Buffer {
    return Buffer.from(entity);
  }
}

const stringCodec = new StringCodec();

export async function main() {
  const server = makeServer();
  const connector = makeConnector();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serverCloseable = await server.bind();
  const rsocket = await connector.connect();
  const requester = RSocketRequester.wrap(rsocket);

  console.info(`----- Fire And Forget -----`);

  await fireAndForget(requester, 'EchoService.log');

  console.info(`----- Request Response -----`);

  // this request will pass
  await requestResponse(requester, 'EchoService.echo');

  // this request will reject (unknown route)
  // try {
  //   await requestResponse(requester, 'UnknownService.unknown');
  // } catch (e) {
  //   console.error(e);
  // }

  // this request will reject (no routing data)
  // try {
  //   await requestResponse(requester);
  // } catch (e) {
  //   console.error(e);
  // }

  // console.info(`----- Request Stream -----`);
  // // this request will pass
  // await requestStream(requester, 'EchoService.echoStream');
  //
  // console.info(`----- Request Channel -----`);
  // // this request will pass
  // await requestChannel(requester, 'EchoService.echoChannel');
}
