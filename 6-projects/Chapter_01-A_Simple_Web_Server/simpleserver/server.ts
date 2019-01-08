import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";
import path from "path";
import fs from "fs";

interface mimeObject {
  [html: string]: string;
  jpeg: string;
  jpg: string;
  png: string;
  js: string;
  css: string;
}

// các kiểu dữ liệu mà server phục vụ
const mimeTypes: mimeObject = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css"
};

http
  .createServer((req: IncomingMessage, res: ServerResponse) => {
    // lấy tên resource mà request yêu cầu
    const uri = url.parse(req.url as string).pathname;
    // từ uri tạo thành đường dẫn file trong server
    // process:cwd():  returns the current working directory,
    const fileName = path.join(process.cwd(), unescape(uri as string));
    console.log(`Loading ${uri}`);
    // File System
    let stats: fs.Stats;

    try {
      // lấy trạng thái của file
      stats = fs.lstatSync(fileName);
    } catch (error) {
      res.writeHead(404, { "Content-type": "text/plan" });
      res.write(`404 Not Found`);
      res.end();
      return;
    }
    // nếu file tồn tại
    if (stats.isFile()) {
      // lấy kiểu file
      const type = <string>path
        .extname(fileName)
        .split(".")
        .reverse()[0];
      // từ kiểu file ánh xạ lấy ra kiểu dữ liệu mà server phục vụ
      const mimeType = mimeTypes[type];
      // write header response
      res.writeHead(200, { "Content-type": mimeType });
      // đọc file
      const fileStream = fs.createReadStream(fileName);
      // write file to response
      fileStream.pipe(res);
    } else if (stats.isDirectory()) {
      // nếu không phải file mà là thư mục thì đọc file index
      res.writeHead(302, {
        Location: "index.html"
      });
      res.end();
    } else {
      // không phải file không phải thư mục thì trả error code 500
      res.writeHead(500, { "Content-type": "text/plain" });
      res.write("500 Internal Error\n");
      res.end();
    }
  })
  .listen(3000);
