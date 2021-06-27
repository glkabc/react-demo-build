import { setupWorker } from 'msw';
import handlers from './handleser';


const runStartMocks = ():void => {
  const worker = setupWorker(...handlers);
  worker.start();
}

if (process.env.NODE_ENV === 'development') {
  runStartMocks();
}

export {}