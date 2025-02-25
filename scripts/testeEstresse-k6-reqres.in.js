import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },   // Aquece com 50 usuários
    { duration: '1m', target: 200 },   // Sobe rapidamente para 200 usuários
    { duration: '3m', target: 500 },   // Estressa o sistema com 500 usuários
    { duration: '1m', target: 1000 },  // Atinge um pico extremo de 1000 usuários
    { duration: '2m', target: 0 },     // Carga cai rapidamente (simula crash)
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'], // 95% das requisições devem ser < 1000ms
    'http_req_failed': ['rate<0.05'],    // Erros abaixo de 5%
  },
};

// 🔥 Certifique-se de que a função abaixo está presente
export default function () {
  let res = http.get('https://reqres.in/api/users?page=2');

  check(res, {
    'GET - status é 200': (r) => r.status === 200,
    'GET - resposta em menos de 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
