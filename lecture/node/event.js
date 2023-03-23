const EventEmitter = require('events');

const myEvent = new EventEmitter();

myEvent.addListener('event1',() => {
    console.log('이벤트1');
});
myEvent.on('event2',() => {
    console.log('이벤트2');
});
myEvent.on('event2',() => {
    console.log('이벤트2 추가');
});
myEvent.once('event3',() => {
    console.log('이벤트3'); //한 번만 실행
});


myEvent.emit('event1'); //이벤트 호출
myEvent.emit('event2'); //이벤트 호출
myEvent.emit('event3'); //이벤트 호출
myEvent.emit('event3'); //once로 인해 실행 안됨


myEvent.on('event4',() => {
    console.log('이벤트 4');
});
myEvent.removeAllListeners('event4');   //이벤트 연결된 모든 리스너 삭제
myEvent.emit('event4'); //실행 안됨


const listener = () => {
    console.log('이벤트5');
}
myEvent.on('event5', listener);
myEvent.removeListener('event5', listener);
myEvent.emit('event5'); //실행 안됨

console.log(myEvent.listenerCount('event2'));
