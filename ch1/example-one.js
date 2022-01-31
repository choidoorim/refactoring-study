const invoices = [
    {
        "customer": "BigCo",
        "performances": [
            {
                "playID": "hamlet",
                "audience": 55
            },
            {
                "playID": "as-like",
                "audience": 35
            },
            {
                "playID": "othello",
                "audience": 40
            }
        ]
    }
]

const plays = {
    "hamlet": {"name": "Hamlet", "type":  "tragedy"},
    "as-like": {"name": "As you Like it", "type": "comedy"},
    "othello": {"name": "Othello", "type":  "tragedy"}
}

const playFor = (aPerformace) => plays[aPerformace.playID];

const amountFor = (aPerformance, play) => {
    let result = 0;

    switch (play.type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if(aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience
            break;
        default:
            throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    return result;
}

const statement = (invoice, plays) => {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;

    for (const perf of invoice.performances) {
        const play = playFor(perf);
        // thisAmount 의 값을 추출할 때는 amountFor 메서드를 사용한다.
        let thisAmount = amountFor(perf, play);
        // 포인트 적립
        volumeCredits += Math.max(perf.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공
        if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        //청구 내역 출력
        result += ` ${play.name}: \$${(thisAmount/100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }

    result += `총액: \$${(totalAmount/100)}\n`;
    result += `적립 포인트: ${volumeCredits}점\n`;
    return result;
}

console.log(statement(invoices[0], plays))