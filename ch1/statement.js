import createStatementData from "./createStatementData.js";
import { plays, invoices } from "./json.js";

// 처리 된 데이터들을 display 하기 위한 로직
function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
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
}

function usd (aNumber) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber);
}

console.log(statement(invoices, plays))