import * as http from 'http';
import * as https from 'https';
import * as logger from 'winston';

export class myHttpRequest {
    private protocol: string;
    private host: string;
    private port: number;
    private path: string;
    private isChunk: boolean = true;
    private cTypeMap: any = {
        'image/webp': 'webp',
        'image/bmp': 'bmp',
        'image/jpeg': 'jpg',
        'image/gif': 'gif',
        'image/png': 'png',
        'application/x-jpg': 'jpg',
        'application/x-png': 'png'
    };
    private contentType: string;

    constructor(host: string, path: string, protocol: string = 'http', port?: number) {
        if (!port && protocol === 'http') port = 80;
        if (!port && protocol === 'https') port = 443;
        if (!port) port = 80;
        this.protocol = protocol;
        this.host = host;
        this.path = path;
        this.port = port;
    }

    private request(opts: https.RequestOptions, content?: string) {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            let request: http.ClientRequest,
                resTime: any,
                chunks: any[] = [],
                size: number = 0;

            function cb(res: http.IncomingMessage) {
                if (!self.isChunk) {
                    res.setEncoding('binary');
                    self.contentType = res.headers ? res.headers['content-type'] : null;
                }
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                    size += chunk.length;
                }).on('end', () => {
                    clearTimeout(resTime);
                    if (self.isChunk) {
                        let buf = Buffer.concat(chunks, size);
                        resolve(buf.toString());
                    } else {
                        resolve(chunks.join(''));
                    }
                })
            }

            if (self.protocol === 'https') {
                request = https.request(opts, (res) => cb(res));
            } else {
                request = http.request(opts, (res) => cb(res));
            }

            request.on('socket', () => {
                resTime = setTimeout(() => { request.abort() }, 30000);
            });

            request.on('error', (e) => {
                logger.error(`myHttpRequest error : ${e}`);
                reject(e);
            });

            if (content) request.write(content);
            request.end();
        })
    }

    postxml(xml: string, opts?: any) {
        let options: any = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml;charset=utf-8',
                'Content-Length': Buffer.byteLength(xml)
            }
        }
        if (opts) {
            for (let key in opts) {
                options[key] = opts[key];
            }
        }

        return this.request(options, xml);
    }

    post(obj: any) {
        let jsonObject = JSON.stringify(obj);
        let options = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
            }
        }

        return this.request(options, jsonObject);
    }

    get(obj?: any) {
        let str = '';
        if (obj) {
            let i = 0;
            let str_pre = '&';
            for (let key in obj) {
                if (i == 0) str_pre = '?';
                str += `${str_pre}${key}=${obj[key]}`;
                i++;
            }
        }

        let options = {
            host: this.host,
            port: this.port,
            path: this.path + str,
            method: 'GET'
        }

        return this.request(options);
    }

    async getImg() {
        this.isChunk = false;
        let options = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'GET',
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'upgrade-insecure-requests': 1,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
            }
        }

        let chunks = await this.request(options);
        let format = this.contentType ? this.cTypeMap[this.contentType] : null;

        return {
            format: format ? format : 'webp',
            chunks: chunks
        }
    }
}