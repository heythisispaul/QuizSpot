import app from './app';
import { Request, Response } from '../node_modules/@types/express';
import * as path from 'path';

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.listen(port, (): void => {
    console.log('Express running on ' + port);
})