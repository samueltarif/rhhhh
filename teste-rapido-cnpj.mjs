// Teste rápido da API CNPJ
const response = await fetch('http://localhost:3001/api/consulta-cnpj', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cnpj: '47960950000121' })
})

const dados = await response.json()
console.log('Status:', response.status)
console.log('Sucesso:', dados.success)
console.log('Nome:', dados.data?.nome)
console.log('CNPJ:', dados.data?.cnpj)