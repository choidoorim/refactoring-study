// 데이터를 처리하는 로직들
class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
      this.performance = aPerformance;
      this.play = aPlay;
    }

    get amount() {
        throw new Error('서브 클래스에서 처리되도록 설계되었습니다.');
    }

    get volumeCredits() {
        return Math.floor(this.performance.audience / 5);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if(this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`알 수 없는 장르: ${aPlay.type}`)
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
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
        const result = Object.assign({},  aPerformance);
        // renderPlainText 에서 사용하는 playFor, amountFor 함수 중간함수로 대체
        result.play = calculator.play;
        result.amount = calculator.amount;  // 공연료
        result.volumeCredits = calculator.volumeCredits; // 적립 포인트
        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
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