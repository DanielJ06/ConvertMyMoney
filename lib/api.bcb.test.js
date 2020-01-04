const api = require('./api.bcb')
const axios = require('axios')

jest.mock('axios')

test('getCotacaoAPI', () => {
    const res = {
        data: {
            value: [
                { cotacaoVenda: 4.05 }
            ]
        }
    }
    axios.get.mockResolvedValue(res)
    api.getCotacaoAPI('url').then( resp => {
        expect(resp).toEqual(res)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})
test('extractCotacao', () => {
    const cotacao = api.extractCotacao({
        data: {
            value: [
                { cotacaoVenda: 4.05 }
            ]
        }
    })
    expect(cotacao).toBe('4.05')
})
describe('getToday', () => {
    const RealDate = Date

    function mockDate(date){
        global.Date = class extends RealDate {
            constructor(){
                return new RealDate(date)
            }
        }
    }
    afterEach(() => {
        global.Date = RealDate
    })

    test('getToday', () => {
        mockDate('2020-04-01T10:08:00z')
        const today = api.getToday()
        expect(today).toBe('4-1-2020')
    })
})

test('getURL', () => {
    const url = api.getUrl('MINHA-DATA')
    expect(url).toBe("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao")
})

test('getCotacao', () => {
    const res = {
        data: {
            value: [
                { cotacaoVenda: 4.05 }
            ]
        }
    }

    const getToday = jest.fn()
    getToday.mockReturnValue('04-01-2020')

    const getCotacaoAPI = jest.fn()
    getCotacaoAPI.mockReturnValue(Promise.reject('err'))

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue('4.05')

    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')
    
    api.pure
        .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
        .then( res => {
            expect(res).toBe('')
        })
})

