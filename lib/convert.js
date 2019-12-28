const convert = (cotacao, quantidade) => {
    return quantidade * cotacao
}

const toMoney = valor => {
    return parseFloat(valor).toFixed(2)
}

module.exports = {
    convert,
    toMoney
}