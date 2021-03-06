# Ch1 - 리팩터링 첫번 째 예시
 
- 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩터링하고 나서 원하는 기능을 추가한다.

- 리팩터링은 첫 단계는 바로 코드 영역을 검사해줄 **테스트 코드**를 마련하는 것이다.

- 어떠한 변경점이 **생각난다면 바로 코드에 반영**하자. 그렇게되면 다음 번에 코드를 보게되면 다시 분석하지 않아도 코드 스스로가 자신이 하는 일이 무엇인지 말해줄 것이다.

- 함수를 추출하면 그 코드가 **하는 일이 무엇인지 알아볼 수 있도록 작성**하자. 또한
값이 바뀌지 않는 코드는 매개변수로 전달하고, 값이 바뀌면 return 으로 반환하자.

## 함수 쪼개기
- 긴 함수를 리팩토링 할 때는 먼저 전체동작을 각각의 부분으로 나눌 수 있는 지점을 찾아야 한다.

- **수정이 진행될 때 마다 테스트**를하면, 오류가 생기더라도 그 변경 폭이 좁기 때문에 확인할 수 있는 범위도 좁아서 문제를 찾고 해결하기에 훨씬 수월하다.
    조금씩 변경하고 매번 테스트 하는 것이 리팩터링 절차의 핵심이다.

- 변수의 이름은 명확하게 표현해야 한다.

- **함수의 반환 값에는 항상 result 라는 이름을 사용**해서 변수의 역할을 쉽게 알 수 있도록 한다. 그리고 매개변수의 역할이 애해하다면 부정 관사(a/an) 을 붙히는 것도 정말 유용하다.

- 컴퓨터가 이해하는 코드는 바보도 작성할 수 있다. 사람이 이해하도록 작성하는 프로그래머가 좋은 프로그래머다. 좋은 코드는 **하는 일이 명확히 드러나야 하며, 변수 이름은 큰 역할**을 한다.

- 임시 변수들 때문에 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 복잡해지기 때문에 **임시 변수를 질의 함수**로 바꿔야 한다. 

```
질의 함수: 연산을 통해 값을 계산하여 반환하는 함수.
```

- 지역 변수를 제거해서 얻는 가장 큰 장점은 추출 작업이 훨씬 쉬워진다. 따라서 함수 추출 전에 지역 변수부터 제거하는 것도 좋은 방법이다.
```javascript
//...
//let thisAmount = amountFor(perf);

//result = format(thisAmount/100);
result = format(amountFor(perf)/100);
//...
```

- 리팩터링으로 인한 성능 문제는 특별한 경우가 아니라면 일단 무시해도 나쁘지 않다. 잘 다듬어진 코드가 나중에 성능 개선에도 도움이 되기 때문이다.

## 계산 단계와 포맷팅 단계 분리하기
- 우선 필요한 데이터를 처리하고, 앞서 처리한 결과를 텍스트나 HTML 로 표현한다.

- 중간 데이터 구조를 사용하여 필요 없는 인수들을 제거할 수 있다. 
```javascript
const statement = (invoice) => {
    const statementData = {};   // 중간데이터 구조
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    return renderPlainText(statementData);
}

const renderPlainText = (data) => {
    let result = `청구 내역 (고객명: ${data.customer})\n`;
    //...
}
```

- 데이터를 가져오는 로직과 데이터를 활용하는 로직을 나눈 뒤, 중간 데이터 구조를 통해 값을 전달한다.
```javascript
const renderPlainText = (data) => {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (const perf of data.performances) {
        result += ` ${perf.play.name}: ${format(perf.amount/100)} (${perf.audience}석)\n`;
    }

    result += `총액: ${format(data.totalAmount/100)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    //...
}

const statement = (invoice) => {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    //...
    return renderPlainText(statementData);
}
```

- 코드의 길이가 길어질 수도 있지만, 기능 별로 모듈화를 하게 된다면 각 부분들의 하는 일을 알 수 있고, 돌아가는 과정을 파악하기 쉬워진다는 장점이 있다.

## 다형성을 활용해 계산 코드 재구성하기
```javascript
// Polymorphism
class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
      this.performance = aPerformance;
      this.play = aPlay;
    }

    get amount() {
        //...
    }

    get volumeCreditsFor() {
        //...
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        //...
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        //...
    }
}

```

- 함수를 이용해서 객체를 생성한다면 상황에 따라 어떤 함수를 생성할 지 선택할 수 있다.

- 조건부 로직을 다형성으로 사용할 수 있다.
```javascript
function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        //...
    }
}
```
이렇게 된다면 새로운 장르가 추가된다면 해당 장르의 서브 클래스를 작성하고 ```createPerformanceCalculator``` 메서드에 추가해주기만 하면된다.

#### 좋은 코드를 확인할 수 있는 방법은  '얼마나 수정하기 쉬운가' 이다.
#### 건강한 코드는 생산성을 향상시키고, 필요한 기능을 더 빠르고 저렴한 비용으로 제공해준다.

