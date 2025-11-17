import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const getProductsDuration = new Trend('get_products_duration');
const RateContentOK = new Rate('rate_content_ok');

export const options = {
  stages: [
    { duration: '1m', target: 7 },
    { duration: '1m30s', target: 92 },
    { duration: '1m', target: 92 }
  ],
  thresholds: {
    'get_products_duration': ['p(90)<6800'],
    'rate_content_ok': ['rate>0.75']
  }
};

export default function () {
  const baseUrl = 'https://dummyjson.com/products';

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const OK = 200;

  const res = http.get(`${baseUrl}`, params);

  getProductsDuration.add(res.timings.duration);

  RateContentOK.add(res.status === OK);

  check(res, {
    'GET Products - Status 200': () => res.status === OK
  });
}
