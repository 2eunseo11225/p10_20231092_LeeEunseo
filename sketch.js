const TIMES = [
"00","01","02","03","04","05",
"06","07","08","09","10","11",
"12","13","14","15","16","17",
"18","19","20","21","22","23"
];

const LINE_COLORS = {
  "2호선":"#3CB44A",
  "5호선":"#996CAC",
  "6호선":"#C55C1D",
  "경의중앙선":"#7CC242"
};

let currentTimeIndex = 0;
let particles = [];
let stations = {};

const connections = [
  ["합정","홍대입구"],
  ["홍대입구","신촌"],
  ["신촌","이대"],
  ["이대","아현"],
  ["아현","충정로"],

  ["합정","상수"],
  ["상수","광흥창"],
  ["광흥창","대흥"],
  ["대흥","공덕"],
  ["공덕","효창공원앞"],

  ["충정로","애오개"],
  ["애오개","공덕"],
  ["공덕","마포"],

  ["홍대입구","서강대"],
  ["서강대","대흥"],
  ["대흥","공덕"]
];

function makePassengers(base){

  let obj = {};

  for(let i=0;i<24;i++){

    let h = String(i).padStart(2,"0");

    let rush = 1;

    if(i>=7 && i<=9){
      rush = 2.5;
    }
    else if(i>=17 && i<=19){
      rush = 2.8;
    }
    else if(i>=12 && i<=14){
      rush = 1.6;
    }
    else if(i>=0 && i<=5){
      rush = 0.3;
    }

    obj[h] = max(
      0,
      floor(base * rush + random(-1000,1000))
    );
  }

  return obj;
}

function setup(){

  createCanvas(1200,800);

  stations = {

    "합정":{
      x:100,y:120,
      lines:["2호선","6호선"],
      passengers:makePassengers(12000)
    },

    "홍대입구":{
      x:250,y:120,
      lines:["2호선","경의중앙선"],
      passengers:makePassengers(18000)
    },

    "신촌":{
      x:400,y:120,
      lines:["2호선"],
      passengers:makePassengers(14000)
    },

    "이대":{
      x:550,y:120,
      lines:["2호선"],
      passengers:makePassengers(9000)
    },

    "아현":{
      x:700,y:120,
      lines:["2호선"],
      passengers:makePassengers(7000)
    },

    "충정로":{
      x:850,y:120,
      lines:["2호선","5호선"],
      passengers:makePassengers(10000)
    },

    "상수":{
      x:250,y:450,
      lines:["6호선"],
      passengers:makePassengers(7000)
    },

    "광흥창":{
      x:400,y:450,
      lines:["6호선"],
      passengers:makePassengers(8000)
    },

    "대흥":{
      x:550,y:450,
      lines:["6호선","경의중앙선"],
      passengers:makePassengers(9000)
    },

    "공덕":{
      x:700,y:450,
      lines:["5호선","6호선","경의중앙선"],
      passengers:makePassengers(18000)
    },

    "효창공원앞":{
      x:850,y:450,
      lines:["6호선","경의중앙선"],
      passengers:makePassengers(9000)
    },

    "애오개":{
      x:850,y:250,
      lines:["5호선"],
      passengers:makePassengers(7000)
    },

    "마포":{
      x:850,y:650,
      lines:["5호선"],
      passengers:makePassengers(10000)
    },

    "서강대":{
      x:400,y:300,
      lines:["경의중앙선"],
      passengers:makePassengers(8000)
    },

    "서강대학교":{
      x:520,
      y:220,
      school:true
    }
  };

  for(let i=0;i<300;i++){
    particles.push(new Particle());
  }
}

function draw(){

  background(18,22,30);

  drawConnections();
  drawParticles();
  drawStations();

  fill(255);
  noStroke();

  textAlign(LEFT);
  textSize(28);

  text(
    TIMES[currentTimeIndex] + ":00",
    20,
    35
  );

  if(frameCount % 300 === 0){

    currentTimeIndex =
      (currentTimeIndex + 1)
      % TIMES.length;
  }

  debugCoordinates();
}

function drawConnections(){

  stroke(80);
  strokeWeight(3);

  for(let c of connections){

    let a = stations[c[0]];
    let b = stations[c[1]];

    line(a.x,a.y,b.x,b.y);
  }
}

function drawStations(){

  let t = TIMES[currentTimeIndex];

  for(let name in stations){

    let s = stations[name];

    if(s.school){

      fill(255,220,0);
      rectMode(CENTER);
      square(s.x,s.y,22);

      fill(255);
      textAlign(CENTER);
      textSize(14);

      text(
        name,
        s.x,
        s.y + 30
      );

      continue;
    }

    let value = s.passengers[t];

    let size = map(
      value,
      0,
      50000,
      15,
      75
    );

    noStroke();

    if(s.lines.length === 1){

      fill(
        LINE_COLORS[
          s.lines[0]
        ]
      );

      circle(
        s.x,
        s.y,
        size
      );

    }else{

      let angle =
        TWO_PI /
        s.lines.length;

      for(
        let i=0;
        i<s.lines.length;
        i++
      ){

        fill(
          LINE_COLORS[
            s.lines[i]
          ]
        );

        arc(
          s.x,
          s.y,
          size,
          size,
          i*angle,
          (i+1)*angle,
          PIE
        );
      }
    }

    fill(255);

    textAlign(CENTER);
    textSize(12);

    text(
      name,
      s.x,
      s.y + size
    );
  }
}

function drawParticles(){

  for(let p of particles){

    p.update();
    p.display();
  }
}

class Particle{

  constructor(){

    this.reset();
  }

  reset(){

    this.connection =
      random(connections);

    this.direction =
      random([0,1]);

    this.progress =
      random();

    this.size =
      random(2,5);
  }

  update(){

    let t =
      TIMES[currentTimeIndex];

    let a =
      stations[
        this.connection[0]
      ];

    let b =
      stations[
        this.connection[1]
      ];

    let flow =
      (
        a.passengers[t] +
        b.passengers[t]
      ) / 2;

    let speed =
      map(
        flow,
        0,
        50000,
        0.001,
        0.015
      );

    if(this.direction === 0){
      this.progress += speed;
    }else{
      this.progress -= speed;
    }

    if(
      this.progress > 1 ||
      this.progress < 0
    ){
      this.reset();
    }

    this.x =
      lerp(
        a.x,
        b.x,
        this.progress
      );

    this.y =
      lerp(
        a.y,
        b.y,
        this.progress
      );
  }

  display(){

    noStroke();

    fill(
      255,
      180
    );

    circle(
      this.x,
      this.y,
      this.size
    );
  }
}

function debugCoordinates(){

  fill(255);
  rect(
    10,
    height-40,
    170,
    30
  );

  fill(0);

  textSize(14);

  text(
    mouseX + ", " + mouseY,
    20,
    height-20
  );
}