const invoices =
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


const plays = {
    "hamlet": {"name": "Hamlet", "type":  "tragedy"},
    "as-like": {"name": "As you Like it", "type": "comedy"},
    "othello": {"name": "Othello", "type":  "tragedy"}
}

const playFor = (aPerformace) => plays[aPerformace.playID];

const amountFor = (aPerformance) => {
    let result = 0;

    switch (playFor(aPerformance).type) {
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
            throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }

    return result;
}

const volumeCreditsFor = (aPerformance) => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공
    if ("comedy" === playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
    }

    return result;
}

const format = (aNumber) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);

const totalVolumeCredits = (data) => {
    let result = 0;
    for (const perf of data.performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

const totalAmount = (data) => {
    let result = 0;
    for (const perf of data.performances) {
        result += amountFor(perf);
    }
    return result;
}

//
const renderPlainText = (data) => {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (const perf of data.performances) {
        //청구 내역 출력
        result += ` ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    }

    result += `총액: ${format(totalAmount(data)/100)}\n`;
    result += `적립 포인트: ${totalVolumeCredits(data)}점\n`;
    return result;
}

// playFor 함수를 통해 plays 의 값을 읽어온다.
// thisAmount 의 값을 추출할 때는 amountFor 메서드를 사용한다.
const statement = (invoice) => {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    return renderPlainText(statementData);
}

console.log(statement(invoices))