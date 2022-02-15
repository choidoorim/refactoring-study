// 데이터를 처리하는 로직들
class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
      this.performance = aPerformance;
      this.play = aPlay;
    }
}

export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

    function enrichPerformance(aPerformance) {
        // NOTE: 공연료 계산기를 만들어주는 객체
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        console.log(calculator);
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