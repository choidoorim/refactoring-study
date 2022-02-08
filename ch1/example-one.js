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

const renderPlainText = (data) => {
    let result = `청구 내역 (고객명: ${data.customer})\n`;

    for (const perf of data.performances) {
        //청구 내역 출력
        result += ` ${perf.play.name}: ${usd(perf.amount/100)} (${perf.audience}석)\n`;
    }

    result += `총액: ${usd(data.totalAmount/100)}\n`;
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
    return result;

    function usd (aNumber) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
    }

}

// playFor 함수를 통해 plays 의 값을 읽어온다.
// thisAmount 의 값을 추출할 때는 amountFor 메서드를 사용한다.
const statement = (invoice, plays) => {
    return renderPlainText(createStatementData(invoice));

    function createStatementData(invoice) {
        const result = {};
        result.customer = invoice.customer;
        result.performances = invoice.performances.map(enrichPerformance);
        result.totalAmount = totalAmount(result);
        result.totalVolumeCredits = totalVolumeCredits(result);
        return result
    }

    function enrichPerformance(aPerformance) {
        const result = Object.assign({},  aPerformance);
        // renderPlainText 에서 사용하는 playFor, amountFor 함수 중간함수로 대체
        result.play = playFor(aPerformance);
        result.amount = amountFor(aPerformance);
        result.volumeCredits = volumeCreditsFor(aPerformance);
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance) {
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

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        // 희극 관객 5명마다 추가 포인트를 제공
        if ("comedy" === playFor(aPerformance).type) {
            result += Math.floor(aPerformance.audience / 5);
        }

        return result;
    }

    function totalVolumeCredits (data) {
        let result = 0;
        for (const perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;
    }

    function totalAmount(data) {
        let result = 0;
        for (const perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }
}

console.log(statement(invoices, plays))