import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 20 },  // Aquece com 20 usuários
    { duration: '2m', target: 100 }, // Mantém pico de 100 usuários
    { duration: '1m', target: 50 },  // Reduz carga para 50 usuários
    { duration: '30s', target: 0 },  // Finaliza o teste gradualmente
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% das requisições devem ser menores que 500ms
    'http_req_failed': ['rate<0.01'],   // Erros abaixo de 1%
  },
};

export default function () {
  let payload = JSON.stringify({
    name: 'John Doe',
    job: 'QA Engineer'
  });

  let headers = { 'Content-Type': 'application/json' };

  let postRes = http.post('https://reqres.in/api/users', payload, { headers });
  check(postRes, {
    'POST - status é 201': (r) => r.status === 201,
  });

  let userId;
  try {
    userId = JSON.parse(postRes.body).id;
  } catch (e) {
    userId = null;
  }

  if (userId) {
    let updatePayload = JSON.stringify({
      name: 'John Doe Updated',
      job: 'Senior QA Engineer'
    });

    let putRes = http.put(`https://reqres.in/api/users/${userId}`, updatePayload, { headers });
    check(putRes, {
      'PUT - status é 200': (r) => r.status === 200,
    });

    let deleteRes = http.del(`https://reqres.in/api/users/${userId}`);
    check(deleteRes, {
      'DELETE - status é 204': (r) => r.status === 204,
    });
  }

  sleep(1);
}
