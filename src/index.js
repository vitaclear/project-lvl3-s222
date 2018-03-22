/* eslint-env browser */
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import addStream from './handler';

const rssList = {};

export default function () {
  addStream(rssList);
}
