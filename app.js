import data from './data.js'
let container = document.querySelector('.container');

let prev = document.querySelector('.prev');
let next = document.querySelector('.next');
let countHTML = document.querySelector('.count');
let btnWrapper = document.querySelector('.button__wrapper');
let start = document.querySelector('#start');
let finish = document.querySelector('#finish');
let timer = document.querySelector('.timer')

console.log(countHTML)

let username = window.localStorage.getItem('name') || prompt('Ismingizni kiriting:');
if(!window.localStorage.getItem('name'))window.localStorage.setItem('name', username);
let cloneTempl = templ.content;
let count = 1;
let rightAns = [];
let test = JSON.parse(window.localStorage.getItem('tests')) || false;
if(test){
    render(test);
    rightAns = test.map(e=>e.right);
    btnWrapper.classList.add('active');
    buttons(test.length, test);
    countHTML.textContent=`${count}/${test.length}`;
    finish.style.display ='block';
    count==1?prev.classList.add('disabled'):prev.classList.remove('disabled');
    setTimer(test);
}
else{
    start.classList.add('startActive');
}


start.addEventListener('click', ()=>{
    container.innerHTML =null;
    rightAns = [];
    let tests = randomTest();
    rightAns = tests.map(e=>e.right);
    window.localStorage.setItem('answers', JSON.stringify(rightAns.map(e=>undefined)))
    window.localStorage.setItem('checkInfo', JSON.stringify(rightAns.map(e=>[false, false, false])));
    window.localStorage.setItem('tests', JSON.stringify(tests))
    render(tests);
    start.classList.remove('startActive');
    console.log(rightAns);
    console.log(tests);
    btnWrapper.classList.add('active');
    !window.localStorage.getItem('buttons')? buttons(tests.length, tests):0;
    count==1?prev.classList.add('disabled'):prev.classList.remove('disabled')
    countHTML.textContent=`${count}/${tests.length}`;
    finish.classList.add('startActive');
    
    //setting timer
    
    setTimer(tests);
})
finish.addEventListener('click', ()=>{
   finishTest()
})

function finishTest(){
    let [max, ans] = checkAns(rightAns);
    let percent=Math.floor(ans/max*100);
    let ball = Math.round(5*percent/100);
    let name = window.localStorage.getItem('name');
    container.innerHTML = `Xurmatli ${name}! sizning natijangiz: <br/> foizda ${percent}%, balingiz: ${ball}, javoblar soni:${ans}/${max} `
    finish.classList.remove('startActive');
    window.localStorage.removeItem('tests');
    window.localStorage.removeItem('time');
    clearInterval(interval);
    timer.innerHTML =null
    btnWrapper.classList.remove('active');
    start.classList.add('startActive');
    count=1;
}


function buttons(length, test){next.addEventListener('click', ()=>{
    window.localStorage.setItem('buttons', 'active');
    count<length?++count:count;
    count==length?next.classList.add('disabled'):next.classList.remove('disabled');
    count==1?prev.classList.add('disabled'):prev.classList.remove('disabled')
    countHTML.textContent = `${count}/${length}`;
    render(test);
    
})
prev.addEventListener('click',()=> {
    count>1?--count:count;
    count==length?next.classList.add('disabled'):next.classList.remove('disabled');
    count==1?prev.classList.add('disabled'):prev.classList.remove('disabled')
    countHTML.textContent = `${count}/${length}`
    render(test);
    
});}

function render(data){
    container.textContent = null
    let temp = cloneTempl.cloneNode(true);
    let question = temp.querySelector('.question');
    let answers = [...temp.querySelectorAll('.answers')];
    let labels = [...temp.querySelectorAll('.labels')];
    let checkInfo = JSON.parse(window.localStorage.getItem('checkInfo'));
    for( let i in answers){
        answers[i].name = `${data[count-1].id}__ans`;
        answers[i].checked=checkInfo[count-1][i]; 
        answers[i].addEventListener('click', (e)=>{
         check(e, count-1);
         let newAns = answers.map(e=>false);
         newAns[i]=true;
         checkInfo.splice(count-1, 1, newAns);
         window.localStorage.setItem('checkInfo',JSON.stringify(checkInfo))
        });
        answers[i].value = data[count-1].answers[i];
        answers[i].id = `${data[count-1].id}__ans`;
        labels[i].textContent = data[count-1].answers[i];
    }
    question.textContent = `${count}. ${data[count-1].question}` 
    container.appendChild(temp);
}


//Choosing Random tests

function randomTest(){
    let randArr = [];
    while(randArr.length<10){
        let x = Math.floor(Math.random()*10);
        !randArr.includes(x)?randArr.push(x):randArr;
    };
    let randomTest = randArr.map(e=>data[e])
    return randomTest;
}
// checking


function check(e, num){
    let value = e.target.value;
    let rigthtArr = JSON.parse(window.localStorage.getItem('answers'));
    rigthtArr[num]=value;
    window.localStorage.setItem('answers', JSON.stringify(rigthtArr))
    console.log(rigthtArr);
}




function checkAns(arr){
    let max = arr.length;
    let ans = JSON.parse(window.localStorage.getItem('answers') )||0
    let b = 0;
     for(let i in arr){
        arr[i]==ans[i]?b=b+1:b
    };
    return [max, b]
}








var interval;

function setTimer(data){
    let length = data.length;
    let time = window.localStorage.getItem('time') ||length*2*60*1000;
    window.localStorage.setItem('time', time);
    interval =  setInterval(()=>{
        time=time-1000;
        let display = new Date(time);
        window.localStorage.setItem('time', time);
        let minute = display.getMinutes();
        let seconds = display.getSeconds();
        timer.textContent =`${minute}:${seconds}`;
       if(time ==0){
        let [max, ans] = checkAns(rightAns);
        let percent=Math.floor(ans/max*100);
        let ball = Math.round(5*percent/100);
        let name = window.localStorage.getItem('name');
        container.innerHTML = `Xurmatli ${name}! sizning natijangiz: <br/> foizda ${percent}%, balingiz: ${ball}, javoblar soni:${ans}/${max} `
        finish.classList.remove('startActive');
        window.localStorage.removeItem('tests');
        window.localStorage.removeItem('time')
        btnWrapper.classList.remove('active');
        start.classList.add('startActive');
        count=1;
       }
    }, 1000)

}





