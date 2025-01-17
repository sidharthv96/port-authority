import * as net from 'net';
import { host } from './constants';

let promise: Promise<any>;


export function weird() {
	if (!promise) {
		promise = get_weird(9000);
	}
	return promise;
}

function get_weird(port: number) {
	return new Promise(fulfil => {
		const server = net.createServer();

		server.unref();

		server.on('error', () => {
			fulfil(get_weird(port + 1));
		});

		server.listen({ host, port }, () => {
			const server2 = net.createServer();

			server2.unref();

			server2.on('error', () => {
				server.close(() => {
					fulfil(false);
				});
			});

			server2.listen({ host, port }, () => {
        server2.close(() => {
          server.close(() => {
            fulfil(true);
          });
        });
      });
		});
	});
}
