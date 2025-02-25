import http from 'k6/http';
import { check, sleep, fail } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },  // Aquece com 10 usuários
    { duration: '1m', target: 50 },   // Carga estável com 50 usuários
    { duration: '30s', target: 0 },   // Finaliza suavemente
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1500'], // 95% das requisições devem ser < 1500ms
    'http_req_failed': ['rate<0.05'],    // Erros abaixo de 5%
  },
};

export default function () {
  let res = http.get('https://reqres.in/api/users?page=2', {
    timeout: '5s', // Simula falha se o tempo de resposta for maior que 5s
  });

  check(res, {
    'GET - status é 200': (r) => r.status === 200,
    'GET - resposta em menos de 1.5s': (r) => r.timings.duration < 1500,
  }) || fail('Serviço indisponível ou muito lento');

  // Simulando alta latência
  sleep(Math.random() * 3); // Tempo de espera aleatório de até 3 segundos

  // Testando recuperação com nova requisição
  let retryRes = http.get('https://reqres.in/api/users?page=2');

  check(retryRes, {
    'RECOVERY - resposta bem-sucedida após falha': (r) => r.status === 200,
  });

  sleep(1);
}
