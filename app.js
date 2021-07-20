// RESTful web service

// 모듈 추출
const express = require('express');
const bodyParser = require('body-parser');

// 서버 생성/실행
const app = express();
app.listen(52273, () => {
  console.log('Server running at http://127.0.0.1:52273');
});

// 미들웨어 추가
app.use(bodyParser.urlencoded({
  extended: false
}));

// 변수 선언
let userCounter = 0;
const users = [];

// 라우트
app.get('/user', (request, response) => {
  response.send(users);
});

app.post('/user', (request, response) => {
  // 변수 선언
  const body = request.body;

  // 예외 처리
  if (!body.name)
    return response.status(400).send('name을 보내주세요.');
  else if (!body.region)
    return response.status(400).send('region을 보내주세요.');
  
  // 변수 추출
  const name = body.name;
  const region = body.region;

  // 데이터 저장
  const data = {
    id: userCounter++,
    name: name,
    region: region
  };
  users.push(data); // 사용자 추가

  // 응답
  response.send(data);
});

app.get('/user/:id', (request, response) => {
  // 변수 선언
  const id = request.params.id;

  // 데이터 검색
  const filtered = users.filter((user) => user.id == id); // (특정 사용자 정보 조회)

  // 응답
  if (filtered.length == 1)
    response.send(filtered[0]);
  else
    response.status(404).send('데이터가 존재하지 않습니다.');
});

app.put('/user/:id', (request, response) => {
  // 변수 선언
  const id = request.params.id;
  let isExist = false;

  // 데이터 수정
  users.forEach((user) => {
    // 데이터가 존재한다면
    if (user.id == id) {
      // 수정
      isExist = true;
      if (request.body.name)
        users[id].name = request.body.name;
      if (request.body.region)
        users[id].region = request.body.region;
      
      // 응답
      response.send(user);
    }
  });

  // 데이터가 존재하지 않는다면
  if (!isExist)
    // 응답
    response.status(404).send('데이터가 존재하지 않습니다.');
});

app.delete('/user/:id', (request, response) => {
  // 변수 선언
  const id = request.params.id;
  let deletedUser = null;

  // 데이터 제거
  for (let i = users.length - 1; i >= 0; i--) {
    // id가 일치하면
    if (users[i].id == id) {
      // 저장 + 제거
      deletedUser = users[i];
      users.splice(i, 1);

      // 벗어남
      break;
    }
  }
  
  // 응답
  if (deletedUser)
    response.send(deletedUser);
  else
    response.status(404).send('데이터가 존재하지 않습니다.');
});